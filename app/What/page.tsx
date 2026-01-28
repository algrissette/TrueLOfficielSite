"use client";

import { api } from "@/app/util/apicCall";
import { ProductNode } from "@/app/util/datatypes";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import CategorySideBar from "@/components/What/categorySideBar";
import ProductGrid from "@/components/What/productGrid";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function What() {
  const [products, setProducts] = useState<ProductNode[]>([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams.toString());

    const fetchProducts = async () => {
      try {
        const { data } = await api.get<ProductNode[]>("/products/getAllProducts");

        // Build filters from query
        const filters: Record<string, string[]> = {};
        urlParams.forEach((value, key) => {
          if (!filters[key]) filters[key] = [];
          filters[key].push(value);
        });

        const filtered = data.filter((product) => {
          return Object.entries(filters).every(([optionName, allowedValues]) => {
            const productOption = product.options.find(o => o.name === optionName);
            if (!productOption) return false;
            return productOption.values.some(v => allowedValues.includes(v));
          });
        }); //make a dictionary of url param keys and check if the the dictionary key matches product option name
        //if product option name is in the dictionary then check if the product values is in the dictionary values. if it is then add the product to the filter 

        setProducts(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <div className="bg-black">
      <NavBar font="sans" color="#ffffff" />
      <CategorySideBar />
      <ProductGrid
        products={products} />
      <Footer />
    </div>
  );
}
