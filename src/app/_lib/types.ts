export interface Task {
  id: string;
  content: string;
  completed: boolean;
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  cyclesBeforeLongBreak: number;
  autoStartCycles: boolean;
}

export interface PomodoroState {
  isActive: boolean;
  currentPhase: "work" | "shortBreak" | "longBreak";
  sessionTime: number;
  cyclesCompleted: number;
  waitingForNextPhase: boolean;
}

export interface Project {
  name: string;
  tasks: Task[];
  timeSpent: number;
  isTracking: boolean;
  pomodoroSettings?: PomodoroSettings;
  pomodoroState?: PomodoroState;
}
