import { HTMLAttributes } from "react"

interface RingLoadingProps extends HTMLAttributes<HTMLDivElement> { }

export const RingLoading = ({
  className,
}: RingLoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-fit w-fit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          margin: "auto",
          background: "none",
          display: "block",
          shapeRendering: "auto",
        }}
        width="200px"
        height="200px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        className={`animate-spin ${className ? `${className}` : "w-24 h-24 text-zinc-500"}`}
      >
        <circle
          r="16"
          cx="50"
          cy="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="75 25"
        />
      </svg>
    </div>
  )
}
