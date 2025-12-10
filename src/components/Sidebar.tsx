import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CalendarDays, Inbox, CheckCircle2, Menu, X } from 'lucide-react';
import { ViewType } from '@/types/task';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
  taskCounts: {
    today: number;
    upcoming: number;
    inbox: number;
    completed: number;
  };
}

const navItems = [
  { id: 'inbox' as ViewType, label: 'Inbox', icon: Inbox },
  { id: 'today' as ViewType, label: 'Today', icon: Calendar },
  { id: 'upcoming' as ViewType, label: 'Upcoming', icon: CalendarDays },
  { id: 'completed' as ViewType, label: 'Completed', icon: CheckCircle2 },
];

export function Sidebar({
  currentView,
  onViewChange,
  isOpen,
  onToggle,
  taskCounts,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed md:relative z-50 h-full w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <h1 className="text-xl font-semibold text-foreground">Zodoist</h1>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-nav-hover transition-colors md:hidden"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  const count = taskCounts[item.id];

                  return (
                    <motion.li key={item.id}>
                      <button
                        onClick={() => onViewChange(item.id)}
                        className={cn(
                          'nav-item w-full justify-between',
                          isActive && 'active'
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </span>
                        {count > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {count}
                          </span>
                        )}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle button (when closed) */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-md border border-border hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </motion.button>
      )}
    </>
  );
}
