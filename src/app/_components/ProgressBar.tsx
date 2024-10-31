import { Project } from "../_lib/types";

interface ProgressBarProps {
  tasks: Project["tasks"];
  size?: "large" | "small";
}

const calculateProgress = (tasks: Project["tasks"]) => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

export function ProgressBar({ tasks, size = "large" }: ProgressBarProps) {
  const blocks = size === "large" ? 30 : 15;
  const progress = calculateProgress(tasks);
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
            ${
              size === "large"
                ? "border-green-700/90 border-4 p-1 shadow-green-800/20 shadow-lg"
                : ""
            }
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
                  ${
                    i < filledBlocks
                      ? "bg-green-500 shadow-[0_0_5px_#00FF00]"
                      : "bg-green-950/30"
                  }
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
}
