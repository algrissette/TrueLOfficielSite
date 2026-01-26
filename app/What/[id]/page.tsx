"use client";

import { api } from "@/app/util/apicCall";
import { ProductNode } from "@/app/util/datatypes";
import NavBar from "@/components/navbar/navbar";
import CategorySideBar from "@/components/What/categorySideBar";
import ProductGrid from "@/components/What/productGrid";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function What() {
    const [products, setProducts] = useState<ProductNode[]>([]);

    const searchParams = useSearchParams();

    useEffect(() => {
        console.log("lalalalallala")

        const urlParams = new URLSearchParams(searchParams.toString());

        const fetchProducts = async () => {
            try {
                const { data } = await api.get<ProductNode[]>("/products/getAllProducts");

                const filtered = data.filter((product) =>
                    product.options.some((option) => {
                        const paramValues = urlParams.getAll(option.name);
                        // if no param, include everything
                        if (paramValues.length === 0) return true;
                        return option.values.some((value) => paramValues.includes(value));
                    })
                );
                console.log("lalalalallala", filtered)

                setProducts(filtered);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, [searchParams]);

    return (
        <div>
            <NavBar font="sans" color="#ffffff" />
            <h1>Helloo</h1>
            <CategorySideBar />
            <ProductGrid
                products={products} />
        </div>
    );
}
