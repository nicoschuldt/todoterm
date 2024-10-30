"use client";

import { useState, useEffect, useRef } from "react";
import { type Project } from "./_lib/types";
import { ProjectTabs } from "./_components/ProjectTabs";
import { TaskList } from "./_components/TaskList";
import { Timer } from "./_components/Timer";
import { CommandInput } from "./_components/CommandInput";
import { HomePage } from "./_components/HomePage";

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>("");
  const [inputValue, setInputValue] = useState("");
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [lastStartTime, setLastStartTime] = useState<number | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize from localStorage
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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // Timer logic
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
      { name: newProjectName, tasks: [], timeSpent: 0, isTracking: false },
    ]);
    setActiveProject(newProjectName);
  };

  const handleProjectNameChange = (oldName: string, newName: string) => {
    if (newName && newName !== oldName) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.name === oldName ? { ...project, name: newName } : project
        )
      );
      setActiveProject((prevActive) =>
        prevActive === oldName ? newName : prevActive
      );
    }
    setEditingProject(null);
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

  const currentProject = projects.find((p) => p.name === activeProject);

  return (
    <div className="flex flex-col min-h-screen h-full bg-black text-green-500 font-mono overflow-hidden">
      <ProjectTabs
        projects={projects}
        activeProject={activeProject}
        editingProject={editingProject}
        onProjectSelect={setActiveProject}
        onProjectEdit={setEditingProject}
        onProjectNameChange={handleProjectNameChange}
        onProjectAdd={addNewProject}
      />

      <main className="flex-1 overflow-auto">
        {activeProject === null ? (
          <HomePage projects={projects} onProjectSelect={setActiveProject} />
        ) : (
          currentProject && (
            <>
              <Timer project={currentProject} onTimerToggle={toggleTimer} />
              <TaskList
                tasks={currentProject.tasks}
                onTaskToggle={toggleTaskStatus}
              />
            </>
          )
        )}
      </main>

      <footer className="p-4 border-t border-green-700">
        <CommandInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleCommand}
        />
      </footer>

      <div className="pointer-events-none fixed inset-0 z-50 bg-green-500/5 mix-blend-screen" />
    </div>
  );
}
