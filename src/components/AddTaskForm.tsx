import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Flag, Bell, MoreHorizontal, Inbox, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface AddTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, dueDate: Date | undefined) => Promise<void>;
}

export function AddTaskForm({ isOpen, onClose, onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onAdd(title.trim(), description.trim(), dueDate);
    setIsSubmitting(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate(new Date());
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && title.trim()) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
            {/* Date header */}
            <div className="px-4 py-2 border-b border-border">
              <span className="text-sm font-medium text-foreground">
                {format(dueDate || new Date(), 'd MMM')} · {format(dueDate || new Date(), 'EEEE')}
              </span>
            </div>

            {/* Input section */}
            <div className="p-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Task name"
                autoFocus
                className="w-full text-foreground placeholder:text-muted-foreground focus:outline-none bg-transparent font-medium"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Description"
                className="w-full mt-1 text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none bg-transparent"
              />

              {/* Tags row */}
              <div className="flex items-center gap-2 mt-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded border transition-colors",
                      dueDate ? "border-primary/30 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                    )}>
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{dueDate ? 'Today' : 'Date'}</span>
                      {dueDate && (
                        <X 
                          className="w-3 h-3 ml-0.5 hover:text-destructive" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDueDate(undefined);
                          }}
                        />
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <button className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:bg-muted transition-colors">
                  <Flag className="w-3.5 h-3.5" />
                  <span>Priority</span>
                </button>

                <button className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:bg-muted transition-colors">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Reminders</span>
                </button>

                <button className="inline-flex items-center justify-center w-7 h-7 text-xs rounded border border-border text-muted-foreground hover:bg-muted transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
              <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Inbox className="w-4 h-4" />
                <span>Inbox</span>
                <span className="text-xs">▼</span>
              </button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!title.trim() || isSubmitting}
                  onClick={handleSubmit}
                  className="bg-coral text-white hover:bg-coral/90"
                >
                  {isSubmitting ? 'Adding...' : 'Add task'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
