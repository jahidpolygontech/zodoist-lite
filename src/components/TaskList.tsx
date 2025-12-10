import { motion, AnimatePresence } from 'framer-motion';
import { Task, ViewType } from '@/types/task';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';
import { isToday, isFuture, parseISO, format } from 'date-fns';
import { Inbox, Calendar, CalendarDays, CheckCircle2, Plus } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  view: ViewType;
  loading: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onAddTask: (title: string, description: string, dueDate: Date | undefined) => Promise<void>;
  isAddFormOpen: boolean;
  onToggleAddForm: () => void;
}

const viewConfig = {
  inbox: {
    title: 'Inbox',
    icon: Inbox,
    emptyText: 'Your inbox is empty',
  },
  today: {
    title: 'Today',
    icon: Calendar,
    emptyText: 'No tasks for today',
  },
  upcoming: {
    title: 'Upcoming',
    icon: CalendarDays,
    emptyText: 'No upcoming tasks',
  },
  completed: {
    title: 'Completed',
    icon: CheckCircle2,
    emptyText: 'No completed tasks yet',
  },
};

export function TaskList({ tasks, view, loading, onToggle, onDelete, onAddTask, isAddFormOpen, onToggleAddForm }: TaskListProps) {
  const config = viewConfig[view];
  const Icon = config.icon;

  const filteredTasks = tasks.filter((task) => {
    switch (view) {
      case 'inbox':
        return !task.completed;
      case 'today':
        return !task.completed && task.due_date && isToday(parseISO(task.due_date));
      case 'upcoming':
        return !task.completed && task.due_date && isFuture(parseISO(task.due_date));
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  return (
    <div className="flex-1 overflow-auto">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-2xl mx-auto p-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Icon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">{config.title}</h2>
          <span className="text-muted-foreground text-lg">({filteredTasks.length})</span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                <div className="w-5 h-5 bg-muted rounded-full" />
                <div className="flex-1 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Icon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">{config.emptyText}</p>
          </motion.div>
        )}

        {/* Add Task Form (inline) */}
        {view !== 'completed' && (
          <AddTaskForm
            isOpen={isAddFormOpen}
            onClose={onToggleAddForm}
            onAdd={async (title, description, dueDate) => {
              await onAddTask(title, description, dueDate);
              onToggleAddForm();
            }}
          />
        )}

        {/* Add Task Button */}
        {view !== 'completed' && !isAddFormOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onToggleAddForm}
            className="flex items-center gap-2 w-full p-3 text-muted-foreground hover:text-coral transition-colors group mb-4"
          >
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-coral group-hover:border-coral group-hover:text-white transition-colors">
              <Plus className="w-3 h-3" />
            </span>
            <span className="text-sm">Add task</span>
          </motion.button>
        )}

        {/* Task list */}
        {!loading && filteredTasks.length > 0 && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
