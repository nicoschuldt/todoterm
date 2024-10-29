"use client";
import { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Folder,
  Check,
  Plus,
  Clock,
  Pause,
  Play,
} from "lucide-react";

interface Task {
  id: string;
  content: string;
  completed: boolean;
}

interface Project {
  name: string;
  tasks: Task[];
  timeSpent: number;
  isTracking: boolean;
}

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [lastStartTime, setLastStartTime] = useState<number | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      const updatedProjects = parsedProjects.map((p: Project) => ({
        ...p,
        timeSpent: p.timeSpent || 0,
        isTracking: false,
      }));
      setProjects(updatedProjects);
      setActiveProject(updatedProjects[0]?.name || "");
    } else {
      const initialProject = {
        name: "Project 1",
        tasks: [],
        timeSpent: 0,
        isTracking: false,
      };
      setProjects([initialProject]);
      setActiveProject(initialProject.name);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (editingProject && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingProject]);

  useEffect(() => {
    const trackingProject = projects.find((p) => p.isTracking);

    if (trackingProject && lastStartTime) {
      timerInterval.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - lastStartTime) / 1000);

        setProjects((prev) =>
          prev.map((p) =>
            p.name === trackingProject.name
              ? { ...p, timeSpent: p.timeSpent + 1 }
              : p
          )
        );
      }, 1000);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [lastStartTime, projects]);

  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const renderProgressBar = (
    progress: number,
    size: "large" | "small" = "large"
  ) => {
    const blocks = size === "large" ? 30 : 15;
    const filledBlocks = Math.floor((progress / 100) * blocks);

    return (
      <div
        className={`
        w-full
        ${size === "large" ? "mb-8 px-4" : "h-1"}
      `}
      >
        <div
          className={`
          w-full
          ${size === "large" ? "border border-green-500/50 p-1" : ""}
          relative overflow-hidden
        `}
        >
          <div className="flex w-full">
            {Array.from({ length: blocks }).map((_, i) => (
              <div
                key={i}
                className={`
                  flex-1
                  ${size === "large" ? "h-3" : "h-1"}
                  ${i < filledBlocks ? "bg-green-500" : "bg-green-900/30"}
                  ${size === "large" ? "shadow-[0_0_5px_#00FF00]" : ""}
                  ${i === 0 ? "rounded-l" : ""}
                  ${i === blocks - 1 ? "rounded-r" : ""}
                  ${size === "large" ? "mx-px" : ""}
                `}
              />
            ))}
          </div>
        </div>
        {size === "large" && (
          <div className="absolute left-0 w-full text-center mt-2 text-green-500">
            {`${progress}% Complete`}
          </div>
        )}
      </div>
    );
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.name === activeProject
            ? {
                ...project,
                tasks: [
                  ...project.tasks,
                  {
                    id: Date.now().toString(),
                    content: inputValue,
                    completed: false,
                  },
                ],
              }
            : project
        )
      );
      setInputValue("");
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.name === activeProject
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : project
      )
    );
  };

  const addNewProject = () => {
    const newProjectName = `Project ${projects.length + 1}`;
    setProjects([
      ...projects,
      {
        name: newProjectName,
        tasks: [],
        timeSpent: 0,
        isTracking: false,
      },
    ]);
    setActiveProject(newProjectName);
  };

  const startEditingProject = (projectName: string) => {
    setEditingProject(projectName);
  };

  const handleProjectNameChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newName = editInputRef.current?.value;
    if (newName && newName !== editingProject) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.name === editingProject
            ? { ...project, name: newName }
            : project
        )
      );
      setActiveProject((prevActive) =>
        prevActive === editingProject ? newName : prevActive
      );
    }
    setEditingProject(null);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const toggleTimer = (projectName: string) => {
    const now = Date.now();
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        isTracking: p.name === projectName ? !p.isTracking : false,
      }))
    );

    const project = projects.find((p) => p.name === projectName);
    if (project?.isTracking) {
      setLastStartTime(null);
    } else {
      setLastStartTime(now);
    }
  };

  const activeProjectTasks =
    projects.find((project) => project.name === activeProject)?.tasks || [];
  const activeProjectProgress = calculateProgress(activeProjectTasks);
  const currentProject = projects.find((p) => p.name === activeProject);

  return (
    <div className="flex flex-col h-screen bg-black text-green-500 font-mono">
      {/* Header with project tabs */}
      <header className="flex border-b border-green-700 overflow-x-auto">
        {projects.map((project) => (
          <div key={project.name} className="flex flex-col">
            {editingProject === project.name ? (
              <form onSubmit={handleProjectNameChange} className="px-2">
                <input
                  ref={editInputRef}
                  defaultValue={project.name}
                  className="bg-green-900 text-green-300 px-2 py-1 outline-none"
                  onBlur={() => setEditingProject(null)}
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
                  onClick={() => setActiveProject(project.name)}
                  onDoubleClick={() => startEditingProject(project.name)}
                >
                  {project.isTracking ? (
                    <Clock className="inline-block mr-2 w-4 h-4 animate-pulse" />
                  ) : (
                    <Folder className="inline-block mr-2 w-4 h-4" />
                  )}
                  {project.name}
                </button>
                {renderProgressBar(calculateProgress(project.tasks), "small")}
              </div>
            )}
          </div>
        ))}
        <button
          onClick={addNewProject}
          className="px-4 py-2 hover:bg-green-900/50 flex items-center"
          aria-label="Add new project"
        >
          <Plus className="w-4 h-4" />
        </button>
      </header>

      {/* Main content area */}
      <main className="flex-1 p-4 overflow-auto">
        {/* Timer and Progress Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="text-4xl font-bold mb-4 font-mono tabular-nums">
            {formatTime(currentProject?.timeSpent || 0)}
          </div>
          <button
            onClick={() => toggleTimer(activeProject)}
            className="mb-6 px-4 py-2 border border-green-500 hover:bg-green-900/50 flex items-center gap-2"
          >
            {currentProject?.isTracking ? (
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
          {renderProgressBar(activeProjectProgress, "large")}
        </div>

        <div className="space-y-2">
          {activeProjectTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center group cursor-pointer ${
                task.completed ? "text-green-800" : ""
              }`}
              onClick={() => toggleTaskStatus(task.id)}
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
      </main>

      {/* Footer with CLI input */}
      <footer className="p-4 border-t border-green-700">
        <form onSubmit={handleCommand} className="flex items-center">
          <label htmlFor="cli-input" className="mr-2">
            $
          </label>
          <input
            id="cli-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-300 placeholder-green-700"
            placeholder="Enter task..."
          />
          <button type="submit" className="ml-2">
            <Terminal className="w-4 h-4" />
          </button>
        </form>
      </footer>

      {/* Overlay for green glow effect */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-green-500/5 mix-blend-screen" />
    </div>
  );
}
