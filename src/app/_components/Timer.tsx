import { Play, Pause } from "lucide-react";
import { PomodoroSettings, type Project, PomodoroState } from "../_lib/types";
import { PomodoroTimer } from "./PomodoroTimer";
import { useState } from "react";
import { DEFAULT_POMODORO_SETTINGS } from "../_lib/constants";

interface TimerProps {
  project: Project;
  onTimerToggle: (projectName: string) => void;
  onPomodoroComplete?: (phase: "work" | "shortBreak" | "longBreak") => void;
  onPomodoroStateUpdate: (projectName: string, state: Partial<PomodoroState>) => void;
}

export function Timer({
  project,
  onTimerToggle,
  onPomodoroComplete,
  onPomodoroStateUpdate,
}: TimerProps) {
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handlePhaseComplete = (phase: "work" | "shortBreak" | "longBreak") => {
    if (onPomodoroComplete) {
      onPomodoroComplete(phase);
    }
    // Stop the timer when a phase completes
    if (project.isTracking) {
      onTimerToggle(project.name);
    }
  };

  const handlePomodoroStateUpdate = (state: Partial<PomodoroState>) => {
    onPomodoroStateUpdate(project.name, state);
  };

  return (
    <div className="m-4 flex flex-col items-center">
      {isPomodoroMode ? (
        <PomodoroTimer
          isActive={project.isTracking}
          settings={project.pomodoroSettings || DEFAULT_POMODORO_SETTINGS}
          state={project.pomodoroState}
          onTimeUpdate={() => {/* Handle time update */}}
          onPhaseComplete={handlePhaseComplete}
          onStateUpdate={handlePomodoroStateUpdate}
        />
      ) : (
        <div className="text-5xl mb-6 tracking-wider text-green-500">
          {formatTime(project?.timeSpent || 0)}
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => onTimerToggle(project.name)}
          className={`
            px-6 py-2
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

        <button
          onClick={() => setIsPomodoroMode(!isPomodoroMode)}
          className={`
            px-6 py-2
            border border-green-500/20
            ${isPomodoroMode ? "bg-green-900/30" : "bg-green-950/30"}
            hover:bg-green-900/30
            hover:border-green-500/40
            transition-colors
            text-green-400
          `}
        >
          {isPomodoroMode ? "Standard Mode" : "Pomodoro Mode"}
        </button>
      </div>

      {isPomodoroMode && (
        <div className="text-sm text-green-400">
          Total Time: {formatTime(project?.timeSpent || 0)}
        </div>
      )}
    </div>
  );
}
