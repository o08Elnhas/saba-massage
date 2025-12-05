import { 
  users, 
  offers, 
  siteSettings,
  type User, 
  type UpsertUser,
  type Offer,
  type InsertOffer,
  type SiteSetting,
  type InsertSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Offer operations
  getOffers(): Promise<Offer[]>;
  getOffer(id: number): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  updateOffer(id: number, offer: Partial<InsertOffer>): Promise<Offer | undefined>;
  deleteOffer(id: number): Promise<boolean>;
  toggleOfferActive(id: number, isActive: boolean): Promise<Offer | undefined>;
  
  // Settings operations
  getSettings(): Promise<SiteSetting[]>;
  getSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSetting(setting: InsertSetting): Promise<SiteSetting>;
  bulkUpsertSettings(settings: InsertSetting[]): Promise<SiteSetting[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Check if this is the first user (make them admin)
    // *** تم تصحيح الخطأ هنا بإضافة علامة ! ***
    const [existingUser] = await db.select().from(users).where(eq(users.id, userData.id!));
    
    if (existingUser) {
      // Update existing user (don't change isAdmin status)
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        // *** وتم تصحيح الخطأ هنا بإضافة علامة ! ***
        .where(eq(users.id, userData.id!))
        .returning();
      return user;
    }
    
    // Check if there are any users in the database
    const [countResult] = await db.select({ value: count() }).from(users);
    const isFirstUser = countResult.value === 0;
    
    // Insert new user (first user becomes admin)
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        isAdmin: isFirstUser,
      })
      .returning();
    return user;
  }

  // Offer operations
  async getOffers(): Promise<Offer[]> {
    return await db.select().from(offers).orderBy(asc(offers.sortOrder));
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer;
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const [newOffer] = await db.insert(offers).values(offer).returning();
    return newOffer;
  }

  async updateOffer(id: number, offer: Partial<InsertOffer>): Promise<Offer | undefined> {
    const [updated] = await db
      .update(offers)
      .set({ ...offer, updatedAt: new Date() })
      .where(eq(offers.id, id))
      .returning();
    return updated;
  }

  async deleteOffer(id: number): Promise<boolean> {
    const result = await db.delete(offers).where(eq(offers.id, id)).returning();
    return result.length > 0;
  }

  async toggleOfferActive(id: number, isActive: boolean): Promise<Offer | undefined> {
    const [updated] = await db
      .update(offers)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(offers.id, id))
      .returning();
    return updated;
  }

  // Settings operations
  async getSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async upsertSetting(setting: InsertSetting): Promise<SiteSetting> {
    const [result] = await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          value: setting.value,
          label: setting.label,
          type: setting.type,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async bulkUpsertSettings(settings: InsertSetting[]): Promise<SiteSetting[]> {
    const results: SiteSetting[] = [];
    for (const setting of settings) {
      const result = await this.upsertSetting(setting);
      results.push(result);
    }
    return results;
  }
}

export const storage = new DatabaseStorage();