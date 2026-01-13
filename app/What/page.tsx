
'use client';
import axios from "axios";
import { useEffect, useState } from "react";

export default function What() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const api = axios.create({
    baseURL: "http://localhost:4000", // your backend URL
    withCredentials: true, // send/receive cookies
  });

const checkAuth = async () => {
  try {
    const response = await fetch("http://localhost:4000/protected/check", {
      method: "GET",
      credentials: "include", // <-- send/receive cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Auth check failed:", response.statusText);
      setIsAuthenticated(false);
      return;
    }

    const data = await response.json();
    setIsAuthenticated(data.authenticated); // make sure backend returns { authenticated: true/false }

  } catch (err) {
    console.error("Auth check error:", err);
    setIsAuthenticated(false);
  }
};

  // Example: check auth when component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      {isAuthenticated === null && <p>Checking auth...</p>}
      {isAuthenticated === true && <p>User is authenticated ✅</p>}
      {isAuthenticated === false && <p>User is not authenticated ❌</p>}
    </div>
  );
}
