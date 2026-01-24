'use client'

import { useEffect, useState } from "react"
import axios from "axios"


type ProductOption = {
  name: string;
  values: string[];
};

type ProductVariantNode = {
  id: string;
  title: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

type ProductVariantEdge = {
  node: ProductVariantNode;
};

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  options: ProductOption[];
  variants: {
    edges: ProductVariantEdge[];
  };
};

type ProductEdge = {
  cursor: string;
  node: ProductNode;
};

type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

type ProductsConnection = {
  edges: ProductEdge[];
  pageInfo: PageInfo;
};

type GetAllProductsResponse = {
  data: {
    products: ProductsConnection;
  };
};

// ===== Money =====
export type Money = {
  amount: string;
  currencyCode: string;
};

// ===== Cart Line Variant =====
export type CartLineVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  image: {
    id: string;
    altText: string | null;
    url: string;
  } | null;
};

// ===== Cart Line =====
export type CartLineItem = {
  id: string;                  // line ID
  quantity: number;
  merchandise: CartLineVariant; // the variant
  cost: {
    totalAmount: Money;
  };
  attributes?: { key: string; value: string }[];
};

// ===== Cart State =====
export type CartState = CartLineItem[];

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
})

export default function What() {
  const [products, setProducts] = useState<ProductNode[]>([])
  const [cart, setCart] = useState<CartState>([])


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products/getAllProducts")
        console.log(data)

        setProducts(data) // 👈 depends on your API shape
      } catch (err) {
        console.error(err)
      }
    }

    fetchProducts()
  }, [])


  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault()
    const cartID = sessionStorage.getItem("cartID")

    try {
      if (products.length == 0) {
        return;
      }

      const product = products[index];
      if (!cartID) {
        const { data } = await api.post("cart/createCart", {
          input: {
            lines: [
              {
                merchandiseId: product.variants.edges[0].node.id,
                quantity: 1

              }
            ]
          }
        });
        console.log(data)
        sessionStorage.setItem("cartID", data.data.data.cartCreate.cart.id)
        fetchCart()
      }
      else {

        console.log(cartID)
        const { data } = await api.post("/cart/addToCart", {
          cartId: cartID,
          lines: [
            {
              merchandiseId: product.variants.edges[0].node.id,
              quantity: 1
            }
          ]
        });;

        console.log(data)
        fetchCart()
      }



    } catch (err) {
      console.error(err)
    }

  };

  const fetchCart = async () => {
    const cartID = sessionStorage.getItem("cartID")

    try {
      const { data } = await api.post("/cart/getAllCartItems",
        { cartId: cartID }
      )
      console.log(data)

      setCart(data) // 👈 depends on your API shape
    } catch (err) {
      console.error(err)
    }
  }


  const handleGetCart = async (e: React.MouseEvent<HTMLButtonElement>) => {


    await fetchCart()
  }

  return (
    <div>
      {/* Products Section */}
      <h2>Products</h2>
      {products.map((p, i) => (
        <div key={i}>
          {p.title}
          <button onClick={(event) => handleAddToCart(event, i)}>
            Add To cart
          </button>
        </div>
      ))}

      {/* Cart Section */}
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((line, i) => {
          // Find the product that contains this variant
          const product = products.find(p =>
            p.variants.edges.some(v => v.node.id === line.merchandise.id)
          );

          return (
            <div key={i}>
              <strong>{product ? product.title : line.merchandise.title}</strong> × {line.quantity} —{" "}
              {line.cost.totalAmount.amount} {line.cost.totalAmount.currencyCode}
            </div>
          );
        })
      )}

      {/* Fetch / Display Cart Button */}
      <button onClick={handleGetCart}>Display Cart</button>
    </div>
  );


}
