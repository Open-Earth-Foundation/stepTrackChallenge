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
      
      {/* Brazil Map with Accurate Geography */}
      <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 p-2 relative">
        {/* Toggle between maps */}
        <div className="flex flex-col">
          {/* Geographically Accurate SVG Map */}
          <div className="relative">
            <img 
              src={brazilAccurateMap} 
              alt="Geographically accurate map of Brazil with journey route" 
              className="w-full h-auto rounded-xl"
              style={{ 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
            
            {/* Animated Progress Indicator */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" style={{ pointerEvents: 'none' }}>
                <clipPath id="progress-clip">
                  <path 
                    d="M260,130 C270,160 280,190 290,220 C300,250 310,280 320,310 C330,340 340,370 350,400 C360,430 370,460 380,490 C390,520 400,550 410,580 C420,610 430,640 440,670 C450,700 460,730 470,700"
                    strokeDasharray="2000"
                    strokeDashoffset={2000 - (completionPercentage * 20)}
                    stroke="#fff" 
                    strokeWidth="20" 
                    fill="none"
                  />
                </clipPath>
                
                {/* Create a pulsing effect along the path */}
                <g>
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="8" 
                    fill="#24BE00" 
                    filter="drop-shadow(0 0 3px rgba(36, 190, 0, 0.8))"
                    className="animate-pulse">
                    <animateMotion
                      path="M260,130 C270,160 280,190 290,220 C300,250 310,280 320,310 C330,340 340,370 350,400 C360,430 370,460 380,490 C390,520 400,550 410,580 C420,610 430,640 440,670 C450,700 460,730 470,700"
                      dur="8s"
                      repeatCount="indefinite"
                      keyPoints="0;1"
                      keyTimes="0;1"
                      calcMode="linear"
                    />
                  </circle>
                </g>
              </svg>
            </div>
            
            {/* Progress Percentage Overlay */}
            <div className="absolute top-3 right-3 bg-white/80 dark:bg-black/60 rounded-full px-2 py-1 text-xs font-bold text-primary">
              {completionPercentage}% Complete
            </div>
            
            {/* Current Location Marker */}
            {completionPercentage > 0 && completionPercentage < 100 && (
              <div className="absolute">
                <div 
                  className="bg-accent border-2 border-white rounded-full shadow-lg w-6 h-6 animate-pulse"
                  style={{
                    // Position calculation for the journey path (calculate position along the SVG path)
                    position: 'absolute',
                    left: `${
                      completionPercentage < 15 ? 
                        260 + (completionPercentage/15) * (280-260) :
                      completionPercentage < 30 ?
                        280 + ((completionPercentage-15)/15) * (310-280) :
                      completionPercentage < 45 ?
                        310 + ((completionPercentage-30)/15) * (340-310) :
                      completionPercentage < 60 ?
                        340 + ((completionPercentage-45)/15) * (390-340) :
                      completionPercentage < 75 ?
                        390 + ((completionPercentage-60)/15) * (430-390) :
                      430 + ((completionPercentage-75)/25) * (470-430)
                    }px`,
                    top: `${
                      completionPercentage < 15 ? 
                        130 + (completionPercentage/15) * (200-130) :
                      completionPercentage < 30 ?
                        200 + ((completionPercentage-15)/15) * (260-200) :
                      completionPercentage < 45 ?
                        260 + ((completionPercentage-30)/15) * (320-260) :
                      completionPercentage < 60 ?
                        320 + ((completionPercentage-45)/15) * (460-320) :
                      completionPercentage < 75 ?
                        460 + ((completionPercentage-60)/15) * (600-460) :
                      600 + ((completionPercentage-75)/25) * (700-600)
                    }px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 50
                  }}
                >
                  <span className="absolute inset-0 rounded-full bg-white/40 animate-ping"></span>
                </div>
                
                {/* City Label */}
                <div 
                  className="absolute bg-accent/90 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap"
                  style={{
                    left: `${
                      completionPercentage < 15 ? 
                        260 + (completionPercentage/15) * (280-260) :
                      completionPercentage < 30 ?
                        280 + ((completionPercentage-15)/15) * (310-280) :
                      completionPercentage < 45 ?
                        310 + ((completionPercentage-30)/15) * (340-310) :
                      completionPercentage < 60 ?
                        340 + ((completionPercentage-45)/15) * (390-340) :
                      completionPercentage < 75 ?
                        390 + ((completionPercentage-60)/15) * (430-390) :
                      430 + ((completionPercentage-75)/25) * (470-430)
                    }px`,
                    top: `${
                      completionPercentage < 15 ? 
                        130 + (completionPercentage/15) * (200-130) - 20 :
                      completionPercentage < 30 ?
                        200 + ((completionPercentage-15)/15) * (260-200) - 20 :
                      completionPercentage < 45 ?
                        260 + ((completionPercentage-30)/15) * (320-260) - 20 :
                      completionPercentage < 60 ?
                        320 + ((completionPercentage-45)/15) * (460-320) - 20 :
                      completionPercentage < 75 ?
                        460 + ((completionPercentage-60)/15) * (600-460) - 20 :
                      600 + ((completionPercentage-75)/25) * (700-600) - 20
                    }px`,
                    transform: 'translateX(-50%)',
                    zIndex: 51
                  }}
                >
                  {completionPercentage < 10 ? "Oiapoque" :
                   completionPercentage < 25 ? "Belém" :
                   completionPercentage < 38 ? "Fortaleza" :
                   completionPercentage < 50 ? "Recife" :
                   completionPercentage < 65 ? "Salvador" :
                   completionPercentage < 78 ? "Rio" :
                   completionPercentage < 90 ? "São Paulo" :
                   "Porto Alegre"}
                </div>
              </div>
            )}
          </div>
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
