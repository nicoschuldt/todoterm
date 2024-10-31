"use client";

import { useState, useEffect, useRef } from "react";
import { PomodoroSettings, type Project, PomodoroState } from "./_lib/types";
import { ProjectTabs } from "./_components/ProjectTabs";
import { TaskList } from "./_components/TaskList";
import { Timer } from "./_components/Timer";
import { CommandInput } from "./_components/CommandInput";
import { HomePage } from "./_components/HomePage";
import { Settings } from "./_components/Settings";
import { ProgressBar } from "./_components/ProgressBar";
import { DEFAULT_POMODORO_SETTINGS } from "./_lib/constants";

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

  const handleProjectsImport = (importedProjects: Project[]) => {
    setProjects(importedProjects);
    setActiveProject(importedProjects[0]?.name || null);
  };

  const deleteTask = (taskId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.name === activeProject
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project
      )
    );
  };

  const handlePomodoroSettingsUpdate = (settings: PomodoroSettings) => {
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        pomodoroSettings: settings,
      }))
    );
  };

  const handlePomodoroComplete = (
    phase: "work" | "shortBreak" | "longBreak"
  ) => {
    // Handle pomodoro phase completion
    console.log(`Pomodoro phase complete: ${phase}`);
  };

  const handlePomodoroStateUpdate = (
    projectName: string,
    newState: Partial<PomodoroState>
  ) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.name === projectName
          ? {
              ...p,
              pomodoroState: p.pomodoroState
                ? {
                    ...p.pomodoroState,
                    ...newState,
                  }
                : {
                    isActive: false,
                    currentPhase: "work",
                    sessionTime: p.pomodoroSettings?.workDuration || 25 * 60,
                    cyclesCompleted: 0,
                    waitingForNextPhase: false,
                    ...newState,
                  },
            }
          : p
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen h-full bg-black text-green-500 font-apple overflow-hidden">
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
        ) : activeProject === "settings" ? (
          <Settings
            projects={projects}
            onProjectsImport={handleProjectsImport}
            onPomodoroSettingsUpdate={handlePomodoroSettingsUpdate}
            currentPomodoroSettings={
              projects[0]?.pomodoroSettings || DEFAULT_POMODORO_SETTINGS
            }
          />
        ) : (
          currentProject && (
            <div className="space-y-10 p-4 flex flex-col">
              <ProgressBar tasks={currentProject.tasks} size="large" />
              <TaskList
                tasks={currentProject.tasks}
                onTaskToggle={toggleTaskStatus}
                onTaskDelete={deleteTask}
              />
            </div>
          )
        )}
      </main>

      {activeProject && activeProject !== "settings" && (
        <footer className="p-4 border-t border-green-700">
          {currentProject && (
            <>
              <Timer
                project={currentProject}
                onTimerToggle={toggleTimer}
                onPomodoroComplete={handlePomodoroComplete}
                onPomodoroStateUpdate={handlePomodoroStateUpdate}
              />
              <CommandInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleCommand}
              />
            </>
          )}
        </footer>
      )}

      <div className="pointer-events-none fixed inset-0 z-50 bg-green-500/5 mix-blend-screen" />
    </div>
  );
}
