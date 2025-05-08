import { FC } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import CircularProgress from "./CircularProgress";
import { format, parseISO, startOfWeek, addDays } from "date-fns";

interface StepEntry {
  id: number;
  userId: number;
  challengeId: number;
  date: string;
  steps: number;
}

interface StatsProps {
  entries: StepEntry[];
  stats: {
    totalSteps: number;
    distanceKm: number;
    yesterdaySteps: number;
    changeFromYesterday: number;
    contributionPercentage: number;
    teamPosition: number;
  };
  period: "day" | "week" | "month";
}

const IndividualStats: FC<StatsProps> = ({ entries, stats, period }) => {
  // Calculate percentage completion for each stat
  const dailyGoalCompletion = Math.min(100, Math.round((stats.totalSteps / 10000) * 100));
  const distanceGoalCompletion = Math.min(100, Math.round((stats.distanceKm / 8.5) * 100));
  
  // Prepare data for the chart based on period
  const prepareChartData = () => {
    if (period === "day") {
      // For daily view, show hourly breakdown
      return [
        { name: "Morning", steps: Math.floor(stats.totalSteps * 0.3) },
        { name: "Afternoon", steps: Math.floor(stats.totalSteps * 0.4) },
        { name: "Evening", steps: Math.floor(stats.totalSteps * 0.3) },
      ];
    } else if (period === "week") {
      // For weekly view, show daily breakdown
      const today = new Date();
      const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
      
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(startOfWeekDate, i);
        const dayFormatted = format(day, "EEE");
        const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        
        // Find entry for this day
        const entry = entries.find(e => {
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
      // For monthly view, group by week
      return [
        { name: "Week 1", steps: Math.floor(stats.totalSteps * 0.2) },
        { name: "Week 2", steps: Math.floor(stats.totalSteps * 0.35) },
        { name: "Week 3", steps: Math.floor(stats.totalSteps * 0.25) },
        { name: "Week 4", steps: Math.floor(stats.totalSteps * 0.2) },
      ];
    }
    
    return [];
  };
  
  const chartData = prepareChartData();
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-xl font-heading font-bold text-neutral-800 mb-4">Your Progress</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Steps */}
        <div className="flex items-center">
          <CircularProgress 
            percentage={dailyGoalCompletion} 
            size={80} 
            strokeWidth={6} 
            color="var(--primary)"
          />
          <div className="ml-4">
            <h4 className="text-lg font-bold text-neutral-800">{stats.totalSteps.toLocaleString()}</h4>
            <p className="text-neutral-500">Steps today</p>
            <p className={`text-sm font-medium ${stats.changeFromYesterday >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {stats.changeFromYesterday >= 0 ? '+' : ''}{stats.changeFromYesterday.toLocaleString()} from yesterday
            </p>
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
            <p className="text-neutral-500">Distance today</p>
            <p className="text-sm text-secondary font-medium">Target: 8.5 km</p>
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
            Average: {Math.round(stats.totalSteps / (period === "day" ? 1 : period === "week" ? 7 : 30)).toLocaleString()} steps
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
                shape={(props) => {
                  const { x, y, width, height, today } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={4}
                      fill={today ? "rgba(51, 161, 255, 0.2)" : "rgba(255, 87, 51, 0.2)"}
                    />
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Bar
                    key={`bar-${index}`}
                    dataKey="steps"
                    fill={entry.today ? "var(--secondary)" : "var(--primary)"}
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

export default IndividualStats;
