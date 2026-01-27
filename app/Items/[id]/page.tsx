"use client";

import { api } from "@/app/util/apicCall";
import { ProductLite, ProductNode, VariantNode } from "@/app/util/datatypes";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Variant = {
    id: string;
    title: string;
    availableForSale: boolean;
    barcode?: string;
    compareAtPrice?: string; // Admin API scalar
    image?: {
        url: string;
        altText?: string;
    };
};

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
        <div className="p-8">
            <h1 className="text-xl font-bold mb-2">Dynamic Item Page</h1>

            <p>
                Folder ID segment: <strong>{params.id}</strong>
            </p>

            {productId ? (
                <p className="mt-2">
                    Parent Product ID: <strong>{productId}</strong>
                </p>
            ) : (
                <p className="text-red-500 mt-2">No Parent Product ID found</p>
            )}

            {variantId ? (
                <p className="mt-2">
                    Shopify Variant ID: <strong>{variantId}</strong>
                </p>
            ) : (
                <p className="text-red-500 mt-2">No Shopify Variant ID found</p>
            )}

            <div className="mt-6">
                {loading && <p>Loading variant...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {variant && (
                    <div>
                        <h2 className="text-lg font-semibold">{variant.title}</h2>

                        {variant.image && (
                            <img
                                src={variant.image.url}
                                alt={variant.image.altText || variant.title}
                                className="w-64 h-auto my-2"
                            />
                        )}

                        <p>Available: {variant.availableForSale ? "Yes" : "No"}</p>

                        {variant.barcode && <p>Barcode: {variant.barcode}</p>}

                        {variant.compareAtPrice && (
                            <p>Price: {variant.compareAtPrice}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
