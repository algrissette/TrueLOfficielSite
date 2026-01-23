import { Request, Response } from "express";
import dotenv from "dotenv";
import { gql } from "../util/gql";
import fetch from "node-fetch";

dotenv.config();



type ProductOption = {
  name: string;        
  values: string[];    
};

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  options: ProductOption[]; 
};

type ProductEdge = { cursor: string; node: ProductNode };
type PageInfo = { hasNextPage: boolean; endCursor: string | null };
type ProductsConnection = { edges: ProductEdge[]; pageInfo: PageInfo };
type GetAllProductsResponse = { data: { products: ProductsConnection } };


export const getTenProducts = async (req: Request, res: Response) => {
  if (!process.env.GRAPHQL_API_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Missing .env credentials" });
  }

  try {
    const query = gql`
      query get10 {
        products(first: 10) {
          nodes {
            title
          }
        }
      }
    `;

    const result = await fetch(process.env.GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const data = (await result.json()) as { data: { products: { nodes: { title: string }[] } } };
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Full fetch with product options included
export const getAllProducts = async (req: Request, res: Response) => {
  if (!process.env.GRAPHQL_API_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Missing .env credentials" });
  }

  try {
    let all: ProductNode[] = [];
    let cursor: string | null = null;
    let more = true;

    const query = gql`
      query getAll($cursor: String) {
        products(first: 100, after: $cursor) {
          edges {
            cursor
            node {
              id
              title
              handle
              status
              createdAt
              updatedAt
              options {
                name
                values
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    while (more) {
      const variables = cursor ? { cursor } : {};

      const result = await fetch(process.env.GRAPHQL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
      });

      const data = (await result.json()) as GetAllProductsResponse;

      all.push(...data.data.products.edges.map(e => e.node));
      more = data.data.products.pageInfo.hasNextPage;
      cursor = data.data.products.pageInfo.endCursor;
    }

    return res.status(200).json(all);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};
