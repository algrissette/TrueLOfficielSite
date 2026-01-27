"use client";

import { api } from "@/app/util/apicCall";
import { ProductLite, ProductNode, VariantNode } from "@/app/util/datatypes";
import NavBar from "@/components/navbar/navbar";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItemPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const rawProductId = searchParams.get("productId");
    const rawVariantId = searchParams.get("variantId");

    // Decode numeric IDs from URL
    const productId = rawProductId ? decodeURIComponent(rawProductId) : null;
    const variantId = rawVariantId ? decodeURIComponent(rawVariantId).split("/").pop() : null;

    const [variant, setVariant] = useState<VariantNode | null>(null);
    const [product, setProduct] = useState<ProductLite>()

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!variantId || !rawProductId) return;

        const fullVariantId = `gid://shopify/ProductVariant/${variantId}`;
        const fullProductId = `gid://shopify/Product/${rawProductId}`;

        const fetchParentProduct = async () => {
            setLoading(true);
            try {
                const res = await api.post("/products/getProductById", { id: fullProductId });
                const data = res.data as ProductLite
                console.log(data)
                setProduct(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch parent product");
            } finally {
                setLoading(false);
            }
        };

        const fetchVariant = async () => {
            setLoading(true);
            try {
                const res = await api.post("/products/getProductVariantById", { id: fullVariantId });
                const data = res.data as VariantNode
                console.log(data)

                setVariant(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch variant");
                setVariant(null);
            } finally {
                setLoading(false);
            }
        };

        // Call both
        fetchParentProduct();
        fetchVariant();
    }, [variantId, rawProductId]);


    return (

        <h1 className="w-full h-48 bg-red-200">
            Hdghsfsftghello
        </h1>

    )

}
