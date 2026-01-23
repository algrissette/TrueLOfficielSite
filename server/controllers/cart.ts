import { Request, Response } from "express";
import dotenv from "dotenv";
import { gql } from "../util/gql";

dotenv.config();


type CartLineUpdate = {
  id: string;       // cart line ID
  quantity: number; // new quantity
};

type UpdateCartInput = {
  cartId: string;
  lines: CartLineUpdate[];
};


export const createCart = async (req: Request, res: Response) => {
  const input = req.body

  if (!process.env.GRAPHQL_API_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
    return res
      .status(500)
      .json({ error: "Missing either access token or correct GraphQL Url" })
  }

  try {
    const result = await fetch(process.env.GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: gql`
          mutation cartCreate($input: CartInput!) {
            cartCreate(input: $input) {
              cart {
                id
                createdAt
                updatedAt
                lines(first: 10) {
                  edges {
                    node {
                      id
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalTaxAmount {
                    amount
                    currencyCode
                  }
                  totalDutyAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        `,
        variables: { input },
      }),
    })

    const data = await result.json()
    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to create cart" })
  }
}

export const addToCart = async (req: Request, res: Response) => {
  const { cartId, lines } = req.body;

  if (!process.env.GRAPHQL_API_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
    return res
      .status(500)
      .json({ error: "Missing either access token or correct GraphQL Url" });
  }

  try {
    const query = gql`
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            createdAt
            updatedAt
            lines(first: 10) {
              edges {
                node {
                  id
                  merchandise {
                    ... on ProductVariant {
                      id
                    }
                  }
                }
              }
            }
            attributes {
              key
              value
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
              totalTaxAmount {
                amount
                currencyCode
              }
              totalDutyAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
          warnings {
            message
            code
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
      body: JSON.stringify({ query, variables: { cartId, lines } }),
    });

    const data = await result.json();
    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const changeCart = async (req: Request, res: Response) => {
  const { cartId, lines } = req.body as UpdateCartInput;

  if (!process.env.GRAPHQL_API_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
    return res.status(500).json({
      error: "Missing either access token or correct GraphQL Url",
    });
  }

  try {
    const query = gql`
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
          warnings {
            message
            code
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
      body: JSON.stringify({ query, variables: { cartId, lines } }),
    });

    const data = await result.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart" });
  }
};



/* editing the cart 




export const addToCart = async (req:Request, res: Response) =>{
     const input = req.body

  if (!process.env.GRAPHQL_API_URL || !process.env.ADMIN_API_ACCESS_TOKEN) {
    return res
      .status(500)
      .json({ error: "Missing either access token or correct GraphQL Url" })
  }

  try {
    const result = await fetch(process.env.GRAPHQL_API_URL, {
    }
    )
}
catch {

}
}


*/