import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { periodSchema, insertStepEntrySchema } from "@shared/schema";
import { format } from "date-fns";

// Utility function to convert steps to distance (2000 steps per mile, converted to km)
function convertStepsToDistance(steps: number): number {
  const milesPerStep = 1 / 2000;
  const kmPerMile = 1.60934;
  return steps * milesPerStep * kmPerMile;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Get current user (for now just return a mock user)
  app.get("/api/me", async (req: Request, res: Response) => {
    const user = await storage.getUserByUsername("johndoe");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ user });
  });

  // Get active challenges
  app.get("/api/challenges", async (_req: Request, res: Response) => {
    const challenges = await storage.getActiveChallenges();
    res.json({ challenges });
  });

  // Get challenge details by ID
  app.get("/api/challenges/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const challenge = await storage.getChallenge(parseInt(id));
    
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    const participants = await storage.getChallengeParticipants(challenge.id);
    const totalSteps = await storage.getTotalStepsForChallenge(challenge.id);
    const totalDistance = convertStepsToDistance(totalSteps);
    const landmarks = await storage.getLandmarks(challenge.id);
    
    res.json({
      challenge,
      participants,
      stats: {
        totalParticipants: participants.length,
        totalSteps,
        totalDistance,
        completionPercentage: Math.min(100, Math.round((totalDistance / challenge.targetDistance) * 100)),
      },
      landmarks
    });
  });

  // Get user's step data by period (day, week, month)
  app.get("/api/steps/:userId/:challengeId/:period", async (req: Request, res: Response) => {
    const { userId, challengeId, period } = req.params;
    
    try {
      const parsedPeriod = periodSchema.parse(period);
      const entries = await storage.getStepEntriesByPeriod(
        parseInt(userId),
        parseInt(challengeId),
        parsedPeriod
      );

      const totalSteps = entries.reduce((sum, entry) => sum + entry.steps, 0);
      const distanceKm = convertStepsToDistance(totalSteps);
      
      // Get previous day's steps for comparison
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayEntries = await storage.getStepEntriesByPeriod(
        parseInt(userId),
        parseInt(challengeId),
        'day'
      );
      const yesterdaySteps = yesterdayEntries.reduce((sum, entry) => sum + entry.steps, 0);
      
      // Get user's contribution percentage to team
      const totalTeamSteps = await storage.getTotalStepsForChallenge(parseInt(challengeId));
      const contributionPercentage = totalTeamSteps > 0 
        ? Math.round((totalSteps / totalTeamSteps) * 100) 
        : 0;
      
      // Get user's position in team
      const leaderboard = await storage.getLeaderboard(parseInt(challengeId));
      const userPosition = leaderboard.findIndex(entry => entry.user.id === parseInt(userId)) + 1;
      
      res.json({
        entries,
        stats: {
          totalSteps,
          distanceKm,
          yesterdaySteps,
          changeFromYesterday: totalSteps - yesterdaySteps,
          contributionPercentage,
          teamPosition: userPosition
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid period type" });
    }
  });

  // Record steps for a user
  app.post("/api/steps", async (req: Request, res: Response) => {
    try {
      const stepEntry = insertStepEntrySchema.parse(req.body);
      
      // Format date if it's a Date object
      if (stepEntry.date instanceof Date) {
        stepEntry.date = format(stepEntry.date, 'yyyy-MM-dd');
      }
      
      const result = await storage.addStepEntry(stepEntry);
      res.json({ success: true, stepEntry: result });
    } catch (error) {
      res.status(400).json({ message: "Invalid step data" });
    }
  });

  // Get leaderboard for a challenge
  app.get("/api/leaderboard/:challengeId", async (req: Request, res: Response) => {
    const { challengeId } = req.params;
    const leaderboard = await storage.getLeaderboard(parseInt(challengeId));
    
    // Calculate weekly steps for each user
    const leaderboardWithWeekly = await Promise.all(
      leaderboard.map(async (entry) => {
        const weeklyEntries = await storage.getStepEntriesByPeriod(
          entry.user.id,
          parseInt(challengeId),
          'week'
        );
        
        const weeklySteps = weeklyEntries.reduce((sum, entry) => sum + entry.steps, 0);
        
        return {
          ...entry,
          weeklySteps
        };
      })
    );
    
    res.json({ leaderboard: leaderboardWithWeekly });
  });

  // Get upcoming landmarks
  app.get("/api/landmarks/:challengeId/upcoming", async (req: Request, res: Response) => {
    const { challengeId } = req.params;
    
    // Calculate current distance
    const totalSteps = await storage.getTotalStepsForChallenge(parseInt(challengeId));
    const currentDistance = convertStepsToDistance(totalSteps);
    
    const upcomingLandmarks = await storage.getUpcomingLandmarks(
      parseInt(challengeId),
      currentDistance
    );
    
    // Add distance remaining to each landmark
    const landmarksWithDistance = upcomingLandmarks.map(landmark => ({
      ...landmark,
      distanceRemaining: landmark.distanceFromStart - currentDistance
    }));
    
    res.json({ landmarks: landmarksWithDistance });
  });

  // Get recent activities
  app.get("/api/activities/:challengeId", async (req: Request, res: Response) => {
    const { challengeId } = req.params;
    const { limit } = req.query;
    
    const activities = await storage.getRecentActivities(
      parseInt(challengeId),
      limit ? parseInt(limit as string) : 10
    );
    
    res.json({ activities });
  });

  return httpServer;
}
