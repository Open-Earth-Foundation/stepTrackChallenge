import { FC } from "react";
import brazilMapSvg from "../assets/branding/brazil-map.svg";
import brazilWebSvg from "../assets/branding/brazil-web.svg";
import brazilCountrySvg from "../assets/branding/brazil-country.svg";
import brazilFullMap from "../assets/branding/brazil-full-map.png";
import brazilNewMap from "../assets/branding/brazil-new-map.webp";
import brazilAccurateMap from "../assets/maps/brazil-accurate-map.svg";
import earthImageSvg from "../assets/branding/earth-image.svg";
import { startOfWeek, addDays } from "date-fns";
import { StepEntry } from "./StepEntryForm";
import TeamJourneyMap from "./TeamJourneyMap";

interface Landmark {
  id: number;
  name: string;
  distanceFromStart: number;
}

interface TeamProgressProps {
  targetDistance: number;
  landmarks: Landmark[];
  currentLandmark: {
    name: string;
    distanceFromStart: number;
  };
  entries: StepEntry[];
}

const TeamProgress: FC<TeamProgressProps> = ({
  targetDistance,
  landmarks,
  currentLandmark,
  entries
}) => {
  console.log('entries', JSON.stringify(entries));// TODO NINA: remove
  // Calculate total steps and distance from entries
  const totalSteps = entries.reduce((sum, e) => sum + e.steps, 0);
  const totalDistance = totalSteps * 0.0008; // 1 step = 0.0008 km

  // Find challenge start date (earliest entry date)
  const entryDates = entries.map(e => new Date(e.date));
  let challengeStartDate = new Date();
  if (entryDates.length > 0) {
    const minTimestamp = Math.min(...entryDates.map(d => d.getTime()));
    challengeStartDate = new Date(minTimestamp);
  }
  const now = new Date();

  // Calculate days elapsed (inclusive of today)
  const daysElapsed = Math.max(1, Math.ceil((now.getTime() - challengeStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  // Calculate daily averages
  const dailyAverageDistance = totalDistance / daysElapsed;
  const dailyAverageSteps = totalSteps / daysElapsed;

  // Calculate completion percentage
  const completionPercentage = targetDistance > 0 ? Math.min(100, Math.round((totalDistance / targetDistance) * 100)) : 0;

  // Calculate distance remaining
  const distanceRemaining = Math.max(0, targetDistance - totalDistance);

  // Calculate estimated time remaining
  const daysRemaining = dailyAverageDistance > 0 ? Math.ceil(distanceRemaining / dailyAverageDistance) : 0;

  // entries: StepEntry[] (all users, all dates)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const teamEntriesThisMonth = entries.filter(e => {
    const entryDate = new Date(e.date);
    return entryDate >= monthStart && entryDate <= now;
  });

  // Calculate week ranges for the month
  const weeks: { name: string; steps: number }[] = [];
  let weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  let weekIdx = 1;
  while ((weekStart.getMonth() === now.getMonth() && weekStart <= now) || (weekStart <= now && weekIdx <= 6)) {
    const weekEnd = addDays(weekStart, 6);
    const weekEntries = teamEntriesThisMonth.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= weekStart && entryDate <= weekEnd && entryDate.getMonth() === now.getMonth();
    });
    const steps = weekEntries.reduce((sum, e) => sum + e.steps, 0);
    weeks.push({
      name: `Week ${weekIdx}`,
      steps,
    });
    weekStart = addDays(weekStart, 7);
    weekIdx++;
    if (weekStart > now) break;
  }
  const chartData = weeks;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-heading font-bold text-neutral-800 dark:text-white">Team Progress</h3>
        <div className="bg-neutral-100 dark:bg-gray-700 rounded-lg p-2 text-sm font-medium text-neutral-800 dark:text-white">
          {totalSteps && <>
            <i className="ri-team-line mr-1 text-primary"></i>
            {totalSteps?.toLocaleString()} total steps
          </>
          }
        </div>
      </div>

      {/* Brazil Map with Accurate Geography */}
      <TeamJourneyMap totalDistance={targetDistance} currentDistance={totalDistance} />

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
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-300">Target: {targetDistance && targetDistance.toLocaleString()} km</div>
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
                  className={`absolute -left-8 mt-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${isCompleted
                    ? 'bg-accent'
                    : isCurrent
                      ? 'bg-primary animate-pulse'
                      : 'bg-neutral-300 dark:bg-gray-600'
                    }`}
                ></div>
                <div className={`${isCurrent
                  ? 'bg-primary/10 border-primary/20'
                  : isCompleted
                    ? 'bg-accent/10 border-accent/20'
                    : 'bg-neutral-100 dark:bg-gray-700 border-neutral-200 dark:border-gray-600'
                  } p-3 rounded-lg border`}
                >
                  <p className={`text-sm font-medium ${isCurrent
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
