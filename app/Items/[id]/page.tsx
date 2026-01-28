"use client";

import { api } from "@/app/util/apicCall";
import { ProductLite, VariantNode } from "@/app/util/datatypes";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";

export default function ItemPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const rawProductId = searchParams.get("productId");
    const rawVariantId = searchParams.get("variantId");

    const productId = rawProductId ? decodeURIComponent(rawProductId) : null;
    const variantId = rawVariantId ? decodeURIComponent(rawVariantId).split("/").pop() : null;

    const [variant, setVariant] = useState<VariantNode | null>(null);
    const [product, setProduct] = useState<ProductLite | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [allImages, setImages] = useState<string[]>([]);
    const [allColors, setColors] = useState<string[]>([]);
    const [allSizes, setSizes] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const fullVariantId = `gid://shopify/ProductVariant/${variantId}`;
    const fullProductId = `gid://shopify/Product/${rawProductId}`;

    // Color mapping for stars
    const colorMap: Record<string, string> = {
        'black': '#000000',
        'white': '#FFFFFF',
        'blue': '#4C9AFF',
        'red': '#FF3333',
        'yellow': '#FFE735',
        'pink': '#F594FE',
        'purple': '#9B59B6',
        'green': '#2ECC71',
        'orange': '#E67E22',
        'gray': '#95A5A6',
        'grey': '#95A5A6',
    };

    const getColorHex = (colorName: string): string => {
        const lower = colorName.toLowerCase();
        return colorMap[lower] || '#FFFFFF';
    };

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

    useEffect(() => {
        console.log(product, variant);
        if (!product || !variant) return;

        const color = variant.selectedOptions?.find(o => o.name === "Color")?.value?.toLowerCase();

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
            images.push(variant.image.url);
        }
        setImages(images);

        const variantColor = variant.selectedOptions?.find(o => o.name === "Color")?.value;
        const siblingColors = product.variants.nodes
            .map(v => v.selectedOptions?.find(o => o.name === "Color")?.value)
            .filter((c): c is string => !!c && c !== variantColor);

        const colors = [variantColor, ...siblingColors].filter((c): c is string => !!c);
        setColors(Array.from(new Set(colors)));
        setSelectedColor(variantColor || null);

        const sizes = product.variants.nodes
            .map(v => v.selectedOptions?.find(o => o.name === "Size")?.value)
            .filter(Boolean) as string[];
        setSizes(Array.from(new Set(sizes)));
    }, [product, variant]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <NavBar font="sans" color="#ffffff" />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-[#4C9AFF] rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-[#FF3333] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-[#FFE735] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black">
                <NavBar font="sans" color="#ffffff" />
                <div className="flex items-center justify-center h-[80vh]">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <NavBar font="sans" color="#ffffff" />

            <div className="max-w-[1800px] mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Images Section - 70% width, interactive zoom like WithJean */}
                    <div className="w-[70%] grid grid-cols-2 gap-3">
                        {allImages.map((item, index) => (
                            <div
                                key={index}
                                className="relative aspect-[3/4] overflow-hidden bg-black group cursor-crosshair"
                            >
                                <img
                                    src={item}
                                    alt={`${product?.title} - ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-150"
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transformOrigin = 'center center';
                                    }}
                                />
                                {/* Minimal border */}
                                <div className="absolute inset-0 border border-gray-900 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>

                    {/* Product Info Section - 30% width, sticky */}
                    <div className="w-[30%] space-y-6 sticky top-24 h-fit">
                        {/* Title */}
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                {product?.title}
                            </h1>

                            {/* Gradient line */}
                            <div className="w-16 h-0.5 bg-gradient-to-r from-[#4C9AFF] via-[#FF3333] to-[#FFE735]"></div>

                            {variant?.price && (
                                <p className="text-2xl font-bold text-white">
                                    ${variant.price}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        {product?.desciption && (
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {product.desciption}
                            </p>
                        )}

                        {/* Color Selection - Stars */}
                        {allColors.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-white tracking-widest uppercase">
                                    Color
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {allColors.map((color) => {
                                        const hexColor = getColorHex(color);
                                        const isSelected = selectedColor === color;

                                        return (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className="group relative flex flex-col items-center gap-1"
                                                title={color}
                                            >
                                                {/* Star */}
                                                <div className={`relative transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                    <svg
                                                        width="32"
                                                        height="32"
                                                        viewBox="0 0 24 24"
                                                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                                                    >
                                                        <path
                                                            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                                                            fill={hexColor}
                                                            stroke={isSelected ? '#FFFFFF' : hexColor}
                                                            strokeWidth={isSelected ? '1' : '0'}
                                                        />
                                                    </svg>
                                                    {/* Glow when selected */}
                                                    {isSelected && (
                                                        <div
                                                            className="absolute inset-0 blur-lg animate-pulse"
                                                            style={{
                                                                backgroundColor: hexColor,
                                                                opacity: 0.4
                                                            }}
                                                        ></div>
                                                    )}
                                                </div>
                                                {/* Color name */}
                                                <span className={`text-[10px] font-medium transition-colors duration-200 ${isSelected ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                                                    }`}>
                                                    {color}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {allSizes.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-white tracking-widest uppercase">
                                    Size
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {allSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-5 py-2 border-2 text-sm font-semibold transition-all duration-300 ${selectedSize === size
                                                    ? 'border-[#4C9AFF] bg-[#4C9AFF]/20 text-white shadow-[0_0_15px_rgba(76,154,255,0.4)]'
                                                    : 'border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-900">
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${variant?.availableForSale ? 'bg-[#2ECC71]' : 'bg-[#FF3333]'}`}></div>
                            <p className={`text-xs font-semibold tracking-wide ${variant?.availableForSale ? 'text-[#2ECC71]' : 'text-[#FF3333]'}`}>
                                {variant?.availableForSale ? 'IN STOCK' : 'OUT OF STOCK'}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-4">
                            <button
                                className="w-full bg-white text-black py-3 text-sm font-bold hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!variant?.availableForSale}
                            >
                                Add to Cart
                            </button>

                            <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-700 text-sm font-bold text-white hover:border-[#FF3333] hover:bg-[#FF3333]/10 transition-all duration-300 group">
                                <CiHeart className="text-lg group-hover:text-[#FF3333] transition-colors duration-300" />
                                <span>Wishlist</span>
                            </button>
                        </div>

                        {/* Cosmic dots */}
                        <div className="flex justify-center gap-1.5 pt-6">
                            <div className="w-1 h-1 bg-[#4C9AFF] rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-[#FF3333] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            <div className="w-1 h-1 bg-[#FFE735] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}