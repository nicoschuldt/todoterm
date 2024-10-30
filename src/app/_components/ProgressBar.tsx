interface ProgressBarProps {
  progress: number;
  size?: "large" | "small";
}

export function ProgressBar({ progress, size = "large" }: ProgressBarProps) {
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
}
