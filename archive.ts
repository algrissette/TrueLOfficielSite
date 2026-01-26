/*
'use client'

import React, { useState, useEffect } from "react"
import axios from "axios"
import { CartLine, ProductNode, Products } from "../util/datatypes"

// ===== Axios instance =====
const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
})

export default function What() {
  // ===== State =====
  const [products, setProducts] = useState<ProductNode[]>([])
  const [cart, setCart] = useState<CartLine[]>([])

  // ===== Fetch Products =====
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products/getAllProducts")
        console.log(data)
        // Map edges -> nodes
        setProducts(data)

      } catch (err) {
        console.error(err)
      }
    }
    fetchProducts()
  }, [])

  // ===== Fetch Cart Lines =====
  const fetchCart = async () => {
    const cartID = sessionStorage.getItem("cartID")
    if (!cartID) return

    try {
      // backend returns CartLine[]
      const { data } = await api.post<CartLine[]>("/cart/getAllCartItems", { cartId: cartID })
      setCart(data)
    } catch (err) {
      console.error(err)
    }
  }

  // ===== Add to Cart =====
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault()
    if (products.length === 0) return

    const product = products[index]
    const variantId = product.variants.edges[0]?.node.id
    if (!variantId) return

    const cartID = sessionStorage.getItem("cartID")

    try {
      if (!cartID) {
        const { data } = await api.post("/cart/createCart", {
          input: { lines: [{ merchandiseId: variantId, quantity: 1 }] },
        })
        const newCartID = data.data.cartCreate.cart.id
        sessionStorage.setItem("cartID", newCartID)
        fetchCart()
      } else {
        await api.post("/cart/addToCart", {
          cartId: cartID,
          lines: [{ merchandiseId: variantId, quantity: 1 }],
        })
        fetchCart()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // ===== Display Cart =====
  const handleGetCart = async () => {
    await fetchCart()
  }

  return (
    <div>
      {/* Products Section 
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((p, i) => (
          <div key={p.id}>
            {p.title}{" "}
            <button onClick={(e) => handleAddToCart(e, i)}>Add To Cart</button>
          </div>
        ))
      )}

      {/* Cart Section 
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((line) => {
          // Find product title from product list if needed
          const product = products.find((p) =>
            p.variants.edges.some((v) => v.node.id === line.merchandise.id)
          )

          return (
            <div key={line.id}>
              <strong>{product ? product.title : line.merchandise.title}</strong> ×{" "}
              {line.quantity} — {line.merchandise.price.amount}{" "}
              {line.merchandise.price.amount}
            </div>
          )
        })
      )}

      {/* Fetch / Display Cart Button 
      <button onClick={handleGetCart}>Display Cart</button>
    </div>
    
  )
  
}


*/
