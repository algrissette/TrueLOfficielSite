"use client";

import { api } from "@/app/util/apicCall";
import { ProductLite, VariantNode } from "@/app/util/datatypes";
import NavBar from "@/components/navbar/navbar";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";

export default function ItemPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const rawProductId = searchParams.get("productId");
    const rawVariantId = searchParams.get("variantId");

    // Decode numeric IDs from URL
    const productId = rawProductId ? decodeURIComponent(rawProductId) : null;
    const variantId = rawVariantId ? decodeURIComponent(rawVariantId).split("/").pop() : null;

    const [variant, setVariant] = useState<VariantNode | null>(null);
    const [product, setProduct] = useState<ProductLite | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [allImages, setImages] = useState<string[]>([]);
    const [allColors, setColors] = useState<string[]>([]);
    const [allSizes, setSizes] = useState<string[]>([]);

    const fullVariantId = `gid://shopify/ProductVariant/${variantId}`;
    const fullProductId = `gid://shopify/Product/${rawProductId}`;

    // Fetch product and variant
    useEffect(() => {
        if (!variantId || !rawProductId) return;

        const fetchParentProduct = async () => {
            setLoading(true);
            try {
                const res = await api.post("/products/getProductById", { id: fullProductId });
                setProduct(res.data as ProductLite);
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
                setVariant(res.data as VariantNode);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch variant");
            } finally {
                setLoading(false);
            }
        };

        fetchParentProduct();
        fetchVariant();
    }, [variantId, rawProductId]);

    // Compute images, colors, sizes after both product and variant are loaded
    useEffect(() => {
        console.log(product, variant)
        if (!product || !variant) return;

        // Color of the current variant
        const color = variant.selectedOptions?.find(o => o.name === "Color")?.value?.toLowerCase();
        console.log("Color", color)

        // Images
        const images = product.variants.nodes
            .map(v => {
                const url = v.image?.url;
                if (!url) return null;

                const match = url.match(/\/([^/_]+)_\d+x\d+/);
                const name = match?.[1]?.toLowerCase();

                if (!color) return variant.image?.url || null;
                return name?.toLocaleLowerCase() === color ? url : null;
            })
            .filter(Boolean) as string[];
        if (images.length == 0) {
            images.push(variant.image.url)
        }
        setImages(images);

        // Colors
        // Colors
        const variantColor = variant.selectedOptions?.find(o => o.name === "Color")?.value;

        // collect sibling colors
        const siblingColors = product.variants.nodes
            .map(v => v.selectedOptions?.find(o => o.name === "Color")?.value)
            .filter((c): c is string => !!c && c !== variantColor); // <-- type guard filters out undefined

        const colors = [variantColor, ...siblingColors].filter((c): c is string => !!c);

        setColors(Array.from(new Set(colors))); // now all are strings

        // Sizes
        const sizes = product.variants.nodes
            .map(v => v.selectedOptions?.find(o => o.name === "Size")?.value)
            .filter(Boolean) as string[];
        setSizes(sizes);
        console.log("sizes", allSizes)

    }, [product, variant]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div>
            <NavBar font="sans" color="#ffffff" />

            <div className="flex">
                {/* Images */}
                <div className="m-8 p-2 w-[70%] grid grid-cols-2 gap-4">
                    {allImages.map((item, index) => (
                        <img key={index} src={item} className="w-full h-auto object-cover" />
                    ))}
                </div>

                {/* Product Info */}
                <div className="m-8 p-2 w-[30%]">
                    <h1 className="text-2xl font-bold">{product?.title}</h1>
                    <p> ${variant?.price}</p>
                    <p>{product?.desciption}</p>
                    <h2> Choose Your Size </h2>
                    <div className="flex gap-4">

                        {allSizes.map((item) => {
                            return <div className="w-5 h-5 bg-gray-200  ">
                                {item.charAt(0)}
                            </div>
                        })}
                    </div>

                    <h2> Available In:</h2>
                    <p> Coming Soon</p>

                    <button className="w-30 border "> Add To Cart</button>
                    <div className="flex">
                        <CiHeart />
                        <p> Add to List </p>
                    </div>

                    {variant?.availableForSale && <p className="mt-2 text-green-600">In Stock</p>}
                    {!variant?.availableForSale && <p className="mt-2 text-red-600">Out of Stock</p>}
                </div>
            </div>
        </div>
    );
}
