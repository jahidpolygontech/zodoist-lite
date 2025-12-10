import { motion } from 'framer-motion';
import { Check, Trash2, Calendar } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isDueOverdue = task.due_date && isPast(new Date(task.due_date)) && !task.completed;
  const formattedDate = formatDueDate(task.due_date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="task-item group border-b border-border last:border-b-0"
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className={cn('checkbox-custom mt-0.5 flex-shrink-0', task.completed && 'checked')}
      >
        {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-foreground transition-all',
            task.completed && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {task.description}
          </p>
        )}
        {formattedDate && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs mt-1.5',
              isDueOverdue ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        )}
      </div>

      {/* Delete button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-destructive/10 transition-all"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
      </motion.button>
    </motion.div>
  );
}
