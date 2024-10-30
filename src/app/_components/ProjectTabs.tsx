import { Folder, Plus, Clock, Home, Settings } from "lucide-react";
import { type Project } from "../_lib/types";
import { ProgressBar } from "./ProgressBar";
import { useRef } from "react";

interface ProjectTabsProps {
  projects: Project[];
  activeProject: string | null;
  editingProject: string | null;
  onProjectSelect: (name: string | null) => void;
  onProjectEdit: (name: string) => void;
  onProjectNameChange: (oldName: string, newName: string) => void;
  onProjectAdd: () => void;
}

export function ProjectTabs({
  projects,
  activeProject,
  editingProject,
  onProjectSelect,
  onProjectEdit,
  onProjectNameChange,
  onProjectAdd,
}: ProjectTabsProps) {
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleProjectNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newName = editInputRef.current?.value;
    if (newName && editingProject) {
      onProjectNameChange(editingProject, newName);
    }
  };

  const calculateProgress = (tasks: Project["tasks"]) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  return (
    <header className="flex border-b border-green-700 overflow-x-auto">
      <div className="flex-1 flex overflow-x-auto">
        <button
          className={`px-4 py-2 whitespace-nowrap ${
            activeProject === null
              ? "bg-green-900 text-green-300"
              : "hover:bg-green-900/50"
          }`}
          onClick={() => onProjectSelect(null)}
        >
          <Home className="inline-block mr-2 w-4 h-4" />
          Home
        </button>
        {projects.map((project) => (
          <div key={project.name} className="flex flex-col">
            {editingProject === project.name ? (
              <form onSubmit={handleProjectNameSubmit} className="px-2">
                <input
                  ref={editInputRef}
                  defaultValue={project.name}
                  className="bg-green-900 text-green-300 px-2 py-1 outline-none"
                  onBlur={() =>
                    onProjectNameChange(editingProject, project.name)
                  }
                />
              </form>
            ) : (
              <div className="flex flex-col">
                <button
                  className={`px-4 py-2 whitespace-nowrap ${
                    activeProject === project.name
                      ? "bg-green-900 text-green-300"
                      : "hover:bg-green-900/50"
                  }`}
                  onClick={() => onProjectSelect(project.name)}
                  onDoubleClick={() => onProjectEdit(project.name)}
                >
                  {project.isTracking ? (
                    <Clock className="inline-block mr-2 w-4 h-4 animate-pulse" />
                  ) : (
                    <Folder className="inline-block mr-2 w-4 h-4" />
                  )}
                  {project.name}
                </button>
                <ProgressBar
                  progress={calculateProgress(project.tasks)}
                  size="small"
                />
              </div>
            )}
          </div>
        ))}
        <button
          onClick={onProjectAdd}
          className="px-4 py-2 hover:bg-green-900/50 flex items-center"
          aria-label="Add new project"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        className={`px-4 py-2 whitespace-nowrap ${
          activeProject === "settings"
            ? "bg-green-900 text-green-300"
            : "hover:bg-green-900/50"
        }`}
        onClick={() => onProjectSelect("settings")}
      >
        <Settings className="inline-block mr-2 w-4 h-4" />
        Settings
      </button>
    </header>
  );
}
