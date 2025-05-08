import { useState, useEffect } from "react";
import { Period, periodSchema } from "@shared/schema";

// Custom hook for managing period state with localStorage persistence
export function usePeriod(): [Period, (newPeriod: Period) => void] {
  // Initialize with the value from localStorage, defaulting to 'day'
  const [period, setPeriod] = useState<Period>(() => {
    const savedPeriod = localStorage.getItem("steptogether-period");
    
    // Validate that the saved period is valid
    try {
      if (savedPeriod) {
        return periodSchema.parse(savedPeriod);
      }
    } catch (error) {
      console.error("Invalid period in localStorage:", error);
    }
    
    return "day";
  });
  
  // Save to localStorage whenever the period changes
  useEffect(() => {
    localStorage.setItem("steptogether-period", period);
  }, [period]);
  
  // Return both the period state and the setter
  return [period, setPeriod];
}
