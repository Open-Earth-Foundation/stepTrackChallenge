import { FC } from "react";

interface Landmark {
  id: number;
  name: string;
  distanceFromStart: number;
}

interface TeamProgressProps {
  totalSteps: number;
  totalDistance: number;
  distanceRemaining: number;
  completionPercentage: number;
  targetDistance: number;
  landmarks: Landmark[];
  currentLandmark: {
    name: string;
    distanceCompleted: number;
  };
}

const TeamProgress: FC<TeamProgressProps> = ({
  totalSteps,
  totalDistance,
  distanceRemaining,
  completionPercentage,
  targetDistance,
  landmarks,
  currentLandmark
}) => {
  // Calculate daily average
  const daysElapsed = 21; // Mock value, would need to calculate from challenge start date
  const dailyAverageDistance = totalDistance / daysElapsed;
  const dailyAverageSteps = totalSteps / daysElapsed;
  
  // Calculate estimated time remaining
  const daysRemaining = Math.ceil(distanceRemaining / dailyAverageDistance);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-heading font-bold text-neutral-800">Team Progress</h3>
        <div className="bg-neutral-100 rounded-lg p-2 text-sm font-medium text-neutral-800">
          <i className="ri-team-line mr-1 text-primary"></i>
          {totalSteps.toLocaleString()} total steps
        </div>
      </div>
      
      {/* Progress Map of Brazil */}
      <div className="map-container mb-6">
        <img 
          src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500" 
          alt="Map of Brazil coastline" 
          className="w-full h-auto rounded-xl" 
        />
        
        {/* Overlay for progress line */}
        <div className="absolute top-0 left-0 w-full h-full p-4">
          <div className="relative w-full h-full">
            {/* Progress path */}
            <svg viewBox="0 0 1200 500" className="w-full h-full">
              <path 
                d="M100,400 C150,380 200,390 250,370 S350,350 400,330 S500,310 550,300 S650,290 700,280" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="1200"
                strokeDashoffset={1200 - (1200 * (completionPercentage / 100))}
              />
              {/* Current position marker */}
              <circle cx="700" cy="280" r="8" fill="var(--primary)" />
            </svg>
            
            {/* Start and end markers */}
            <div className="absolute top-[400px] left-[100px] bg-primary text-white text-xs font-bold rounded-full px-2 py-1">
              START
            </div>
            <div className="absolute top-[120px] right-[100px] bg-neutral-800 text-white text-xs font-bold rounded-full px-2 py-1">
              FINISH
            </div>
            
            {/* Progress info box */}
            <div className="absolute top-[260px] left-[650px] bg-white rounded-lg shadow-lg p-3">
              <div className="text-sm font-bold text-neutral-800">Current Location:</div>
              <div className="text-primary font-medium">{currentLandmark.name}</div>
              <div className="text-xs text-neutral-500">{currentLandmark.distanceCompleted.toLocaleString()} km completed ({completionPercentage}%)</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-100 rounded-lg p-4">
          <div className="text-sm text-neutral-500 mb-1">Distance Covered</div>
          <div className="text-xl font-bold text-neutral-800">{totalDistance.toLocaleString()} km</div>
          <div className="mt-1 text-xs text-primary">+{dailyAverageDistance.toFixed(0)} km today</div>
        </div>
        <div className="bg-neutral-100 rounded-lg p-4">
          <div className="text-sm text-neutral-500 mb-1">Remaining</div>
          <div className="text-xl font-bold text-neutral-800">{distanceRemaining.toLocaleString()} km</div>
          <div className="mt-1 text-xs text-secondary">Approx. {daysRemaining} days left</div>
        </div>
        <div className="bg-neutral-100 rounded-lg p-4">
          <div className="text-sm text-neutral-500 mb-1">Daily Average</div>
          <div className="text-xl font-bold text-neutral-800">{dailyAverageDistance.toFixed(0)} km</div>
          <div className="mt-1 text-xs text-accent">{dailyAverageSteps.toLocaleString()} steps</div>
        </div>
        <div className="bg-neutral-100 rounded-lg p-4">
          <div className="text-sm text-neutral-500 mb-1">Completion</div>
          <div className="text-xl font-bold text-neutral-800">{completionPercentage}%</div>
          <div className="mt-1 text-xs text-neutral-500">Target: {targetDistance.toLocaleString()} km</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-neutral-200 rounded-full h-4">
          <div 
            className="bg-primary rounded-full h-4" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Milestone Markers */}
      <div className="relative pt-8">
        <div className="absolute top-0 left-0 w-full flex justify-between px-2">
          {landmarks.map((landmark, index) => {
            const isCompleted = landmark.distanceFromStart <= totalDistance;
            const isCurrent = index === landmarks.findIndex(l => l.distanceFromStart > totalDistance);
            
            return (
              <div key={landmark.id} className="flex flex-col items-center">
                <div 
                  className={`w-4 h-4 rounded-full mb-1 ${
                    isCompleted 
                      ? 'bg-success' 
                      : isCurrent 
                        ? 'bg-primary' 
                        : 'bg-neutral-300'
                  }`}
                ></div>
                <span 
                  className={`text-xs ${
                    isCurrent 
                      ? 'font-medium text-primary' 
                      : 'text-neutral-500'
                  }`}
                >
                  {landmark.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamProgress;
