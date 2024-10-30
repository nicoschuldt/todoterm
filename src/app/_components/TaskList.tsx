import { Terminal, Check } from "lucide-react";
import { type Task } from "../_lib/types";

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskToggle }: TaskListProps) {
  // Separate and sort tasks
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const TaskItem = ({ task }: { task: Task }) => (
    <div
      key={task.id}
      className={`flex items-center group cursor-pointer ${
        task.completed ? "text-green-800" : ""
      }`}
      onClick={() => onTaskToggle(task.id)}
    >
      <span className="mr-2 flex-shrink-0">~</span>
      <button className="mr-2 flex-shrink-0">
        {task.completed ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <div className="w-4 h-4 border border-green-500 rounded-sm" />
        )}
      </button>
      <p
        className={`font-light flex-grow ${
          task.completed ? "line-through" : ""
        }`}
      >
        {task.content}
      </p>
    </div>
  );

  return (
    <div className="space-y-2 m-2 lg:m-10">
      {/* Incomplete tasks */}
      {incompleteTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}

      {/* Separator if there are both complete and incomplete tasks */}
      {incompleteTasks.length > 0 && completedTasks.length > 0 && (
        <div className="border-t border-green-900 my-4" />
      )}

      {/* Completed tasks */}
      {completedTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
