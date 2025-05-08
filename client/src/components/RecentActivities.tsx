import { FC } from "react";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: number;
  displayName: string;
}

interface Activity {
  id: number;
  userId: number;
  user: User;
  type: string;
  description: string;
  createdAt: Date;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: FC<RecentActivitiesProps> = ({ activities }) => {
  // Function to get the appropriate icon for each activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'step_update':
        return <i className="ri-footprint-line text-lg"></i>;
      case 'ranking_update':
        return <i className="ri-trophy-line text-lg"></i>;
      case 'landmark_reached':
        return <i className="ri-map-pin-line text-lg"></i>;
      case 'joined_challenge':
        return <i className="ri-user-add-line text-lg"></i>;
      default:
        return <i className="ri-information-line text-lg"></i>;
    }
  };

  // Function to get the appropriate icon background color
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'step_update':
        return 'bg-primary/10 text-primary';
      case 'ranking_update':
        return 'bg-secondary/10 text-secondary';
      case 'landmark_reached':
        return 'bg-accent/10 text-accent';
      case 'joined_challenge':
        return 'bg-neutral-200 text-neutral-500';
      default:
        return 'bg-neutral-200 text-neutral-500';
    }
  };

  // Function to format the timestamp
  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-xl font-heading font-bold text-neutral-800 mb-4">Recent Activities</h3>
      
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-neutral-800">{activity.description}</span>
                </div>
                <span className="text-xs text-neutral-500">{formatTime(activity.createdAt)}</span>
              </div>
              {activity.type === 'step_update' && (
                <p className="text-sm text-neutral-500 mt-1">You're 1,476 steps away from your daily goal.</p>
              )}
              {activity.type === 'ranking_update' && (
                <p className="text-sm text-neutral-500 mt-1">She's ahead by 31,150 steps this week.</p>
              )}
              {activity.type === 'landmark_reached' && (
                <p className="text-sm text-neutral-500 mt-1">The team has completed 1,150 km of the journey.</p>
              )}
              {activity.type === 'joined_challenge' && (
                <p className="text-sm text-neutral-500 mt-1">Sam contributed 15,420 steps on the first day.</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-neutral-500 font-medium border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors">
        View All Activities
      </button>
    </div>
  );
};

export default RecentActivities;
