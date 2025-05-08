import { FC } from "react";

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
}

const CircularProgress: FC<CircularProgressProps> = ({
  percentage,
  size,
  strokeWidth,
  color
}) => {
  // Calculate the radius
  const radius = (size - strokeWidth) / 2;
  
  // Calculate the circumference
  const circumference = radius * 2 * Math.PI;
  
  // Calculate the stroke dashoffset
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        <circle
          className="text-neutral-200"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-circle"
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-lg font-bold">{percentage}%</span>
    </div>
  );
};

export default CircularProgress;
