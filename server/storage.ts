import { 
  users, type User, type InsertUser,
  chamas, type Chama, type InsertChama,
  chamaMembers, type ChamaMember, type InsertChamaMember,
  transactions, type Transaction, type InsertTransaction,
  meetings, type Meeting, type InsertMeeting,
  investments, type Investment, type InsertInvestment,
  notifications, type Notification, type InsertNotification
} from "@shared/schema";

// Storage interface with all CRUD operations needed
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Chama operations
  getChama(id: number): Promise<Chama | undefined>;
  getChamasByUserId(userId: number): Promise<Chama[]>;
  createChama(chama: InsertChama): Promise<Chama>;
  updateChama(id: number, chama: Partial<Chama>): Promise<Chama | undefined>;
  deleteChama(id: number): Promise<boolean>;
  
  // Chama Member operations
  getChamaMember(id: number): Promise<ChamaMember | undefined>;
  getChamaMembersByUserId(userId: number): Promise<ChamaMember[]>;
  getChamaMembersByChamaId(chamaId: number): Promise<ChamaMember[]>;
  createChamaMember(chamaMember: InsertChamaMember): Promise<ChamaMember>;
  updateChamaMember(id: number, chamaMember: Partial<ChamaMember>): Promise<ChamaMember | undefined>;
  deleteChamaMember(id: number): Promise<boolean>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getTransactionsByChamaId(chamaId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Meeting operations
  getMeeting(id: number): Promise<Meeting | undefined>;
  getMeetingsByChamaId(chamaId: number): Promise<Meeting[]>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meeting: Partial<Meeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: number): Promise<boolean>;
  
  // Investment operations
  getInvestment(id: number): Promise<Investment | undefined>;
  getInvestmentsByChamaId(chamaId: number): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: number, investment: Partial<Investment>): Promise<Investment | undefined>;
  deleteInvestment(id: number): Promise<boolean>;
  
  // Notification operations
  getNotification(id: number): Promise<Notification | undefined>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, notification: Partial<Notification>): Promise<Notification | undefined>;
  markNotificationAsRead(id: number): Promise<boolean>;
  deleteNotification(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chamas: Map<number, Chama>;
  private chamaMembers: Map<number, ChamaMember>;
  private transactions: Map<number, Transaction>;
  private meetings: Map<number, Meeting>;
  private investments: Map<number, Investment>;
  private notifications: Map<number, Notification>;
  private currentIds: {
    users: number;
    chamas: number;
    chamaMembers: number;
    transactions: number;
    meetings: number;
    investments: number;
    notifications: number;
  };

  constructor() {
    this.users = new Map();
    this.chamas = new Map();
    this.chamaMembers = new Map();
    this.transactions = new Map();
    this.meetings = new Map();
    this.investments = new Map();
    this.notifications = new Map();
    this.currentIds = {
      users: 1,
      chamas: 1,
      chamaMembers: 1,
      transactions: 1,
      meetings: 1,
      investments: 1,
      notifications: 1,
    };
    
    // Initialize with demo data
    this.initializeData();
  }

  // Initialize with demo data
  private initializeData() {
    // Create a demo user
    const user: InsertUser = {
      username: "johndoe",
      password: "password123", // In a real app, this would be hashed
      email: "johndoe@example.com",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+254712345678",
      preferredLanguage: "en",
    };
    const createdUser = this.createUser(user);
    
    // Create demo chamas
    const chama1: InsertChama = {
      name: "Umoja Investment Group",
      description: "A group focused on real estate investments in Kenya",
      foundedDate: new Date("2025-01-15"),
      regularContributionAmount: 5000,
      contributionFrequency: "monthly",
      ownerId: createdUser.id,
      totalValue: 1200000,
    };
    const createdChama1 = this.createChama(chama1);
    
    const chama2: InsertChama = {
      name: "Maendeleo Savings Club",
      description: "A savings club focusing on member loans and financial support",
      foundedDate: new Date("2025-03-10"),
      regularContributionAmount: 8000,
      contributionFrequency: "monthly",
      ownerId: createdUser.id,
      totalValue: 520000,
    };
    const createdChama2 = this.createChama(chama2);
    
    const chama3: InsertChama = {
      name: "Pamoja Real Estate Group",
      description: "Group focusing on property investments in Kenya",
      foundedDate: new Date("2025-01-05"),
      regularContributionAmount: 10000,
      contributionFrequency: "monthly",
      ownerId: createdUser.id,
      totalValue: 1500000,
    };
    const createdChama3 = this.createChama(chama3);
    
    // Add user as member to all chamas
    const member1: InsertChamaMember = {
      userId: createdUser.id,
      chamaId: createdChama1.id,
      role: "admin",
      joinedDate: new Date("2025-01-15"),
      totalContributed: 85000,
      isActive: true,
    };
    this.createChamaMember(member1);
    
    const member2: InsertChamaMember = {
      userId: createdUser.id,
      chamaId: createdChama2.id,
      role: "admin",
      joinedDate: new Date("2025-03-10"),
      totalContributed: 60000,
      isActive: true,
    };
    this.createChamaMember(member2);
    
    const member3: InsertChamaMember = {
      userId: createdUser.id,
      chamaId: createdChama3.id,
      role: "admin",
      joinedDate: new Date("2025-01-05"),
      totalContributed: 100000,
      isActive: true,
    };
    this.createChamaMember(member3);
    
    // Create demo transactions
    const transaction1: InsertTransaction = {
      chamaId: createdChama1.id,
      userId: createdUser.id,
      amount: 5000,
      type: "contribution",
      status: "completed",
      date: new Date(),
      paymentMethod: "mpesa",
      description: "Monthly contribution",
      referenceNumber: "MPESA123456",
    };
    this.createTransaction(transaction1);
    
    const transaction2: InsertTransaction = {
      chamaId: createdChama3.id,
      userId: createdUser.id,
      amount: 10000,
      type: "contribution",
      status: "completed",
      date: new Date("2025-03-02"),
      paymentMethod: "mpesa",
      description: "Monthly contribution",
      referenceNumber: "MPESA123457",
    };
    this.createTransaction(transaction2);
    
    const transaction3: InsertTransaction = {
      chamaId: createdChama2.id,
      userId: createdUser.id,
      amount: 15000,
      type: "loan",
      status: "completed",
      date: new Date("2025-03-05"),
      paymentMethod: "bank",
      description: "Loan disbursement",
      referenceNumber: "BANK123458",
    };
    this.createTransaction(transaction3);
    
    // Create demo meetings
    const meeting1: InsertMeeting = {
      chamaId: createdChama2.id,
      title: "August Monthly Meeting",
      date: new Date("2025-04-18T18:00:00"),
      location: "Zoom",
      isVirtual: true,
      meetingLink: "https://zoom.us/j/123456789",
      description: "Monthly financial review and planning",
      createdBy: createdUser.id,
    };
    this.createMeeting(meeting1);
    
    const meeting2: InsertMeeting = {
      chamaId: createdChama1.id,
      title: "Investment Review Meeting",
      date: new Date("2025-04-22T19:30:00"),
      location: "Google Meet",
      isVirtual: true,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      description: "Review of current investments and future opportunities",
      createdBy: createdUser.id,
    };
    this.createMeeting(meeting2);
    
    const meeting3: InsertMeeting = {
      chamaId: createdChama3.id,
      title: "Property Acquisition Discussion",
      date: new Date("2025-04-25T17:00:00"),
      location: "Zoom",
      isVirtual: true,
      meetingLink: "https://zoom.us/j/987654321",
      description: "Discussion on potential property acquisitions",
      createdBy: createdUser.id,
    };
    this.createMeeting(meeting3);
    
    // Create demo investments
    const investment1: InsertInvestment = {
      chamaId: createdChama3.id,
      name: "Commercial Property - Westlands",
      type: "real estate",
      amount: 800000,
      description: "Commercial property investment in Westlands area",
      startDate: new Date("2025-01-15"),
      expectedReturnRate: "12%",
      status: "active",
      currentValue: 864800, // 8.1% increase
    };
    this.createInvestment(investment1);
    
    const investment2: InsertInvestment = {
      chamaId: createdChama1.id,
      name: "Treasury Bonds",
      type: "bonds",
      amount: 300000,
      description: "Government treasury bonds",
      startDate: new Date("2025-02-10"),
      expectedReturnRate: "10.5%",
      status: "active",
      currentValue: 310500, // 3.5% increase
    };
    this.createInvestment(investment2);
    
    const investment3: InsertInvestment = {
      chamaId: createdChama1.id,
      name: "Equity Investment - Safaricom",
      type: "stocks",
      amount: 150000,
      description: "Investments in Safaricom shares",
      startDate: new Date("2025-03-20"),
      expectedReturnRate: "8%",
      status: "active",
      currentValue: 146850, // 2.1% decrease
    };
    this.createInvestment(investment3);
    
    // Create demo notifications
    const notification1: InsertNotification = {
      userId: createdUser.id,
      title: "Payment Reminder",
      message: "Your contribution of KES 8,000 to Maendeleo Savings Club is due today.",
      type: "payment",
      isRead: false,
      linkUrl: "/chamas/2",
    };
    this.createNotification(notification1);
    
    const notification2: InsertNotification = {
      userId: createdUser.id,
      title: "Upcoming Meeting",
      message: "You have a meeting for Maendeleo Savings Club on Aug 18, 2025 at 6:00 PM.",
      type: "meeting",
      isRead: false,
      linkUrl: "/meetings",
    };
    this.createNotification(notification2);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Chama operations
  async getChama(id: number): Promise<Chama | undefined> {
    return this.chamas.get(id);
  }
  
  async getChamasByUserId(userId: number): Promise<Chama[]> {
    const userChamaMembers = Array.from(this.chamaMembers.values()).filter(
      (member) => member.userId === userId && member.isActive
    );
    
    return userChamaMembers.map(
      (member) => this.chamas.get(member.chamaId)!
    ).filter(Boolean);
  }
  
  async createChama(insertChama: InsertChama): Promise<Chama> {
    const id = this.currentIds.chamas++;
    const chama: Chama = { ...insertChama, id };
    this.chamas.set(id, chama);
    return chama;
  }
  
  async updateChama(id: number, chamaData: Partial<Chama>): Promise<Chama | undefined> {
    const existingChama = await this.getChama(id);
    if (!existingChama) return undefined;
    
    const updatedChama = { ...existingChama, ...chamaData };
    this.chamas.set(id, updatedChama);
    return updatedChama;
  }
  
  async deleteChama(id: number): Promise<boolean> {
    return this.chamas.delete(id);
  }
  
  // Chama Member operations
  async getChamaMember(id: number): Promise<ChamaMember | undefined> {
    return this.chamaMembers.get(id);
  }
  
  async getChamaMembersByUserId(userId: number): Promise<ChamaMember[]> {
    return Array.from(this.chamaMembers.values()).filter(
      (member) => member.userId === userId
    );
  }
  
  async getChamaMembersByChamaId(chamaId: number): Promise<ChamaMember[]> {
    return Array.from(this.chamaMembers.values()).filter(
      (member) => member.chamaId === chamaId
    );
  }
  
  async createChamaMember(insertChamaMember: InsertChamaMember): Promise<ChamaMember> {
    const id = this.currentIds.chamaMembers++;
    const chamaMember: ChamaMember = { ...insertChamaMember, id };
    this.chamaMembers.set(id, chamaMember);
    return chamaMember;
  }
  
  async updateChamaMember(id: number, chamaMemberData: Partial<ChamaMember>): Promise<ChamaMember | undefined> {
    const existingMember = await this.getChamaMember(id);
    if (!existingMember) return undefined;
    
    const updatedMember = { ...existingMember, ...chamaMemberData };
    this.chamaMembers.set(id, updatedMember);
    return updatedMember;
  }
  
  async deleteChamaMember(id: number): Promise<boolean> {
    return this.chamaMembers.delete(id);
  }
  
  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }
  
  async getTransactionsByChamaId(chamaId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.chamaId === chamaId
    );
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentIds.transactions++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined> {
    const existingTransaction = await this.getTransaction(id);
    if (!existingTransaction) return undefined;
    
    const updatedTransaction = { ...existingTransaction, ...transactionData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  // Meeting operations
  async getMeeting(id: number): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }
  
  async getMeetingsByChamaId(chamaId: number): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter(
      (meeting) => meeting.chamaId === chamaId
    );
  }
  
  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = this.currentIds.meetings++;
    const meeting: Meeting = { ...insertMeeting, id };
    this.meetings.set(id, meeting);
    return meeting;
  }
  
  async updateMeeting(id: number, meetingData: Partial<Meeting>): Promise<Meeting | undefined> {
    const existingMeeting = await this.getMeeting(id);
    if (!existingMeeting) return undefined;
    
    const updatedMeeting = { ...existingMeeting, ...meetingData };
    this.meetings.set(id, updatedMeeting);
    return updatedMeeting;
  }
  
  async deleteMeeting(id: number): Promise<boolean> {
    return this.meetings.delete(id);
  }
  
  // Investment operations
  async getInvestment(id: number): Promise<Investment | undefined> {
    return this.investments.get(id);
  }
  
  async getInvestmentsByChamaId(chamaId: number): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      (investment) => investment.chamaId === chamaId
    );
  }
  
  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = this.currentIds.investments++;
    const investment: Investment = { ...insertInvestment, id };
    this.investments.set(id, investment);
    return investment;
  }
  
  async updateInvestment(id: number, investmentData: Partial<Investment>): Promise<Investment | undefined> {
    const existingInvestment = await this.getInvestment(id);
    if (!existingInvestment) return undefined;
    
    const updatedInvestment = { ...existingInvestment, ...investmentData };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }
  
  async deleteInvestment(id: number): Promise<boolean> {
    return this.investments.delete(id);
  }
  
  // Notification operations
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }
  
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId
    );
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentIds.notifications++;
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      createdAt: new Date() 
    };
    this.notifications.set(id, notification);
    return notification;
  }
  
  async updateNotification(id: number, notificationData: Partial<Notification>): Promise<Notification | undefined> {
    const existingNotification = await this.getNotification(id);
    if (!existingNotification) return undefined;
    
    const updatedNotification = { ...existingNotification, ...notificationData };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = await this.getNotification(id);
    if (!notification) return false;
    
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }
  
  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }
}

export const storage = new MemStorage();
