import { useState, useEffect } from "react";
import { type Project, PomodoroSettings } from "../_lib/types";
import { Heart, HelpCircle } from "lucide-react";

interface SettingsProps {
  projects: Project[];
  onProjectsImport: (projects: Project[]) => void;
  onPomodoroSettingsUpdate: (settings: PomodoroSettings) => void;
  currentPomodoroSettings: PomodoroSettings;
}

const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
  autoStartCycles: false,
};

interface PomodoroSettingsFormProps {
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
}

function PomodoroSettingsForm({ settings, onSave }: PomodoroSettingsFormProps) {
  const [formData, setFormData] = useState<PomodoroSettings>({
    workDuration: settings?.workDuration ?? DEFAULT_POMODORO_SETTINGS.workDuration,
    shortBreakDuration: settings?.shortBreakDuration ?? DEFAULT_POMODORO_SETTINGS.shortBreakDuration,
    longBreakDuration: settings?.longBreakDuration ?? DEFAULT_POMODORO_SETTINGS.longBreakDuration,
    cyclesBeforeLongBreak: settings?.cyclesBeforeLongBreak ?? DEFAULT_POMODORO_SETTINGS.cyclesBeforeLongBreak,
    autoStartCycles: settings?.autoStartCycles ?? DEFAULT_POMODORO_SETTINGS.autoStartCycles,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const resetToDefaults = () => {
    setFormData({
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      cyclesBeforeLongBreak: 4,
      autoStartCycles: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Work Duration (minutes)</label>
        <input
          type="number"
          value={formData.workDuration}
          onChange={(e) =>
            setFormData({ ...formData, workDuration: Number(e.target.value) })
          }
          className="bg-green-900/30 border border-green-500/20 px-3 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Short Break Duration (minutes)</label>
        <input
          type="number"
          value={formData.shortBreakDuration}
          onChange={(e) =>
            setFormData({
              ...formData,
              shortBreakDuration: Number(e.target.value),
            })
          }
          className="bg-green-900/30 border border-green-500/20 px-3 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Long Break Duration (minutes)</label>
        <input
          type="number"
          value={formData.longBreakDuration}
          onChange={(e) =>
            setFormData({
              ...formData,
              longBreakDuration: Number(e.target.value),
            })
          }
          className="bg-green-900/30 border border-green-500/20 px-3 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Cycles Before Long Break</label>
        <input
          type="number"
          value={formData.cyclesBeforeLongBreak}
          onChange={(e) =>
            setFormData({
              ...formData,
              cyclesBeforeLongBreak: Number(e.target.value),
            })
          }
          className="bg-green-900/30 border border-green-500/20 px-3 py-1 rounded w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoStartCycles"
          checked={formData.autoStartCycles}
          onChange={(e) =>
            setFormData({ ...formData, autoStartCycles: e.target.checked })
          }
          className="bg-green-900/30 border border-green-500/20 rounded"
        />
        <label htmlFor="autoStartCycles">Auto-start next phase</label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-900 hover:bg-green-800 rounded"
        >
          Save Settings
        </button>
        <button
          type="button"
          onClick={resetToDefaults}
          className="px-4 py-2 bg-green-900/50 hover:bg-green-800/50 rounded"
        >
          Reset to Defaults
        </button>
      </div>
    </form>
  );
}

export function Settings({
  projects,
  onProjectsImport,
  onPomodoroSettingsUpdate,
  currentPomodoroSettings = DEFAULT_POMODORO_SETTINGS,
}: SettingsProps) {
  const [importError, setImportError] = useState<string>("");
  const [showTooltip, setShowTooltip] = useState(false);

  const schemaExample = `[
  {
    "name": "Project Name",
    "tasks": [
      {
        "id": "123",
        "content": "Task description",
        "completed": false
      }
    ],
    "timeSpent": 0,
    "isTracking": false
  }
]`;

  const exportData = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "projects.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = JSON.parse(content);

        // Enhanced validation
        if (!Array.isArray(imported))
          throw new Error("Data must be an array of projects");
        if (
          !imported.every(
            (p) =>
              p.name &&
              Array.isArray(p.tasks) &&
              p.tasks.every(
                (t: any) =>
                  t.id &&
                  typeof t.content === "string" &&
                  typeof t.completed === "boolean"
              )
          )
        ) {
          throw new Error("Invalid project structure");
        }

        // Add missing properties if they don't exist
        const normalizedProjects = imported.map((p) => ({
          ...p,
          timeSpent: p.timeSpent || 0,
          isTracking: false,
        }));

        onProjectsImport(normalizedProjects);
        setImportError("");
        e.target.value = ""; // Reset file input
      } catch (err) {
        setImportError("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-8">Settings</h1>

      <section className="mb-8">
        <h2 className="text-xl mb-4">Pomodoro Settings</h2>
        <PomodoroSettingsForm
          settings={currentPomodoroSettings}
          onSave={onPomodoroSettingsUpdate}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl mb-4">Data Management</h2>

        <div className="space-y-4">
          <div>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-900 hover:bg-green-800 rounded"
            >
              Export Projects
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label>Import Projects:</label>
              <div className="relative">
                <HelpCircle
                  className="w-4 h-4 cursor-help inline-block"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="absolute left-6 top-0 w-96 p-4 bg-green-900 rounded shadow-lg z-50 text-sm">
                    <p className="mb-2">
                      Importing will replace all existing projects. Expected
                      JSON schema:
                    </p>
                    <pre className="bg-black/50 p-2 rounded overflow-x-auto">
                      {schemaExample}
                    </pre>
                  </div>
                )}
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 
                file:rounded file:border-0 file:bg-green-900 
                file:hover:bg-green-800 file:text-green-300"
            />
            {importError && (
              <p className="mt-2 text-red-500 text-sm">{importError}</p>
            )}
          </div>
        </div>
      </section>
      <footer className="text-center text-sm fixed bottom-4 left-0 right-0">
        <p>
          Made with <Heart className="w-4 h-4 inline-block" /> by{" "}
          <a
            href="https://github.com/nicoschuldt"
            className="text-green-500 underline"
          >
            nicoschuldt
          </a>
        </p>
      </footer>
    </div>
  );
}
