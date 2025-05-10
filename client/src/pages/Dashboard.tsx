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
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase"; // adjust path as needed
import type { StepEntry } from "@/components/StepEntryForm"
import { Separator } from "@radix-ui/react-context-menu";
const Dashboard = () => {
  const [period, setPeriod] = usePeriod();
  const [participants, setParticipants] = useState<string[]>([]);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>([]);

  useEffect(() => {
    function fetchParticipantsAndSteps() {
      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(collection(db, "steps"), (querySnapshot) => {
        const userNames = new Set<string>();
        const stepEntries: StepEntry[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          userNames.add(data.username);
          stepEntries.push(data as StepEntry);
        });
        setParticipants(Array.from(userNames) as string[]);
        setStepEntries(stepEntries);
      }, (error) => {
        console.error("Error fetching participants:", error);
      });
      return unsubscribe;
    }

    const unsubscribe = fetchParticipantsAndSteps();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle period change
  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  // Check if all required data is loaded
  const isLoading = false;

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
