import {
  users, User, InsertUser,
  challenges, Challenge, InsertChallenge,
  challengeParticipants, ChallengeParticipant, InsertChallengeParticipant,
  stepEntries, StepEntry, InsertStepEntry,
  landmarks, Landmark, InsertLandmark,
  activities, Activity, InsertActivity,
  Period
} from "@shared/schema";
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, format, addDays, subDays } from "date-fns";

// Storage Interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Challenge operations
  getChallenge(id: number): Promise<Challenge | undefined>;
  getActiveChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // Challenge participants
  addParticipantToChallenge(participant: InsertChallengeParticipant): Promise<ChallengeParticipant>;
  getChallengeParticipants(challengeId: number): Promise<User[]>;
  
  // Step entries
  addStepEntry(entry: InsertStepEntry): Promise<StepEntry>;
  getStepEntriesByPeriod(userId: number, challengeId: number, period: Period): Promise<StepEntry[]>;
  getTotalStepsForChallenge(challengeId: number): Promise<number>;
  getLeaderboard(challengeId: number): Promise<{user: User, totalSteps: number}[]>;
  
  // Landmarks
  getLandmarks(challengeId: number): Promise<Landmark[]>;
  addLandmark(landmark: InsertLandmark): Promise<Landmark>;
  getUpcomingLandmarks(challengeId: number, currentDistance: number): Promise<Landmark[]>;
  
  // Activities
  addActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(challengeId: number, limit?: number): Promise<(Activity & {user: User})[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private challengeParticipants: Map<number, ChallengeParticipant>;
  private stepEntries: Map<number, StepEntry>;
  private landmarks: Map<number, Landmark>;
  private activities: Map<number, Activity>;
  
  private userIdCounter: number;
  private challengeIdCounter: number;
  private participantIdCounter: number;
  private stepEntryIdCounter: number;
  private landmarkIdCounter: number;
  private activityIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.challengeParticipants = new Map();
    this.stepEntries = new Map();
    this.landmarks = new Map();
    this.activities = new Map();
    
    this.userIdCounter = 1;
    this.challengeIdCounter = 1;
    this.participantIdCounter = 1;
    this.stepEntryIdCounter = 1;
    this.landmarkIdCounter = 1;
    this.activityIdCounter = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }
  
  async getActiveChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(challenge => challenge.isActive);
  }
  
  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeIdCounter++;
    const challenge: Challenge = { ...insertChallenge, id };
    this.challenges.set(id, challenge);
    return challenge;
  }
  
  async addParticipantToChallenge(insertParticipant: InsertChallengeParticipant): Promise<ChallengeParticipant> {
    const id = this.participantIdCounter++;
    const joinedAt = new Date();
    const participant: ChallengeParticipant = { ...insertParticipant, id, joinedAt };
    this.challengeParticipants.set(id, participant);
    
    // Add activity for joining challenge
    const user = await this.getUser(insertParticipant.userId);
    if (user) {
      this.addActivity({
        userId: user.id,
        challengeId: insertParticipant.challengeId,
        type: 'joined_challenge',
        description: `${user.displayName} joined the challenge`
      });
    }
    
    return participant;
  }
  
  async getChallengeParticipants(challengeId: number): Promise<User[]> {
    const participantRecords = Array.from(this.challengeParticipants.values())
      .filter(record => record.challengeId === challengeId);
    
    const participants: User[] = [];
    for (const record of participantRecords) {
      const user = await this.getUser(record.userId);
      if (user) {
        participants.push(user);
      }
    }
    
    return participants;
  }
  
  async addStepEntry(insertStepEntry: InsertStepEntry): Promise<StepEntry> {
    const id = this.stepEntryIdCounter++;
    const stepEntry: StepEntry = { ...insertStepEntry, id };
    this.stepEntries.set(id, stepEntry);
    
    // Add activity for step update
    const user = await this.getUser(insertStepEntry.userId);
    if (user) {
      this.addActivity({
        userId: user.id,
        challengeId: insertStepEntry.challengeId,
        type: 'step_update',
        description: `${user.displayName} completed ${insertStepEntry.steps} steps`
      });
    }
    
    return stepEntry;
  }
  
  async getStepEntriesByPeriod(userId: number, challengeId: number, period: Period): Promise<StepEntry[]> {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    
    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
    }
    
    return Array.from(this.stepEntries.values()).filter(entry => 
      entry.userId === userId && 
      entry.challengeId === challengeId &&
      new Date(entry.date) >= startDate &&
      new Date(entry.date) <= endDate
    );
  }
  
  async getTotalStepsForChallenge(challengeId: number): Promise<number> {
    return Array.from(this.stepEntries.values())
      .filter(entry => entry.challengeId === challengeId)
      .reduce((sum, entry) => sum + entry.steps, 0);
  }
  
  async getLeaderboard(challengeId: number): Promise<{user: User, totalSteps: number}[]> {
    // Get all participants
    const participants = await this.getChallengeParticipants(challengeId);
    
    // Calculate total steps for each participant
    const leaderboardEntries = await Promise.all(participants.map(async (user) => {
      const userSteps = Array.from(this.stepEntries.values())
        .filter(entry => entry.userId === user.id && entry.challengeId === challengeId)
        .reduce((sum, entry) => sum + entry.steps, 0);
      
      return {
        user,
        totalSteps: userSteps
      };
    }));
    
    // Sort by total steps in descending order
    return leaderboardEntries.sort((a, b) => b.totalSteps - a.totalSteps);
  }
  
  async getLandmarks(challengeId: number): Promise<Landmark[]> {
    return Array.from(this.landmarks.values())
      .filter(landmark => landmark.challengeId === challengeId)
      .sort((a, b) => a.distanceFromStart - b.distanceFromStart);
  }
  
  async addLandmark(insertLandmark: InsertLandmark): Promise<Landmark> {
    const id = this.landmarkIdCounter++;
    const landmark: Landmark = { ...insertLandmark, id };
    this.landmarks.set(id, landmark);
    return landmark;
  }
  
  async getUpcomingLandmarks(challengeId: number, currentDistance: number): Promise<Landmark[]> {
    return (await this.getLandmarks(challengeId))
      .filter(landmark => landmark.distanceFromStart > currentDistance)
      .sort((a, b) => a.distanceFromStart - b.distanceFromStart)
      .slice(0, 3); // Get the next 3 upcoming landmarks
  }
  
  async addActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const createdAt = new Date();
    const activity: Activity = { ...insertActivity, id, createdAt };
    this.activities.set(id, activity);
    return activity;
  }
  
  async getRecentActivities(challengeId: number, limit: number = 10): Promise<(Activity & {user: User})[]> {
    const activities = Array.from(this.activities.values())
      .filter(activity => activity.challengeId === challengeId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    
    const activitiesWithUser = await Promise.all(activities.map(async (activity) => {
      const user = await this.getUser(activity.userId);
      return { ...activity, user: user! };
    }));
    
    return activitiesWithUser;
  }
  
  // Initialize with demo data
  private async initializeDemoData() {
    // Create demo users
    const user1 = await this.createUser({
      username: 'johndoe',
      password: 'password123',
      displayName: 'John Doe',
      initials: 'JS',
      avatarColor: '#343A40'
    });
    
    const user2 = await this.createUser({
      username: 'katelopez',
      password: 'password123',
      displayName: 'Kate López',
      initials: 'KL',
      avatarColor: '#33A1FF'
    });
    
    const user3 = await this.createUser({
      username: 'mikereynolds',
      password: 'password123',
      displayName: 'Mike Reynolds',
      initials: 'MR',
      avatarColor: '#FF5733'
    });
    
    const user4 = await this.createUser({
      username: 'amywong',
      password: 'password123',
      displayName: 'Amy Wong',
      initials: 'AW',
      avatarColor: '#6C757D'
    });
    
    const user5 = await this.createUser({
      username: 'tomhanks',
      password: 'password123',
      displayName: 'Tom Hanks',
      initials: 'TH',
      avatarColor: '#6C757D'
    });
    
    // Create Brazil challenge
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 18);
    
    const challenge = await this.createChallenge({
      name: 'Brazil Coast Challenge',
      description: "Step across Brazil's beautiful coastline with your team!",
      startDate: new Date(),
      endDate: endDate,
      targetDistance: 2900,
      isActive: true
    });
    
    // Add participants to challenge
    await this.addParticipantToChallenge({ userId: user1.id, challengeId: challenge.id });
    await this.addParticipantToChallenge({ userId: user2.id, challengeId: challenge.id });
    await this.addParticipantToChallenge({ userId: user3.id, challengeId: challenge.id });
    await this.addParticipantToChallenge({ userId: user4.id, challengeId: challenge.id });
    await this.addParticipantToChallenge({ userId: user5.id, challengeId: challenge.id });
    
    // Add landmarks
    await this.addLandmark({
      challengeId: challenge.id,
      name: 'Salvador',
      description: 'Historic city on Brazil\'s northeast coast',
      distanceFromStart: 500,
      imageUrl: 'https://images.unsplash.com/photo-1548823142-b521d8e0fe91?q=80&w=1000'
    });
    
    await this.addLandmark({
      challengeId: challenge.id,
      name: 'Recife',
      description: 'Known as the "Brazilian Venice"',
      distanceFromStart: 850,
      imageUrl: 'https://images.unsplash.com/photo-1623968986400-48c1fe76b714?q=80&w=1000'
    });
    
    await this.addLandmark({
      challengeId: challenge.id,
      name: 'Rio de Janeiro',
      description: 'Home to the iconic Christ the Redeemer statue',
      distanceFromStart: 1219,
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1000'
    });
    
    await this.addLandmark({
      challengeId: challenge.id,
      name: 'Copacabana Beach',
      description: 'Famous beach in Rio de Janeiro',
      distanceFromStart: 1234,
      imageUrl: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1000'
    });
    
    await this.addLandmark({
      challengeId: challenge.id,
      name: 'Christ the Redeemer',
      description: 'Iconic statue of Jesus Christ',
      distanceFromStart: 1261,
      imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=1000'
    });
    
    await this.addLandmark({
      challengeId: challenge.id,
      name: 'Tijuca Forest',
      description: 'Urban forest in Rio de Janeiro',
      distanceFromStart: 1287,
      imageUrl: 'https://pixabay.com/get/g5fe0dd356065ed6fe70cde6babfdfe21b977681988ce5d57e64a98a9e678bdd752b025a7663bbfa886ee2ca6e7f12a9dc788f9e45844c01b23b2095f6ad5b3b4_1280.jpg'
    });
    
    await this.addLandmark({
      challengeId: challenge.id,
      name: 'São Paulo',
      description: 'Brazil\'s largest city',
      distanceFromStart: 1500,
      imageUrl: 'https://images.unsplash.com/photo-1543059080-f9b1272213a5?q=80&w=1000'
    });
    
    await this.addLandmark({
      challengeId: challenge.id,
      name: 'Porto Alegre',
      description: 'Capital of the state of Rio Grande do Sul',
      distanceFromStart: 2400,
      imageUrl: 'https://images.unsplash.com/photo-1591203301323-8aea4e626b9d?q=80&w=1000'
    });
    
    // Add step entries for each user
    // Today's steps
    await this.addStepEntry({
      userId: user1.id,
      challengeId: challenge.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      steps: 8524
    });
    
    await this.addStepEntry({
      userId: user2.id,
      challengeId: challenge.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      steps: 12452
    });
    
    await this.addStepEntry({
      userId: user3.id,
      challengeId: challenge.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      steps: 10128
    });
    
    await this.addStepEntry({
      userId: user4.id,
      challengeId: challenge.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      steps: 7845
    });
    
    await this.addStepEntry({
      userId: user5.id,
      challengeId: challenge.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      steps: 6742
    });
    
    // Previous days in the week
    for (let i = 1; i <= 6; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      
      await this.addStepEntry({
        userId: user1.id,
        challengeId: challenge.id,
        date,
        steps: Math.floor(Math.random() * 3000) + 7000 // Random steps between 7000-10000
      });
      
      await this.addStepEntry({
        userId: user2.id,
        challengeId: challenge.id,
        date,
        steps: Math.floor(Math.random() * 3000) + 9000 // Random steps between 9000-12000
      });
      
      await this.addStepEntry({
        userId: user3.id,
        challengeId: challenge.id,
        date,
        steps: Math.floor(Math.random() * 3000) + 8000 // Random steps between 8000-11000
      });
      
      await this.addStepEntry({
        userId: user4.id,
        challengeId: challenge.id,
        date,
        steps: Math.floor(Math.random() * 3000) + 6000 // Random steps between 6000-9000
      });
      
      await this.addStepEntry({
        userId: user5.id,
        challengeId: challenge.id,
        date,
        steps: Math.floor(Math.random() * 3000) + 5000 // Random steps between 5000-8000
      });
    }
    
    // Add some recent activities
    await this.addActivity({
      userId: user1.id,
      challengeId: challenge.id,
      type: 'step_update',
      description: 'You completed 8,524 steps today'
    });
    
    await this.addActivity({
      userId: user2.id,
      challengeId: challenge.id,
      type: 'ranking_update',
      description: 'Kate López took the lead in the team ranking'
    });
    
    await this.addActivity({
      userId: user1.id,
      challengeId: challenge.id,
      type: 'landmark_reached',
      description: 'Team reached Paraty checkpoint'
    });
    
    const newUser = await this.createUser({
      username: 'samjohnson',
      password: 'password123',
      displayName: 'Sam Johnson',
      initials: 'SJ',
      avatarColor: '#28A745'
    });
    
    await this.addActivity({
      userId: newUser.id,
      challengeId: challenge.id,
      type: 'joined_challenge',
      description: 'Sam Johnson joined the challenge'
    });
  }
}

export const storage = new MemStorage();
