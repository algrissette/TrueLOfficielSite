import { Router, Request, Response } from "express";
import fetch from "node-fetch"; // or global fetch in Node 20+
import dotenv from "dotenv";

dotenv.config();

//get the shopify access token from the constructed link from the shopify docs 

interface ShopifyAccessTokenResponse {
  access_token: string;
  scope: string;
}

const router = Router();

router.get("/callback", async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const shop = req.query.shop as string;

    if (!code || !shop) {
      return res.status(400).send("Missing code or shop parameter");
    }

    if (!process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) {
      return res.status(500).send("Missing Shopify client credentials in .env");
    }

    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code: code,
      }),
    });

    // Parse JSON safely
    const data = (await response.json()) as Partial<ShopifyAccessTokenResponse>;

    if (!data.access_token) {
      return res.status(400).json({ error: "Failed to get access token", details: data });
    }

    // Now TS knows access_token exists
    const accessToken: string = data.access_token;

    res.json({ accessToken, shop });
  } catch (err: unknown) {
    console.error("Shopify callback error:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

export default router;
