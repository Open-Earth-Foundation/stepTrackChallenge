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
      
      {/* Brazil Map with Progress - Back to original map */}
      <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 p-2 relative">
        <img 
          src={brazilNewMap}
          alt="Map of Brazil showing relief features" 
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
              
              {/* SVG path that traces Brazil's Atlantic coast through major cities */}
              <path
                d="M 130,70 C 140,110 150,130 165,150 C 180,170 185,200 180,220 C 175,240 170,260 165,280 C 160,300 155,320 150,340 C 145,360 130,380 115,390"
                stroke="url(#journeyGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (completionPercentage * 10)}
                style={{ filter: 'drop-shadow(0 0 3px rgba(36, 190, 0, 0.5))' }}
              />
              
              {/* Major cities along the Atlantic coast */}
              <g>
                {/* Oiapoque (Northernmost point) */}
                <circle cx="130" cy="70" r="4" fill="#2351DC" />
                <text x="118" y="60" fontSize="8" fill="#fff" stroke="#000" strokeWidth="0.5" textAnchor="middle">Oiapoque</text>
                
                {/* Belém */}
                <circle cx="145" cy="110" r="4" fill="#2351DC" />
                <text x="132" y="110" fontSize="8" fill="#fff" stroke="#000" strokeWidth="0.5" textAnchor="middle">Belém</text>
                
                {/* São Luís */}
                <circle cx="160" cy="135" r="4" fill="#2351DC" />
                
                {/* Fortaleza */}
                <circle cx="175" cy="160" r="4" fill="#2351DC" />
                <text x="190" y="160" fontSize="8" fill="#fff" stroke="#000" strokeWidth="0.5" textAnchor="middle">Fortaleza</text>
                
                {/* Natal */}
                <circle cx="182" cy="180" r="4" fill="#2351DC" />
                
                {/* Recife */}
                <circle cx="180" cy="210" r="4" fill="#2351DC" />
                <text x="195" y="210" fontSize="8" fill="#fff" stroke="#000" strokeWidth="0.5" textAnchor="middle">Recife</text>
                
                {/* Salvador */}
                <circle cx="170" cy="250" r="4" fill="#2351DC" />
                <text x="185" y="250" fontSize="8" fill="#fff" stroke="#000" strokeWidth="0.5" textAnchor="middle">Salvador</text>
                
                {/* Rio de Janeiro */}
                <circle cx="155" cy="320" r="4" fill="#2351DC" />
                <text x="140" y="320" fontSize="8" fill="#fff" stroke="#000" strokeWidth="0.5" textAnchor="middle">Rio</text>
                
                {/* São Paulo */}
                <circle cx="145" cy="345" r="4" fill="#2351DC" />
                <text x="130" y="345" fontSize="8" fill="#fff" stroke="#000" strokeWidth="0.5" textAnchor="middle">São Paulo</text>
                
                {/* Porto Alegre */}
                <circle cx="125" cy="380" r="4" fill="#24BE00" />
                <text x="145" y="380" fontSize="8" fill="#fff" stroke="#000" strokeWidth="0.5" textAnchor="middle">Porto Alegre</text>
                
                {/* Chuí (Southernmost point) */}
                <circle cx="115" cy="390" r="4" fill="#24BE00" />
                <text x="100" y="390" fontSize="8" fill="#fff" stroke="#000" strokeWidth="0.5" textAnchor="middle">Chuí</text>
              </g>
            </svg>
            
            {/* Current Position Indicator - Follow the Atlantic coastal path */}
            {completionPercentage > 0 && completionPercentage < 100 && (
              <div 
                className="absolute w-6 h-6 bg-accent border-2 border-white rounded-full shadow-lg animate-pulse z-20"
                style={{ 
                  // Position calculation for the Atlantic coastal path
                  left: `${
                    completionPercentage < 20 ? 
                      // North segment (Oiapoque to Belém)
                      130 + (completionPercentage/20) * (145-130)
                      : completionPercentage < 35 ? 
                      // North-East segment (Belém to Fortaleza)
                      145 + ((completionPercentage-20)/15) * (175-145)
                      : completionPercentage < 50 ? 
                      // East segment (Fortaleza to Recife)
                      175 + ((completionPercentage-35)/15) * (180-175)
                      : completionPercentage < 65 ? 
                      // Salvador segment
                      180 - ((completionPercentage-50)/15) * (180-170)
                      : completionPercentage < 80 ? 
                      // Rio segment
                      170 - ((completionPercentage-65)/15) * (170-155)
                      : 
                      // South segment (Rio to Chuí)
                      155 - ((completionPercentage-80)/20) * (155-115)
                  }px`,
                  top: `${
                    completionPercentage < 20 ? 
                      // North segment
                      70 + (completionPercentage/20) * (110-70)
                      : completionPercentage < 35 ? 
                      // North-East segment
                      110 + ((completionPercentage-20)/15) * (160-110)
                      : completionPercentage < 50 ? 
                      // East segment
                      160 + ((completionPercentage-35)/15) * (210-160)
                      : completionPercentage < 65 ? 
                      // Salvador segment
                      210 + ((completionPercentage-50)/15) * (250-210)
                      : completionPercentage < 80 ? 
                      // Rio segment
                      250 + ((completionPercentage-65)/15) * (320-250)
                      : 
                      // South segment
                      320 + ((completionPercentage-80)/20) * (390-320)
                  }px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Inner pulse effect */}
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping"></span>
                
                {/* Label showing current city/region */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-accent/90 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
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
