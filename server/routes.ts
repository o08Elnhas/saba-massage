import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// ❌ حذفنا Replit Auth بالكامل
// import { setupAuth, isAuthenticated } from "./replitAuth";

import { insertOfferSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {

  // ❌ حذفنا setupAuth لأنها سبب الخطأ
  // await setupAuth(app);

  // Auth route (نعيدها ثابتة بدون Replit Auth)
  app.get('/api/auth/user', async (req: any, res) => {
    return res.json(null); // لا يوجد تسجيل دخول
  });

  // ========== OFFERS API ==========

  // Get all offers (public)
  app.get("/api/offers", async (req, res) => {
    try {
      const offers = await storage.getOffers();
      res.json(offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  // Get single offer (public)
  app.get("/api/offers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid offer ID" });
      }
      const offer = await storage.getOffer(id);
      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      res.json(offer);
    } catch (error) {
      console.error("Error fetching offer:", error);
      res.status(500).json({ message: "Failed to fetch offer" });
    }
  });

  // Create offer (PUBLIC مؤقتًا – يمكنك إضافة حماية لاحقًا)
  app.post("/api/offers", async (req: any, res) => {
    try {
      const validatedData = insertOfferSchema.parse(req.body);
      const offer = await storage.createOffer(validatedData);
      res.status(201).json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating offer:", error);
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}