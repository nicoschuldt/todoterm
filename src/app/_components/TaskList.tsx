import { Terminal, Check } from "lucide-react";
import { type Task } from "../_lib/types";

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskToggle }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center group cursor-pointer ${
            task.completed ? "text-green-800" : ""
          }`}
          onClick={() => onTaskToggle(task.id)}
        >
          <button className="mr-2 flex-shrink-0">
            {task.completed ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 border border-green-500 rounded-sm" />
            )}
          </button>
          <Terminal className="mr-2 w-4 h-4 mt-1 flex-shrink-0" />
          <p
            className={`font-light flex-grow ${
              task.completed ? "line-through" : ""
            }`}
          >
            {task.content}
          </p>
        </div>
      ))}
    </div>
  );
}
