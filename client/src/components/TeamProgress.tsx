import { FC } from "react";
import brazilMapSvg from "../assets/branding/brazil-map.svg";
import brazilWebSvg from "../assets/branding/brazil-web.svg";
import brazilCountrySvg from "../assets/branding/brazil-country.svg";
import brazilFullMap from "../assets/branding/brazil-full-map.png";
import brazilNewMap from "../assets/branding/brazil-new-map.webp";
import brazilAccurateMap from "../assets/maps/brazil-accurate-map.svg";
import earthImageSvg from "../assets/branding/earth-image.svg";

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-heading font-bold text-neutral-800 dark:text-white">Team Progress</h3>
        <div className="bg-neutral-100 dark:bg-gray-700 rounded-lg p-2 text-sm font-medium text-neutral-800 dark:text-white">
          <i className="ri-team-line mr-1 text-primary"></i>
          {totalSteps.toLocaleString()} total steps
        </div>
      </div>
      
      {/* Brazil Map with Progress - Using accurate map */}
      <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 p-2 relative">
        <img 
          src={brazilAccurateMap}
          alt="Map of Brazil with accurate city positions" 
          className="w-full h-auto rounded-xl" 
        />
        
        {/* Progress Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Progress Path - A curved line simulating the journey path */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2351DC" />
                  <stop offset="100%" stopColor="#24BE00" />
                </linearGradient>
              </defs>
              
              {/* The path appears in the SVG itself, we don't need to overlap it */}
              {/* We'll just add animation for the journey progress */}
              <path
                d="M270,285 C271,305 273,325 275,350 C280,360 290,363 320,365 
                 C340,367 365,368 383,369 C400,380 415,395 428,410
                 C435,425 438,435 440,445 C435,470 425,495 410,520
                 C390,555 370,595 345,640 C330,645 320,650 310,655
                 C300,670 290,683 285,695 C270,710 260,720 255,730
                 C245,750 235,770 225,790"
                stroke="url(#journeyGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="1500"
                strokeDashoffset={1500 - (completionPercentage * 15)}
                style={{ filter: 'drop-shadow(0 0 6px rgba(36, 190, 0, 0.6))' }}
              />
            </svg>
            
            {/* Current Position Indicator - Follow the Atlantic coastal path with correct coordinates */}
            {completionPercentage > 0 && completionPercentage < 100 && (
              <div 
                className="absolute w-6 h-6 bg-accent border-2 border-white rounded-full shadow-lg animate-pulse z-20"
                style={{ 
                  // Position calculation matching the accurate SVG map
                  left: `${
                    completionPercentage < 12 ? 
                      // North segment (Oiapoque)
                      270 + (completionPercentage/12) * (275-270)
                      : completionPercentage < 25 ? 
                      // North-East segment (Belém to São Luís)
                      275 + ((completionPercentage-12)/13) * (320-275)
                      : completionPercentage < 37 ? 
                      // Fortaleza segment
                      320 + ((completionPercentage-25)/12) * (383-320)
                      : completionPercentage < 50 ? 
                      // Natal to Recife
                      383 + ((completionPercentage-37)/13) * (440-383)
                      : completionPercentage < 63 ? 
                      // Recife to Salvador
                      440 - ((completionPercentage-50)/13) * (440-410)
                      : completionPercentage < 76 ? 
                      // Salvador to Rio
                      410 - ((completionPercentage-63)/13) * (410-345)
                      : completionPercentage < 88 ?
                      // Rio to São Paulo and Florianópolis
                      345 - ((completionPercentage-76)/12) * (345-285)
                      :
                      // South end (Porto Alegre to Chuí)
                      285 - ((completionPercentage-88)/12) * (285-225)
                  }px`,
                  top: `${
                    completionPercentage < 12 ? 
                      // North segment
                      285 + (completionPercentage/12) * (350-285)
                      : completionPercentage < 25 ? 
                      // North-East segment
                      350 + ((completionPercentage-12)/13) * (365-350)
                      : completionPercentage < 37 ? 
                      // Fortaleza segment
                      365 + ((completionPercentage-25)/12) * (369-365)
                      : completionPercentage < 50 ? 
                      // Natal to Recife segment
                      369 + ((completionPercentage-37)/13) * (445-369)
                      : completionPercentage < 63 ? 
                      // Recife to Salvador segment
                      445 + ((completionPercentage-50)/13) * (520-445)
                      : completionPercentage < 76 ? 
                      // Salvador to Rio segment
                      520 + ((completionPercentage-63)/13) * (640-520)
                      : completionPercentage < 88 ?
                      // Rio to São Paulo and Florianópolis
                      640 + ((completionPercentage-76)/12) * (695-640)
                      :
                      // South end
                      695 + ((completionPercentage-88)/12) * (790-695)
                  }px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Inner pulse effect */}
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping"></span>
                
                {/* Label showing current city/region - Updated for accurate cities */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-accent/90 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                  {completionPercentage < 12 ? "Oiapoque" :
                   completionPercentage < 25 ? "Belém" :
                   completionPercentage < 37 ? "Fortaleza" :
                   completionPercentage < 44 ? "Natal" :
                   completionPercentage < 50 ? "Recife" :
                   completionPercentage < 63 ? "Salvador" :
                   completionPercentage < 76 ? "Rio de Janeiro" :
                   completionPercentage < 82 ? "São Paulo" :
                   completionPercentage < 88 ? "Florianópolis" :
                   completionPercentage < 95 ? "Porto Alegre" :
                   "Chuí"}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Percentage Overlay */}
        <div className="absolute top-3 right-3 bg-white/80 dark:bg-black/60 rounded-full px-2 py-1 text-xs font-bold text-primary">
          {completionPercentage}% Complete
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg p-4">
          <div className="text-sm text-neutral-700 dark:text-white mb-1">Distance Covered</div>
          <div className="text-xl font-bold text-primary dark:text-white">{totalDistance.toLocaleString()} km</div>
          <div className="mt-1 text-xs text-primary font-medium">+{dailyAverageDistance.toFixed(1)} km today</div>
        </div>
        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-secondary/20 dark:to-secondary/10 rounded-lg p-4">
          <div className="text-sm text-neutral-700 dark:text-white mb-1">Remaining</div>
          <div className="text-xl font-bold text-secondary dark:text-white">{distanceRemaining.toLocaleString()} km</div>
          <div className="mt-1 text-xs text-secondary font-medium">Approx. {daysRemaining} days left</div>
        </div>
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 rounded-lg p-4">
          <div className="text-sm text-neutral-700 dark:text-white mb-1">Daily Average</div>
          <div className="text-xl font-bold text-accent dark:text-white">{dailyAverageDistance.toFixed(1)} km</div>
          <div className="mt-1 text-xs text-accent font-medium">{dailyAverageSteps.toLocaleString()} steps</div>
        </div>
        <div className="bg-neutral-100 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-neutral-700 dark:text-white mb-1">Completion</div>
          <div className="text-xl font-bold text-neutral-800 dark:text-white">{completionPercentage}%</div>
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-300">Target: {targetDistance.toLocaleString()} km</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                Team Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary">
                {completionPercentage}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-neutral-200 dark:bg-gray-700">
            <div 
              style={{ width: `${completionPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-secondary rounded-full"
            ></div>
          </div>
        </div>
      </div>
      
      {/* Landmark Timeline */}
      <div className="relative">
        <h4 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">Journey Landmarks</h4>
        <div className="border-l-2 border-primary/30 ml-3">
          {landmarks.map((landmark, index) => {
            const isCompleted = landmark.distanceFromStart <= totalDistance;
            const isCurrent = index === landmarks.findIndex(l => l.distanceFromStart > totalDistance) - 1 || 
                             (landmarks.findIndex(l => l.distanceFromStart > totalDistance) === -1 && index === landmarks.length - 1);
            
            return (
              <div key={landmark.id} className="mb-6 ml-6 relative">
                <div 
                  className={`absolute -left-8 mt-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                    isCompleted 
                      ? 'bg-accent' 
                      : isCurrent 
                        ? 'bg-primary animate-pulse' 
                        : 'bg-neutral-300 dark:bg-gray-600'
                  }`}
                ></div>
                <div className={`${
                  isCurrent 
                    ? 'bg-primary/10 border-primary/20' 
                    : isCompleted
                      ? 'bg-accent/10 border-accent/20'
                      : 'bg-neutral-100 dark:bg-gray-700 border-neutral-200 dark:border-gray-600'
                  } p-3 rounded-lg border`}
                >
                  <p className={`text-sm font-medium ${
                    isCurrent 
                      ? 'text-primary' 
                      : isCompleted
                        ? 'text-accent'
                        : 'text-neutral-800 dark:text-white'
                  }`}>
                    {landmark.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {landmark.distanceFromStart} km from start
                    {isCurrent && " (Current Location)"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamProgress;
