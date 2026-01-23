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


  useEffect(() => {
    const init = async () => {
       await checkAuth();
    };

    init();
    console.log(isAuthenticated)
  }, []);


  return (
   <div> </div>
  );
}
