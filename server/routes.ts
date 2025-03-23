import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertChamaSchema, 
  insertChamaMemberSchema,
  insertTransactionSchema,
  insertMeetingSchema,
  insertInvestmentSchema,
  insertNotificationSchema 
} from "@shared/schema";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "asset-align-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 },
      store: new SessionStore({ checkPeriod: 86400000 }),
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Always allow demo credentials
        if (username === "demo" && password === "demo123") {
          return done(null, {
            id: 1,
            username: "demo",
            email: "demo@example.com",
            firstName: "Demo",
            lastName: "User",
            phoneNumber: "+254712345678",
            preferredLanguage: "en"
          });
        }

        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        // In a real app, we would compare hashed passwords
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // User serialization & deserialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Authentication Middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Authentication Routes
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // In a real app, we would hash the password
      const user = await storage.createUser(validatedData);

      // Auto login after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        return res.status(201).json({ user });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    res.json({ user: req.user });
  });

  // User Routes
  app.put("/api/users/me", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const updatedUser = await storage.updateUser(userId, req.body);
      res.json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  });

  // Chama Routes
  app.get("/api/chamas", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const chamas = await storage.getChamasByUserId(userId);
      res.json({ chamas });
    } catch (error) {
      res.status(500).json({ message: "Error fetching chamas" });
    }
  });

  app.post("/api/chamas", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const validatedData = insertChamaSchema.parse({
        ...req.body,
        ownerId: userId
      });

      const chama = await storage.createChama(validatedData);

      // Automatically add creator as admin member
      const chamaMember = await storage.createChamaMember({
        userId,
        chamaId: chama.id,
        role: "admin",
        joinedDate: new Date(),
        totalContributed: 0,
        isActive: true
      });

      res.status(201).json({ chama });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating chama" });
    }
  });

  app.get("/api/chamas/:id", isAuthenticated, async (req, res) => {
    try {
      const chamaId = parseInt(req.params.id);
      const chama = await storage.getChama(chamaId);

      if (!chama) {
        return res.status(404).json({ message: "Chama not found" });
      }

      // Get members
      const members = await storage.getChamaMembersByChamaId(chamaId);

      res.json({ chama, members });
    } catch (error) {
      res.status(500).json({ message: "Error fetching chama" });
    }
  });

  app.put("/api/chamas/:id", isAuthenticated, async (req, res) => {
    try {
      const chamaId = parseInt(req.params.id);
      const userId = (req.user as any).id;

      // Check if user is admin of this chama
      const members = await storage.getChamaMembersByChamaId(chamaId);
      const userMember = members.find(m => m.userId === userId);

      if (!userMember || userMember.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this chama" });
      }

      const updatedChama = await storage.updateChama(chamaId, req.body);
      res.json({ chama: updatedChama });
    } catch (error) {
      res.status(500).json({ message: "Error updating chama" });
    }
  });

  // Chama Member Routes
  app.post("/api/chamas/:id/members", isAuthenticated, async (req, res) => {
    try {
      const chamaId = parseInt(req.params.id);
      const userId = (req.user as any).id;

      // Check if user is admin of this chama
      const members = await storage.getChamaMembersByChamaId(chamaId);
      const userMember = members.find(m => m.userId === userId);

      if (!userMember || userMember.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to add members" });
      }

      const validatedData = insertChamaMemberSchema.parse({
        ...req.body,
        chamaId
      });

      const newMember = await storage.createChamaMember(validatedData);
      res.status(201).json({ member: newMember });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding member" });
    }
  });

  app.put("/api/chama-members/:id", isAuthenticated, async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const userId = (req.user as any).id;

      const member = await storage.getChamaMember(memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      // Check if user is admin of this chama
      const members = await storage.getChamaMembersByChamaId(member.chamaId);
      const userMember = members.find(m => m.userId === userId);

      if (!userMember || userMember.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update members" });
      }

      const updatedMember = await storage.updateChamaMember(memberId, req.body);
      res.json({ member: updatedMember });
    } catch (error) {
      res.status(500).json({ message: "Error updating member" });
    }
  });

  // Transaction Routes
  app.get("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const transactions = await storage.getTransactionsByUserId(userId);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });

  app.post("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId
      });

      const transaction = await storage.createTransaction(validatedData);

      // If it's a contribution, update the member's total contributed
      if (validatedData.type === "contribution" && validatedData.status === "completed") {
        const members = await storage.getChamaMembersByChamaId(validatedData.chamaId);
        const userMember = members.find(m => m.userId === userId);

        if (userMember) {
          await storage.updateChamaMember(userMember.id, {
            totalContributed: userMember.totalContributed + validatedData.amount
          });
        }
      }

      res.status(201).json({ transaction });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating transaction" });
    }
  });

  app.get("/api/chamas/:id/transactions", isAuthenticated, async (req, res) => {
    try {
      const chamaId = parseInt(req.params.id);
      const userId = (req.user as any).id;

      // Check if user is a member of this chama
      const members = await storage.getChamaMembersByChamaId(chamaId);
      const userMember = members.find(m => m.userId === userId);

      if (!userMember) {
        return res.status(403).json({ message: "Not authorized to view these transactions" });
      }

      const transactions = await storage.getTransactionsByChamaId(chamaId);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });

  // Meeting Routes
  app.get("/api/meetings", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const userChamaMembers = await storage.getChamaMembersByUserId(userId);
      const chamaIds = userChamaMembers.map(member => member.chamaId);

      let allMeetings = [];
      for (const chamaId of chamaIds) {
        const meetings = await storage.getMeetingsByChamaId(chamaId);
        // Add chama information to each meeting
        const chamaInfo = await storage.getChama(chamaId);
        const meetingsWithChamaInfo = meetings.map(meeting => ({
          ...meeting,
          chamaName: chamaInfo?.name
        }));
        allMeetings = [...allMeetings, ...meetingsWithChamaInfo];
      }

      // Sort by date
      allMeetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      res.json({ meetings: allMeetings });
    } catch (error) {
      res.status(500).json({ message: "Error fetching meetings" });
    }
  });

  app.post("/api/chamas/:id/meetings", isAuthenticated, async (req, res) => {
    try {
      const chamaId = parseInt(req.params.id);
      const userId = (req.user as any).id;

      // Check if user is a member with appropriate permissions
      const members = await storage.getChamaMembersByChamaId(chamaId);
      const userMember = members.find(m => m.userId === userId);

      if (!userMember || !["admin", "secretary"].includes(userMember.role)) {
        return res.status(403).json({ message: "Not authorized to create meetings" });
      }

      const validatedData = insertMeetingSchema.parse({
        ...req.body,
        chamaId,
        createdBy: userId
      });

      const meeting = await storage.createMeeting(validatedData);

      // Create notifications for all members
      for (const member of members) {
        if (member.userId !== userId) { // Don't notify the creator
          await storage.createNotification({
            userId: member.userId,
            title: "New Meeting Scheduled",
            message: `A new meeting for ${(await storage.getChama(chamaId))?.name} has been scheduled for ${new Date(validatedData.date).toLocaleString()}.`,
            type: "meeting",
            isRead: false,
            linkUrl: `/meetings`
          });
        }
      }

      res.status(201).json({ meeting });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating meeting" });
    }
  });

  // Investment Routes
  app.get("/api/investments", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const userChamaMembers = await storage.getChamaMembersByUserId(userId);
      const chamaIds = userChamaMembers.map(member => member.chamaId);

      let allInvestments = [];
      for (const chamaId of chamaIds) {
        const investments = await storage.getInvestmentsByChamaId(chamaId);
        // Add chama information to each investment
        const chamaInfo = await storage.getChama(chamaId);
        const investmentsWithChamaInfo = investments.map(investment => ({
          ...investment,
          chamaName: chamaInfo?.name
        }));
        allInvestments = [...allInvestments, ...investmentsWithChamaInfo];
      }

      res.json({ investments: allInvestments });
    } catch (error) {
      res.status(500).json({ message: "Error fetching investments" });
    }
  });

  app.post("/api/chamas/:id/investments", isAuthenticated, async (req, res) => {
    try {
      const chamaId = parseInt(req.params.id);
      const userId = (req.user as any).id;

      // Check if user is admin or treasurer
      const members = await storage.getChamaMembersByChamaId(chamaId);
      const userMember = members.find(m => m.userId === userId);

      if (!userMember || !["admin", "treasurer"].includes(userMember.role)) {
        return res.status(403).json({ message: "Not authorized to create investments" });
      }

      const validatedData = insertInvestmentSchema.parse({
        ...req.body,
        chamaId
      });

      const investment = await storage.createInvestment(validatedData);

      // Create notifications for all members
      for (const member of members) {
        if (member.userId !== userId) { // Don't notify the creator
          await storage.createNotification({
            userId: member.userId,
            title: "New Investment Created",
            message: `A new investment "${validatedData.name}" worth KES ${validatedData.amount} has been created for ${(await storage.getChama(chamaId))?.name}.`,
            type: "system",
            isRead: false,
            linkUrl: `/investments`
          });
        }
      }

      res.status(201).json({ investment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating investment" });
    }
  });

  // Notification Routes
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const notifications = await storage.getNotificationsByUserId(userId);

      // Sort by creation date (newest first)
      notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.json({ notifications });
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const userId = (req.user as any).id;

      const notification = await storage.getNotification(notificationId);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      if (notification.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this notification" });
      }

      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error updating notification" });
    }
  });

  // Dashboard Summary
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;

      // Get user's chamas
      const chamas = await storage.getChamasByUserId(userId);

      // Get total contributions
      const transactions = await storage.getTransactionsByUserId(userId);
      const totalContributions = transactions
        .filter(t => t.type === "contribution" && t.status === "completed")
        .reduce((total, t) => total + t.amount, 0);

      // Get active investments count
      const userChamaMembers = await storage.getChamaMembersByUserId(userId);
      const chamaIds = userChamaMembers.map(member => member.chamaId);

      let activeInvestmentsCount = 0;
      for (const chamaId of chamaIds) {
        const investments = await storage.getInvestmentsByChamaId(chamaId);
        activeInvestmentsCount += investments.filter(i => i.status === "active").length;
      }

      // Get upcoming meetings
      let upcomingMeetings = [];
      for (const chamaId of chamaIds) {
        const meetings = await storage.getMeetingsByChamaId(chamaId);
        const upcomingMeetingsForChama = meetings.filter(m => new Date(m.date) > new Date());
        upcomingMeetings = [...upcomingMeetings, ...upcomingMeetingsForChama];
      }

      // Get recent activities (transactions, meetings)
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      // Get upcoming schedule (due payments, meetings)
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcomingSchedule = {
        today: [],
        thisWeek: [],
        nextWeek: []
      };

      // Process meetings for schedule
      for (const meeting of upcomingMeetings) {
        const meetingDate = new Date(meeting.date);
        const chamaInfo = await storage.getChama(meeting.chamaId);

        if (meetingDate.toDateString() === today.toDateString()) {
          upcomingSchedule.today.push({
            type: "meeting",
            chamaId: meeting.chamaId,
            chamaName: chamaInfo?.name,
            title: meeting.title,
            date: meeting.date,
            details: {
              location: meeting.location,
              isVirtual: meeting.isVirtual,
              meetingLink: meeting.meetingLink
            }
          });
        } else if (meetingDate <= nextWeek && meetingDate > today) {
          if (meetingDate.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000) {
            upcomingSchedule.thisWeek.push({
              type: "meeting",
              chamaId: meeting.chamaId,
              chamaName: chamaInfo?.name,
              title: meeting.title,
              date: meeting.date,
              details: {
                location: meeting.location,
                isVirtual: meeting.isVirtual,
                meetingLink: meeting.meetingLink
              }
            });
          } else {
            upcomingSchedule.nextWeek.push({
              type: "meeting",
              chamaId: meeting.chamaId,
              chamaName: chamaInfo?.name,
              title: meeting.title,
              date: meeting.date,
              details: {
                location: meeting.location,
                isVirtual: meeting.isVirtual,
                meetingLink: meeting.meetingLink
              }
            });
          }
        }
      }

      // Process upcoming contributions
      for (const chama of chamas) {
        const lastContribution = transactions
          .filter(t => t.chamaId === chama.id && t.type === "contribution" && t.status === "completed")
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        // Calculate next contribution date based on frequency
        let nextContributionDate;
        if (lastContribution) {
          nextContributionDate = new Date(lastContribution.date);
          if (chama.contributionFrequency === "weekly") {
            nextContributionDate.setDate(nextContributionDate.getDate() + 7);
          } else if (chama.contributionFrequency === "biweekly") {
            nextContributionDate.setDate(nextContributionDate.getDate() + 14);
          } else if (chama.contributionFrequency === "monthly") {
            nextContributionDate.setMonth(nextContributionDate.getMonth() + 1);
          }
        } else {
          // If no contribution yet, set to today
          nextContributionDate = today;
        }

        if (nextContributionDate.toDateString() === today.toDateString()) {
          upcomingSchedule.today.push({
            type: "contribution",
            chamaId: chama.id,
            chamaName: chama.name,
            title: `Contribution Due: ${chama.name}`,
            date: nextContributionDate,
            amount: chama.regularContributionAmount,
            details: {
              amount: chama.regularContributionAmount
            }
          });
        } else if (nextContributionDate <= nextWeek) {
          if (nextContributionDate.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000) {
            upcomingSchedule.thisWeek.push({
              type: "contribution",
              chamaId: chama.id,
              chamaName: chama.name,
              title: `Contribution Due: ${chama.name}`,
              date: nextContributionDate,
              details: {
                amount: chama.regularContributionAmount
              }
            });
          } else {
            upcomingSchedule.nextWeek.push({
              type: "contribution",
              chamaId: chama.id,
              chamaName: chama.name,
              title: `Contribution Due: ${chama.name}`,
              date: nextContributionDate,
              details: {
                amount: chama.regularContributionAmount
              }
            });
          }
        }
      }

      // Investment summary
      let investmentsByType = {
        "real estate": 0,
        "bonds": 0,
        "stocks": 0,
        "mutual funds": 0,
        "others": 0
      };

      for (const chamaId of chamaIds) {
        const investments = await storage.getInvestmentsByChamaId(chamaId);
        for (const investment of investments) {
          if (investment.status === "active") {
            if (investment.type in investmentsByType) {
              investmentsByType[investment.type] += investment.currentValue;
            } else {
              investmentsByType.others += investment.currentValue;
            }
          }
        }
      }

      // Format response
      const dashboardData = {
        stats: {
          activeChamasCount: chamas.length,
          totalContributions,
          activeInvestmentsCount,
          upcomingMeetingsCount: upcomingMeetings.length
        },
        chamas,
        recentActivities: recentTransactions.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          status: t.status,
          date: t.date,
          paymentMethod: t.paymentMethod,
          chamaId: t.chamaId,
          chamaName: chamas.find(c => c.id === t.chamaId)?.name
        })),
        upcomingSchedule,
        investmentSummary: {
          total: Object.values(investmentsByType).reduce((a, b) => a + b, 0),
          breakdown: investmentsByType
        }
      };

      res.json(dashboardData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}