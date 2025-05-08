import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  initials: text("initials").notNull(),
  avatarColor: text("avatar_color").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  initials: true,
  avatarColor: true,
});

// Challenges table
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  targetDistance: integer("target_distance").notNull(), // in kilometers
  isActive: boolean("is_active").notNull().default(true),
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  targetDistance: true,
  isActive: true,
});

// Challenge Participants (joins users to challenges)
export const challengeParticipants = pgTable("challenge_participants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const insertChallengeParticipantSchema = createInsertSchema(challengeParticipants).pick({
  userId: true,
  challengeId: true,
});

// Daily steps tracking
export const stepEntries = pgTable("step_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  date: date("date").notNull(),
  steps: integer("steps").notNull(),
});

export const insertStepEntrySchema = createInsertSchema(stepEntries).pick({
  userId: true,
  challengeId: true,
  date: true,
  steps: true,
});

// Landmarks along the route
export const landmarks = pgTable("landmarks", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  name: text("name").notNull(),
  description: text("description"),
  distanceFromStart: integer("distance_from_start").notNull(), // in kilometers
  imageUrl: text("image_url"),
});

export const insertLandmarkSchema = createInsertSchema(landmarks).pick({
  challengeId: true,
  name: true,
  description: true,
  distanceFromStart: true,
  imageUrl: true,
});

// Activity log for recent actions
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  type: text("type").notNull(), // e.g., 'step_update', 'joined_challenge', 'reached_landmark'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  challengeId: true,
  type: true,
  description: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertChallengeParticipant = z.infer<typeof insertChallengeParticipantSchema>;

export type StepEntry = typeof stepEntries.$inferSelect;
export type InsertStepEntry = z.infer<typeof insertStepEntrySchema>;

export type Landmark = typeof landmarks.$inferSelect;
export type InsertLandmark = z.infer<typeof insertLandmarkSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// Additional schemas for API requests/responses
export const periodSchema = z.enum(["day", "week", "month"]);
export type Period = z.infer<typeof periodSchema>;
