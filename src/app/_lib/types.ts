export interface Task {
  id: string;
  content: string;
  completed: boolean;
}

export interface Project {
  name: string;
  tasks: Task[];
  timeSpent: number;
  isTracking: boolean;
}
