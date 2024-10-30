"use client";

import { useState } from "react";
import { Terminal, ArrowRight, Calendar } from "lucide-react";
import { type Project } from "../_lib/types";

function ASCII() {
  return (
    <pre className="text-green-500 text-xs leading-none mb-8">
      {`
████████╗ ██████╗ ██████╗  ██████╗     ████████╗███████╗██████╗ ███╗   ███╗
╚══██╔══╝██╔═══██╗██╔══██╗██╔═══██╗    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
   ██║   ██║   ██║██║  ██║██║   ██║       ██║   █████╗  ██████╔╝██╔████╔██║
   ██║   ██║   ██║██║  ██║██║   ██║       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
   ██║   ╚██████╔╝██████╔╝╚██████╔╝       ██║   ███████╗██║  ██║██║ ╚═╝ ██║
   ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝        ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
                                                                           
`}
    </pre>
  );
}

function ActivityGrid({
  data,
  range,
}: {
  data: { date: string; completion: number }[];
  range: "day" | "week" | "month";
}) {
  const gridSize = range === "day" ? 24 : range === "week" ? 7 : 30;
  const mockData = Array.from({ length: gridSize }, (_, i) => ({
    date: new Date(Date.now() - i * 86400000).toISOString(),
    completion: Math.random() * 100,
  }));

  return (
    <div className="flex gap-1">
      {mockData.map((day, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-sm transition-colors ${
            day.completion === 0
              ? "bg-green-950"
              : day.completion < 25
              ? "bg-green-900"
              : day.completion < 50
              ? "bg-green-700"
              : day.completion < 75
              ? "bg-green-500"
              : "bg-green-300"
          }`}
          title={`${new Date(day.date).toLocaleDateString()}: ${Math.round(
            day.completion
          )}% completion`}
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  onProjectSelect,
}: {
  project: Project;
  onProjectSelect: (name: string) => void;
}) {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");

  return (
    <div className="border border-green-700/50 rounded-lg p-4 hover:bg-green-950/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <h3 className="text-lg font-semibold">{project.name}</h3>
        </div>
        <select
          value={timeRange}
          onChange={(e) =>
            setTimeRange(e.target.value as "day" | "week" | "month")
          }
          className="w-24 h-8 text-xs border-green-700/50 bg-transparent"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      <div className="space-y-4">
        <ActivityGrid data={[]} range={timeRange} />

        <div className="flex items-center justify-between text-sm text-green-500/70">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {timeRange === "day"
                ? "Today"
                : timeRange === "week"
                ? "This Week"
                : "This Month"}
              : {formatTime(project.timeSpent)}
            </span>
          </div>
          <button
            onClick={() => onProjectSelect(project.name)}
            className="flex items-center gap-1 hover:text-green-500 transition-colors"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

interface HomePageProps {
  projects: Project[];
  onProjectSelect: (name: string) => void;
}

export function HomePage({ projects, onProjectSelect }: HomePageProps) {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <ASCII />

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Welcome back</h2>
          <p className="text-green-500/70">
            Track your tasks and time across {projects.length} projects
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              onProjectSelect={onProjectSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
