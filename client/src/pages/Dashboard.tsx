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
import StepEntryForm from "@/components/StepEntryForm";
import { brazilLandmarks, totalDistance } from "@/lib/brazilData";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // adjust path as needed
import type { StepEntry } from "@/components/StepEntryForm"
import { Separator } from "@radix-ui/react-context-menu";
const Dashboard = () => {
  const [period, setPeriod] = usePeriod();
  const [participants, setParticipants] = useState<string[]>([]);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>([]);

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const querySnapshot = await getDocs(collection(db, "steps"));
        const userNames = new Set<string>();
        const stepEntries: StepEntry[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          userNames.add(data.username);
          stepEntries.push(data as StepEntry);
        });
        setParticipants(Array.from(userNames) as string[]);
        setStepEntries(stepEntries);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    }

    fetchParticipants();
  }, []);


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
    queryKey: [`/api/steps/${userData?.user?.id || 1}/${activeChallenge?.id || 1}/${period}`],
    enabled: true,
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
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-xl text-center text-primary">
          <i className="ri-loader-4-line animate-spin text-4xl mb-4 block"></i>
          Loading your fitness journey...
        </div>
      </div>
    );
  }

  // If we don't have the required data, show error state
  // if (!userData || !challengeDetailsData) {
  //   console.error("Missing required data:", { userData, challengeDetailsData });
  //   return (
  //     <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
  //       <div className="text-xl text-center text-destructive">
  //         <i className="ri-error-warning-line text-4xl mb-4 block"></i>
  //         Could not load challenge data. Please try again.
  //       </div>
  //     </div>
  //   );
  // }

  // Get all necessary data, using safe defaults if needed
  const challenge = {
    name: "June Challenge",
    targetDistance: 100000,
    endDate: new Date(2025, 5, 30),
    description: "Let's walk together in June!",
    startDate: new Date(2025, 5, 1)
  }
  const landmarks = brazilLandmarks;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <ChallengeHeader
            challenge={challenge}
            participants={participants}
          />


          <StepEntryForm />

          <IndividualStats
            handlePeriodChange={handlePeriodChange}
            entries={stepEntries}
            period={period}
            challengeStartDate={challenge.startDate.toISOString()}
          />

          <TeamProgress
            entries={stepEntries}
            landmarks={landmarks}
            currentLandmark={landmarks[11]}
          />

          <Leaderboard
            entries={stepEntries}
            upcomingLandmarks={landmarks.filter(landmark => landmark.distanceFromStart <= totalDistance)}
          />

          {/* <RecentActivities
            activities={recentActivities}
          /> */}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Dashboard;
