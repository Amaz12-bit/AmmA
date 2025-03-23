import { pgTable, text, serial, integer, boolean, timestamp, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  profilePicture: text("profile_picture"),
  preferredLanguage: text("preferred_language").default("en").notNull(),
});

// Chama schema (group savings)
export const chamas = pgTable("chamas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  foundedDate: timestamp("founded_date").notNull(),
  totalValue: integer("total_value").default(0).notNull(),
  regularContributionAmount: integer("regular_contribution_amount").notNull(),
  contributionFrequency: text("contribution_frequency").notNull(), // weekly, biweekly, monthly
  ownerId: integer("owner_id").notNull(), // The user who created the chama
});

// ChamaMember schema (mapping users to chamas with roles)
export const chamaMembers = pgTable("chama_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  chamaId: integer("chama_id").notNull(),
  role: text("role").notNull(), // admin, treasurer, secretary, member
  joinedDate: timestamp("joined_date").notNull().defaultNow(),
  totalContributed: integer("total_contributed").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Transaction schema (contributions, loans, etc.)
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  chamaId: integer("chama_id").notNull(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // contribution, loan, investment, dividend
  status: text("status").notNull(), // pending, completed, failed
  date: timestamp("date").notNull(),
  paymentMethod: text("payment_method").notNull(), // mpesa, bank, cash
  description: text("description"),
  referenceNumber: text("reference_number"),
});

// Meeting schema
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  chamaId: integer("chama_id").notNull(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  location: text("location"),
  isVirtual: boolean("is_virtual").default(false).notNull(),
  meetingLink: text("meeting_link"),
  description: text("description"),
  createdBy: integer("created_by").notNull(),
});

// Investment schema
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  chamaId: integer("chama_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // real estate, stocks, bonds, mutual funds
  amount: integer("amount").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  expectedReturnRate: text("expected_return_rate"),
  status: text("status").notNull(), // active, matured, sold
  currentValue: integer("current_value").notNull(),
});

// Notification schema
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // payment, meeting, system
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  linkUrl: text("link_url"),
});

// Schema validation with Zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertChamaSchema = createInsertSchema(chamas).omit({
  id: true,
});

export const insertChamaMemberSchema = createInsertSchema(chamaMembers).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Chama = typeof chamas.$inferSelect;
export type InsertChama = z.infer<typeof insertChamaSchema>;

export type ChamaMember = typeof chamaMembers.$inferSelect;
export type InsertChamaMember = z.infer<typeof insertChamaMemberSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
