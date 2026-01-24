import { Request, Response } from "express";
import dotenv from "dotenv";
import { gql } from "../util/gql";
dotenv.config();

// ===== Shared Types =====
export type MoneyV2 = {
  amount: string
  currencyCode: string
}

export type Attribute = { key: string; value: string }

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: MoneyV2
  compareAtPrice: MoneyV2 | null
  image: { id: string; altText: string | null; url: string } | null
}

export type CartLine = {
  id: string
  quantity: number
  attributes: Attribute[]
  cost: { totalAmount: MoneyV2 }
  merchandise: ProductVariant
}

export type CartLineEdge = { cursor: string; node: CartLine }
export type CartLines = { edges: CartLineEdge[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }

export type CartCost = {
  totalAmount: MoneyV2
  subtotalAmount: MoneyV2
  totalTaxAmount: MoneyV2 | null
  totalDutyAmount: MoneyV2 | null
}

export type Cart = {
  id: string
  checkoutUrl: string
  createdAt: string
  attributes: Attribute[]
  cost: CartCost
  lines: CartLines
}

export type GetCartResponse = { data: { cart: Cart | null } }

export type GetCartVariables = { input: string; cursor?: string | null }

export type CartLineUpdate = { id: string; quantity: number }
export type UpdateCartInput = { cartId: string; lines: CartLineUpdate[] }


const STOREFRONT_URL = process.env.GRAPHQL_API_URL!
const STOREFRONT_TOKEN = process.env.STOREFRONT_PUBLIC_API_URL!

// ===== Create Cart =====
export const createCart = async (req: Request, res: Response) => {
  const input = req.body
  console.log(input)

  try {
    const result = await fetch(process.env.GRAPHQL_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.STOREFRONT_PUBLIC_API_URL!,
      },
      body: JSON.stringify({
        query: `mutation cartCreate($input: CartInput!) {
            cartCreate(input: $input) {
              cart {
                id
                createdAt
                updatedAt
                checkoutUrl
                attributes { key value }
                cost { 
                  totalAmount { amount currencyCode }
                  subtotalAmount { amount currencyCode }
                  totalTaxAmount { amount currencyCode }
                  totalDutyAmount { amount currencyCode }
                }
                lines(first: 100) {
                  edges { cursor node { id quantity merchandise { ... on ProductVariant { id title availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } image { id altText url } } } } }
                  pageInfo { hasNextPage endCursor }
                }
              }
              userErrors { field message }
              warnings { code message }
            }
          }`,
        variables: input,
      }),
    })

    const data = await result.json()
    console.log("it worked")
    console.log(data)
    res.status(200).json({ data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create cart", details: err })
  }
}

// ===== Add Lines to Cart =====
export const addToCart = async (req: Request, res: Response) => {
  const { cartId, lines } = req.body

  try {
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            createdAt
            attributes { key value }
            cost { 
              totalAmount { amount currencyCode }
              subtotalAmount { amount currencyCode }
              totalTaxAmount { amount currencyCode }
              totalDutyAmount { amount currencyCode }
            }
            lines(first: 100) {
              edges { cursor node { id quantity merchandise { ... on ProductVariant { id title availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } image { id altText url } } } } }
              pageInfo { hasNextPage endCursor }
            }
          }
          userErrors { field message }
          warnings { code message }
        }
      }
    `

    const result = await fetch(STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables: { cartId, lines } }),
    })

    const data = await result.json()
    res.status(200).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to add items", details: err })
  }
}

// ===== Update Cart Lines =====
export const changeCart = async (req: Request, res: Response) => {
  const { cartId, lines } = req.body as UpdateCartInput

  try {
    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            lines(first: 100) {
              edges { cursor node { id quantity merchandise { ... on ProductVariant { id title availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } image { id altText url } } } } }
              pageInfo { hasNextPage endCursor }
            }
            cost { totalAmount { amount currencyCode } }
            attributes { key value }
          }
          userErrors { field message }
          warnings { code message }
        }
      }
    `

    const result = await fetch(STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables: { cartId, lines } }),
    })

    const data = await result.json()
    res.status(200).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to update cart", details: err })
  }
}

// ===== Fetch All Cart Lines (with pagination) =====
export const getAllCartItems = async (req: Request, res: Response) => {
  const { cartId } = req.body

  try {
    const query = `
      query getCart($input: ID!, $cursor: String) {
        cart(id: $input) {
          id
          checkoutUrl
          createdAt
          attributes { key value }
          cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } totalTaxAmount { amount currencyCode } totalDutyAmount { amount currencyCode } }
          lines(first: 100, after: $cursor) {
            edges { cursor node { id quantity attributes { key value } cost { totalAmount { amount currencyCode } } merchandise { ... on ProductVariant { id title availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } image { id altText url } } } } }
            pageInfo { hasNextPage endCursor }
          }
        }
      }
    `

    let all: CartLine[] = []
    let cursor: string | null = null
    let more = true

    while (more) {
      const variables: GetCartVariables = { input: cartId, cursor }

      const result = await fetch(STOREFRONT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
      })

      const data = (await result.json()) as GetCartResponse

      if (!data.data.cart) return res.status(200).json({ message: "No cart found" })

      all.push(...data.data.cart.lines.edges.map(e => e.node))
      more = data.data.cart.lines.pageInfo.hasNextPage
      cursor = data.data.cart.lines.pageInfo.endCursor
    }

    res.status(200).json(all)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch cart items", details: err })
  }
}
