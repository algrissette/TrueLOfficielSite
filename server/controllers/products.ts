import { Request, Response } from "express";
import dotenv from "dotenv";
import { gql } from "../util/gql";
import fetch from "node-fetch";
import { ProductLite, ProductNode, Products, QuickSearchProducts, VariantNode } from "../util/datatypes";

dotenv.config();






export const getTenProducts = async (req: Request, res: Response) => {
  if (!process.env.GRAPHQL_ADMIN_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
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

    const result = await fetch(process.env.GRAPHQL_ADMIN_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = (await result.json()) as { data: { products: QuickSearchProducts } };
    console.log(data)
    res.json(data.products.nodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductBYId = async (req: Request, res: Response) => {
  const { id } = req.body; // ✅ body IS the id

  if (!process.env.GRAPHQL_ADMIN_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Missing .env credentials" });
  }

  try {
    const query = `
      query GetProduct($id: ID!) {
        product(id: $id) {
          id
          title
          description
          variants(first: 10) {
            nodes {
              id
              title
              image {
                url(transform: { maxWidth: 800, maxHeight: 800 })
                altText
              }
                selectedOptions{
                name 
                value}
            }
          }
        }
      }
    `;



    const response = await fetch(process.env.GRAPHQL_ADMIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query,
        variables: { id } // ✅ STILL { id }
      })
    });

    const { data } = (await response.json()) as { data: { product: ProductLite } }
    console.log()
    return res.json(data.product);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch product" });
  }
};


export const getProductVariantById = async (req: Request, res: Response) => {
  const { id } = req.body;
  console.log("ayo")

  if (!process.env.GRAPHQL_ADMIN_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Missing .env credentials" });
  }

  try {
    const query = `
query GetProductVariant($id: ID!) {
  productVariant(id: $id) {
   
    id
    title
    availableForSale
    barcode
    price           # scalar string
    compareAtPrice  # scalar string
    createdAt


    selectedOptions {
      name
      value
    }
    image {
      url(transform: { maxWidth: 800, maxHeight: 800 })
      altText
    }
         product {
                id
                title
              }
  }
}

`;


    const response = await fetch(process.env.GRAPHQL_ADMIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query,
        variables: { id }
      })
    });

    const { data } = await response.json() as { data: { productVariant: VariantNode } }

    // optional safety check
    if (!data) {
      return res.status(404).json({ error: "Variant not found" });
    }
    console.log("my log", data.productVariant)
    return res.json(data.productVariant);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch variant" });
  }
};


// Full fetch with product options included
export const getAllProducts = async (req: Request, res: Response) => {
  if (!process.env.GRAPHQL_ADMIN_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
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
        variants(first: 10) {
          edges {
            node{
            id 
            image{
            url (transform: { maxWidth: 800, maxHeight: 800 })
            altText}
            }
          }
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

      const result = await fetch(process.env.GRAPHQL_ADMIN_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
      });

      const { data } = (await result.json()) as { data: { products: Products } };

      all.push(...data.products.edges.map(e => e.node));
      more = data.products.pageInfo.hasNextPage;
      cursor = data.products.pageInfo.endCursor;
    }

    return res.status(200).json(all);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};
