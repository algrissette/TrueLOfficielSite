import { Request, Response } from "express";
import dotenv from "dotenv";
import { gql } from "../util/gql";

dotenv.config();

type GraphQLResponse = {
  data: {
    products: {
      nodes: {
        title: string;
      }[];
    };
  };
};

const getProducts = async (): Promise<GraphQLResponse> => {
  if (!process.env.GRAPHQL_API_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
    throw new Error("Missing Shopify environment variables");
  }

  const res = await fetch(process.env.GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: gql`
        query ProductsQuery {
          products(first: 6) {
            nodes {
              title
            }
          }
        }
      `,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify error ${res.status}: ${text}`);
  }

  return res.json();
};

export const getFirstSix = async (req: Request, res: Response) => {
  try {
    const shopifyResponse = await getProducts();

    // ✅ return only what the client needs
    const products = shopifyResponse.data.products.nodes;

    return res.status(200).json(products);
  } catch (err) {
    console.error("Error getting products:", err);
    return res.status(500).json({ error: "error getting products" });
  }
};
