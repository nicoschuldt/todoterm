import { Play, Pause } from "lucide-react";
import { type Project } from "../_lib/types";
import { ProgressBar } from "./ProgressBar";

interface TimerProps {
  project: Project;
  onTimerToggle: (projectName: string) => void;
}

export function Timer({ project, onTimerToggle }: TimerProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const calculateProgress = (tasks: Project["tasks"]) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="text-4xl font-bold mb-4 font-mono tabular-nums">
        {formatTime(project?.timeSpent || 0)}
      </div>
      <button
        onClick={() => onTimerToggle(project.name)}
        className="mb-6 px-4 py-2 border border-green-500 hover:bg-green-900/50 flex items-center gap-2"
      >
        {project?.isTracking ? (
          <>
            <Pause className="w-4 h-4" />
            <span>Pause Timer</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Start Timer</span>
          </>
        )}
      </button>
      <ProgressBar progress={calculateProgress(project.tasks)} size="large" />
    </div>
  );
}
