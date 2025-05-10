import { FC, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import CircularProgress from "./CircularProgress";
import { format, parseISO, startOfWeek, addDays, differenceInCalendarDays } from "date-fns";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase"; // adjust path as needed
import { StepEntry } from "./StepEntryForm";
import PeriodSelector from "./PeriodSelector";


interface StatsProps {
  entries: StepEntry[];
  period: "week" | "month"; // Only allow week or month
  challengeStartDate: string;
  handlePeriodChange: (period: "week" | "month") => void;
}

const IndividualStats: FC<StatsProps> = ({ entries, period, challengeStartDate, handlePeriodChange }) => {
  const [user] = useAuthState(auth);

  // Memoize calculations for performance
  const stats = useMemo(() => {
    if (!user) return null;
    const userEntries = entries.filter(e => e.userId === user.uid);
    const today = new Date();
    const challengeStart = new Date(challengeStartDate);
    const isChallengeStartValid = !isNaN(challengeStart.getTime());

    // --- PERIOD LOGIC ---
    let periodStart: Date;
    if (period === "week") {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      periodStart = (isChallengeStartValid && weekStart > challengeStart)
        ? weekStart
        : (isChallengeStartValid ? challengeStart : weekStart);
    } else if (period === "month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      periodStart = (isChallengeStartValid && monthStart > challengeStart)
        ? monthStart
        : (isChallengeStartValid ? challengeStart : monthStart);
    } else {
      // fallback: use challenge start
      periodStart = isChallengeStartValid ? challengeStart : today;
    }

    // --- FILTER ENTRIES FOR PERIOD ---
    const userEntriesThisPeriod = userEntries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= periodStart && entryDate <= today;
    });
    // Filter all entries for the selected period
    const allEntriesThisPeriod = entries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= periodStart && entryDate <= today;
    });

    const totalSteps = userEntriesThisPeriod.reduce((sum, e) => sum + e.steps, 0);
    const daysInPeriodSoFar = Math.max(
      1,
      differenceInCalendarDays(today, periodStart) + 1
    );
    const averageSteps = Math.round(totalSteps / daysInPeriodSoFar);

    // Distance: assume 1 step = 0.00085 km (adjust as needed)
    const distanceKm = totalSteps * 0.00085;

    // Team stats (for the selected period)
    const teamTotalSteps = allEntriesThisPeriod.reduce((sum, e) => sum + e.steps, 0);
    const userTotalSteps = userEntriesThisPeriod.reduce((sum, e) => sum + e.steps, 0);
    const contributionPercentage = teamTotalSteps
      ? Math.round(((userTotalSteps || 0) / teamTotalSteps) * 100)
      : 0;

    // Team position (rank)
    const sorted = [...allEntriesThisPeriod].sort((a, b) => b.steps - a.steps);
    const teamPosition = sorted.findIndex(e => e.userId === user.uid) + 1;

    return {
      totalSteps,
      userTotalSteps,
      distanceKm,
      contributionPercentage,
      teamPosition,
      averageSteps,
      daysInPeriodSoFar,
      periodStart,
      userEntriesThisPeriod,
    };
  }, [entries, user, period, challengeStartDate]);

  if (!user || !stats) {
    return <div>Loading...</div>;
  }

  // Set goals for each period
  const goalSteps = period === "week" ? 70000 : 300000; // Example: 10k/day
  const goalDistance = period === "week" ? 59.5 : 255; // Example: 8.5km/day
  const goalLabel = period === "week" ? "Target: 70,000 steps / 59.5 km" : "Target: 300,000 steps / 255 km";

  const stepsGoalCompletion = Math.min(100, Math.round((stats.totalSteps / goalSteps) * 100));
  const distanceGoalCompletion = Math.min(100, Math.round((stats.distanceKm / goalDistance) * 100));

  // Prepare data for the chart based on period
  const prepareChartData = () => {
    if (period === "week") {
      const today = new Date();
      const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });

      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(startOfWeekDate, i);
        const dayFormatted = format(day, "EEE");
        const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

        // Find entry for this day
        const entry = stats.userEntriesThisPeriod.find(e => {
          if (typeof e.date === 'string') {
            return e.date === format(day, 'yyyy-MM-dd');
          }
          return format(new Date(e.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        });

        return {
          name: dayFormatted,
          steps: entry ? entry.steps : 0,
          today: isToday
        };
      });

      return weekDays;
    } else if (period === "month") {
      // For monthly view, show actual steps for each week
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const userEntriesThisMonth = entries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= monthStart && entryDate <= now && e.userId === user.uid;
      });

      // Calculate week ranges for the month
      const weeks: { name: string; steps: number }[] = [];
      let weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      let weekIdx = 1;
      while (weekStart.getMonth() === now.getMonth() || weekStart <= now) {
        const weekEnd = addDays(weekStart, 6);
        const weekEntries = userEntriesThisMonth.filter(e => {
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
      return weeks;
    }
    return [];
  };

  const chartData = prepareChartData();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <PeriodSelector
        period={period}
        onChange={handlePeriodChange}
      />
      <h3 className="text-xl font-heading font-bold text-neutral-800 mb-4">Your Progress</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Steps */}
        <div className="flex items-center">
          <CircularProgress
            percentage={stepsGoalCompletion}
            size={80}
            strokeWidth={6}
            color="var(--primary)"
          />
          <div className="ml-4">
            <h4 className="text-lg font-bold text-neutral-800">{stats.userTotalSteps.toLocaleString()}</h4>
            <p className="text-neutral-500">Steps this {period}</p>
          </div>
        </div>

        {/* Distance */}
        <div className="flex items-center">
          <CircularProgress
            percentage={distanceGoalCompletion}
            size={80}
            strokeWidth={6}
            color="var(--secondary)"
          />
          <div className="ml-4">
            <h4 className="text-lg font-bold text-neutral-800">{stats.distanceKm.toFixed(1)} km</h4>
            <p className="text-neutral-500">Distance this {period}</p>
            <p className="text-sm text-secondary font-medium">{goalLabel}</p>
          </div>
        </div>

        {/* Contribution */}
        <div className="flex items-center">
          <CircularProgress
            percentage={stats.contributionPercentage}
            size={80}
            strokeWidth={6}
            color="var(--accent)"
          />
          <div className="ml-4">
            <h4 className="text-lg font-bold text-neutral-800">{stats.contributionPercentage}%</h4>
            <p className="text-neutral-500">Team contribution</p>
            <p className="text-sm text-accent font-medium">{stats.teamPosition}{getOrdinalSuffix(stats.teamPosition)} place in team</p>
          </div>
        </div>
      </div>

      {/* Steps Chart */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-neutral-800">
            Steps This {period.charAt(0).toUpperCase() + period.slice(1)}
          </h4>
          <div className="text-sm text-neutral-500">
            Average: {stats.averageSteps.toLocaleString()} steps / day
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6C757D' }}
              />
              <YAxis
                hide={true}
                domain={[0, 'dataMax + 1000']}
              />
              <Tooltip
                formatter={(value) => [`${Number(value).toLocaleString()} steps`, 'Steps']}
                contentStyle={{
                  background: 'white',
                  border: '1px solid #E9ECEF',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Bar
                dataKey="steps"
                fill="rgba(255, 87, 51, 0.2)"
                shape={(props: any) => {
                  const { x, y, width, height } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={4}
                      fill="rgba(255, 87, 51, 0.2)"
                    />
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Bar
                    key={`bar-${index}`}
                    dataKey="steps"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Helper function for ordinal suffixes
function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

interface ChallengeHeaderProps {
  entries: StepEntry[];
}

const ChallengeHeader: FC<ChallengeHeaderProps> = ({ entries }) => {
  // Extract unique users by userId
  const uniqueUsers = Array.from(
    new Map(entries.map(entry => [entry.userId, entry.username || entry.userId])).entries()
  ).map(([userId, displayName]) => ({ userId, displayName }));

  return (
    <div className="flex -space-x-2">
      {uniqueUsers.slice(0, 8).map((user) => (
        <div
          key={user.userId}
          className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs"
        >
          {getInitials(user.displayName)}
        </div>
      ))}
      {uniqueUsers.length > 8 && (
        <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-500 text-white flex items-center justify-center text-xs">
          +{uniqueUsers.length - 8}
        </div>
      )}
    </div>
  );
};

export default IndividualStats;
