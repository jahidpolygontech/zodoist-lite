import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TaskList } from '@/components/TaskList';
import { AddTaskModal } from '@/components/AddTaskModal';
import { useTasks } from '@/hooks/useTasks';
import { ViewType } from '@/types/task';
import { isToday, isFuture, parseISO } from 'date-fns';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks();

  const taskCounts = useMemo(() => ({
    inbox: tasks.filter((t) => !t.completed).length,
    today: tasks.filter(
      (t) => !t.completed && t.due_date && isToday(parseISO(t.due_date))
    ).length,
    upcoming: tasks.filter(
      (t) => !t.completed && t.due_date && isFuture(parseISO(t.due_date))
    ).length,
    completed: tasks.filter((t) => t.completed).length,
  }), [tasks]);

  const handleAddTask = async (title: string, description: string, dueDate: Date | undefined) => {
    await addTask(title, description, dueDate);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onAddTask={() => setIsModalOpen(true)}
        taskCounts={taskCounts}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <TaskList
          tasks={tasks}
          view={currentView}
          loading={loading}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
};

export default Index;
