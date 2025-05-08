import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ChallengeHeader from "@/components/ChallengeHeader";
import PeriodSelector from "@/components/PeriodSelector";
import IndividualStats from "@/components/IndividualStats";
import TeamProgress from "@/components/TeamProgress";
import Leaderboard from "@/components/Leaderboard";
import RecentActivities from "@/components/RecentActivities";
import MobileNav from "@/components/MobileNav";
import { usePeriod } from "@/hooks/usePeriod";
import { Period } from "@shared/schema";

const Dashboard = () => {
  const [period, setPeriod] = usePeriod();
  
  // Fetch current user
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/me'],
  });
  
  // Fetch active challenge (using the first one for this demo)
  const { data: challengesData, isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['/api/challenges'],
  });
  
  // Get the first challenge for this demo
  const activeChallenge = challengesData?.challenges?.[0];
  
  // Fetch challenge details
  const { data: challengeDetailsData, isLoading: isLoadingDetails } = useQuery({
    queryKey: [`/api/challenges/${activeChallenge?.id || 1}`],
    enabled: true,
  });
  
  // Fetch user's step data
  const { data: stepsData, isLoading: isLoadingSteps } = useQuery({
    queryKey: ['/api/steps', userData?.user?.id, activeChallenge?.id, period],
    enabled: !!(userData?.user?.id && activeChallenge?.id),
  });
  
  console.log('userData:', userData);
  console.log('challengesData:', challengesData);
  console.log('activeChallenge:', activeChallenge);
  
  // Fetch leaderboard
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: [`/api/leaderboard/${activeChallenge?.id || 1}`],
    enabled: true,
  });
  
  // Fetch upcoming landmarks
  const { data: landmarksData, isLoading: isLoadingLandmarks } = useQuery({
    queryKey: [`/api/landmarks/${activeChallenge?.id || 1}/upcoming`],
    enabled: true,
  });
  
  // Fetch recent activities
  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
    queryKey: [`/api/activities/${activeChallenge?.id || 1}`],
    enabled: true,
  });
  
  // Handle period change
  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };
  
  // Check if all required data is loaded
  const isLoading = 
    isLoadingUser || 
    isLoadingChallenges || 
    isLoadingDetails || 
    isLoadingSteps || 
    isLoadingLeaderboard || 
    isLoadingLandmarks ||
    isLoadingActivities;
  
  // If data is still loading, show a simple loading state
  if (isLoading || !userData || !challengeDetailsData || !stepsData || !leaderboardData || !landmarksData || !activitiesData) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-xl text-center text-primary">
          <i className="ri-loader-4-line animate-spin text-4xl mb-4 block"></i>
          Loading your fitness journey...
        </div>
      </div>
    );
  }
  
  // If we have all the data, render the dashboard
  const user = userData.user;
  const challenge = challengeDetailsData.challenge;
  const participants = challengeDetailsData.participants || [];
  const stats = challengeDetailsData.stats || { totalSteps: 0, totalDistance: 0, completionPercentage: 0 };
  const landmarks = challengeDetailsData.landmarks || [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <ChallengeHeader 
            challenge={challenge} 
            participants={participants.length} 
          />
          
          <PeriodSelector 
            period={period} 
            onChange={handlePeriodChange} 
          />
          
          <IndividualStats 
            entries={stepsData.entries} 
            stats={stepsData.stats} 
            period={period} 
          />
          
          <TeamProgress 
            totalSteps={stats.totalSteps}
            totalDistance={stats.totalDistance}
            distanceRemaining={challenge.targetDistance - stats.totalDistance}
            completionPercentage={stats.completionPercentage}
            targetDistance={challenge.targetDistance}
            landmarks={landmarks}
            currentLandmark={{
              name: "Rio de Janeiro",
              distanceCompleted: stats.totalDistance
            }}
          />
          
          <Leaderboard 
            leaderboard={leaderboardData.leaderboard}
            upcomingLandmarks={landmarksData.landmarks}
            currentUserId={user.id}
          />
          
          <RecentActivities 
            activities={activitiesData.activities} 
          />
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Dashboard;
