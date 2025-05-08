import { FC } from "react";

interface User {
  id: number;
  displayName: string;
  initials: string;
  avatarColor: string;
}

interface LeaderboardEntry {
  user: User;
  totalSteps: number;
  weeklySteps: number;
}

interface UpcomingLandmark {
  id: number;
  name: string;
  description: string;
  distanceFromStart: number;
  distanceRemaining: number;
  imageUrl: string;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  upcomingLandmarks: UpcomingLandmark[];
  currentUserId: number;
}

const Leaderboard: FC<LeaderboardProps> = ({ leaderboard, upcomingLandmarks, currentUserId }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-heading font-bold text-neutral-800 mb-4">Team Leaderboard</h3>
        
        {/* Leaderboard List */}
        <div className="space-y-4">
          {leaderboard.map((entry, index) => {
            const isCurrentUser = entry.user.id === currentUserId;
            const position = index + 1;
            
            return (
              <div 
                key={entry.user.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isCurrentUser ? 'bg-neutral-100' : 'hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center">
                  <div 
                    className={`w-8 h-8 flex items-center justify-center text-white rounded-full font-bold mr-3 ${
                      position === 1 
                        ? 'bg-primary' 
                        : position === 2 
                          ? 'bg-secondary' 
                          : position === 3 
                            ? 'bg-accent' 
                            : 'bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {position}
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3"
                    style={{ backgroundColor: entry.user.avatarColor }}
                  >
                    {entry.user.initials}
                  </div>
                  <div>
                    <div className={`font-medium ${isCurrentUser ? 'text-primary' : 'text-neutral-800'}`}>
                      {isCurrentUser ? 'You' : entry.user.displayName}
                    </div>
                    <div className="text-sm text-neutral-500">{entry.totalSteps.toLocaleString()} steps today</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-neutral-800">{entry.totalSteps.toLocaleString()}</div>
                  <div className="text-sm text-primary">+{entry.weeklySteps.toLocaleString()} steps this week</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="w-full mt-4 py-2 text-primary font-medium border border-primary rounded-lg hover:bg-primary/5 transition-colors">
          View All Team Members
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-heading font-bold text-neutral-800 mb-4">Upcoming Landmarks</h3>
        
        <div className="space-y-4">
          {upcomingLandmarks.map(landmark => (
            <div key={landmark.id} className="relative rounded-lg overflow-hidden cursor-pointer">
              <img 
                src={landmark.imageUrl} 
                alt={landmark.name} 
                className="w-full h-40 object-cover" 
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = "https://images.unsplash.com/photo-1608576156196-aad17c2f4bef?q=80&w=1470";
                }}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="text-white font-bold">{landmark.name}</div>
                <div className="text-white/80 text-sm">
                  {landmark.distanceRemaining < 1 
                    ? "Just ahead!" 
                    : `${Math.round(landmark.distanceRemaining)} km ahead`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
