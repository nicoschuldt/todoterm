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

  return (
    <div className="m-4 flex flex-col items-center">
      <div className="text-5xl mb-6 tracking-wider text-green-500">
        {formatTime(project?.timeSpent || 0)}
      </div>
      <button
        onClick={() => onTimerToggle(project.name)}
        className={`
          mb-8 px-6 py-2
          border border-green-500/20
          bg-green-950/30
          hover:bg-green-900/30
          hover:border-green-500/40
          transition-colors
          flex items-center gap-3
          text-green-400
          shadow-[0_0_10px_rgba(0,255,0,0.1)]
        `}
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
    </div>
  );
}
