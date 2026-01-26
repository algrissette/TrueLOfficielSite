"use client";

import { useSearchParams, useParams } from "next/navigation";

export default function ItemPage() {
    const params = useParams(); // dynamic folder segment ([id])
    const searchParams = useSearchParams();

    // Get productId and variantId from query params
    const rawProductId = searchParams.get("productId");
    const rawVariantId = searchParams.get("variantId");

    // Decode them (important!)
    const productId = rawProductId ? decodeURIComponent(rawProductId) : null;
    const variantId = rawVariantId ? decodeURIComponent(rawVariantId).split("/").pop() : null;

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
        </div>
    );
}
