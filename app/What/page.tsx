'use client';
import axios from "axios";
import { useEffect, useState } from "react";

type Product = {
  title: string;
};

export default function What() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
  });

  const checkAuth = async (): Promise<boolean> => {
    try {
      const { data } = await api.get("/protected/check");
      setIsAuthenticated(data.authenticated);
      return data.authenticated;
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
      return false;
    }
  };

  const getFirstSix = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get<Product[]>("/products/firstSix"); // ✅ CORRECT
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const authed = await checkAuth();
      if (!authed) {
        await getFirstSix();
      }
    };

    init();
  }, []);

  return (
    <div>
      {isAuthenticated === null && <p>Checking auth...</p>}

      {isAuthenticated === true && <p>User is authenticated ✅</p>}

      {isAuthenticated === false && (
        <>
          <p>User is not authenticated ❌</p>

          {loadingProducts && <p>Loading products...</p>}

          {!loadingProducts && (
            <ul>
              {products.map((product) => (
                <li key={product.title}>{product.title}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
