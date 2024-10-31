import { useEffect } from "react";
import { type PomodoroSettings, type PomodoroState } from "../_lib/types";
import { Play } from "lucide-react";

interface PomodoroTimerProps {
  isActive: boolean;
  settings: PomodoroSettings;
  state?: PomodoroState;
  onTimeUpdate: () => void;
  onPhaseComplete: (phase: PomodoroState["currentPhase"]) => void;
  onStateUpdate: (state: Partial<PomodoroState>) => void;
}

export function PomodoroTimer({
  isActive,
  settings,
  state,
  onTimeUpdate,
  onPhaseComplete,
  onStateUpdate,
}: PomodoroTimerProps) {
  // Initialize state if not present
  useEffect(() => {
    if (!state) {
      onStateUpdate({
        isActive: false,
        currentPhase: "work",
        sessionTime: settings.workDuration * 60,
        cyclesCompleted: 0,
        waitingForNextPhase: false,
      });
    }
  }, [state, settings.workDuration]);

  // Reset timer when settings change
  useEffect(() => {
    if (state?.currentPhase === "work") {
      onStateUpdate({ sessionTime: settings.workDuration * 60 });
    } else if (state?.currentPhase === "shortBreak") {
      onStateUpdate({ sessionTime: settings.shortBreakDuration * 60 });
    } else if (state?.currentPhase === "longBreak") {
      onStateUpdate({ sessionTime: settings.longBreakDuration * 60 });
    }
  }, [settings]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && state && !state.waitingForNextPhase && state.sessionTime > 0) {
      interval = setInterval(() => {
        onStateUpdate({ sessionTime: state.sessionTime - 1 });
        onTimeUpdate();
      }, 1000);
    } else if (state?.sessionTime === 0 && !state?.waitingForNextPhase) {
      onPhaseComplete(state.currentPhase);
      onStateUpdate({ waitingForNextPhase: true });

      if (settings.autoStartCycles) {
        startNextPhase();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, state, settings.autoStartCycles]);

  const startNextPhase = () => {
    if (!state) return;

    if (state.currentPhase === "work") {
      const newCycles = state.cyclesCompleted + 1;
      if (newCycles % settings.cyclesBeforeLongBreak === 0) {
        onStateUpdate({
          currentPhase: "longBreak",
          sessionTime: settings.longBreakDuration * 60,
          cyclesCompleted: newCycles,
          waitingForNextPhase: false,
        });
      } else {
        onStateUpdate({
          currentPhase: "shortBreak",
          sessionTime: settings.shortBreakDuration * 60,
          cyclesCompleted: newCycles,
          waitingForNextPhase: false,
        });
      }
    } else {
      onStateUpdate({
        currentPhase: "work",
        sessionTime: settings.workDuration * 60,
        waitingForNextPhase: false,
      });
    }
  };

  if (!state) return null;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <span className="text-sm uppercase tracking-wider text-green-400">
          {state.currentPhase === "work"
            ? "Work Session"
            : state.currentPhase === "shortBreak"
            ? "Short Break"
            : "Long Break"}
        </span>
      </div>

      <div className="text-4xl mb-4">{formatTime(state.sessionTime)}</div>

      {state.waitingForNextPhase && (
        <button
          onClick={startNextPhase}
          className="px-4 py-2 bg-green-900/30 hover:bg-green-900/50 rounded flex items-center gap-2 mx-auto"
        >
          <Play className="w-4 h-4" />
          <span>
            Start {state.currentPhase === "work" ? "Break" : "Work Session"}
          </span>
        </button>
      )}

      <div className="mt-4 text-sm text-green-400">
        Cycle {(state.cyclesCompleted % settings.cyclesBeforeLongBreak) + 1} of{" "}
        {settings.cyclesBeforeLongBreak}
      </div>
    </div>
  );
}
