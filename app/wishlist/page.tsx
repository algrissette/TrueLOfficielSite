"use client";

import { useEffect, useState } from "react";
import { api } from "../util/apicCall";
import { VariantNode } from "../util/datatypes";
import NavBar from "@/components/navbar/navbar";

export default function Wishlist() {
    const [items, setItems] = useState<VariantNode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems();
        console.log("items", items)
    }, []);

    const getItems = async () => {
        try {
            setLoading(true);
            console.log("Fetching saved items...");

            const response = await api.post("/users/getSavedItems", {});
            console.log("Full response:", response);

            const { data } = response as {
                data: {
                    success: boolean,
                    items: { USER_ID: number; VARIANT: string; quantity: number }[]
                }
            };

            console.log("Parsed data:", data);

            if (!data || !data.items || data.items.length === 0) {
                console.log("No items found");
                setItems([]);
                return;
            }

            console.log("Found items:", data.items);

            const variantIds = data.items.map((item) => item.VARIANT);
            console.log("Variant IDs to fetch:", variantIds);

            const shopifyLinks = await Promise.all(
                variantIds.map((id) => getItemsfromShopify(id))
            );

            console.log("Fetched Shopify data:", shopifyLinks);
            setItems(shopifyLinks.filter(Boolean) as VariantNode[]);
        } catch (err: any) {
            console.error("ERROR in getItems:");
            console.error("Message:", err.message);
            console.error("Response data:", err.response?.data);
            console.error("Response status:", err.response?.status);
            console.error("Full error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getItemsfromShopify = async (id: string) => {
        try {
            console.log("Fetching variant from Shopify, ID:", id);
            const { data } = await api.post<VariantNode>("/products/getProductVariantById", { id });
            console.log("Shopify variant data:", data);
            return data;
        } catch (err: any) {
            console.error("ERROR fetching variant", id);
            console.error("Message:", err.message);
            console.error("Response:", err.response?.data);
            return null;
        }
    };

    const removeItem = async (e: React.MouseEvent, item: VariantNode) => {
        e.preventDefault();
        setItems(items.filter((i) => i.id !== item.id));

        try {
            await api.post("/users/removeSavedItem", { savedItemId: item.id });
            console.log("Item removed from saved items");
        } catch (err) {
            console.error("Error removing saved item:", err);
            // Optionally revert the UI update if the API call fails
            // getItems();
        }
    };

    const formatPrice = (price: string) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const getVariantOptionsText = (item: VariantNode) => {
        return item.selectedOptions
            .filter(opt => opt.name !== 'Title')
            .map(opt => `${opt.name}: ${opt.value}`)
            .join(' • ');
    };

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>, item: VariantNode) => {
        e.preventDefault()
        const cartID = sessionStorage.getItem("cartID")
        console.log(cartID)

        const variantId = item?.id
        console.log(variantId)
        if (!variantId) return

        try {
            if (!cartID) {
                console.log("happy")
                const { data } = await api.post("/cart/createCart", {
                    input: { lines: [{ merchandiseId: variantId, quantity: 1 }] },
                })
                sessionStorage.setItem("cartID", data.data.data.cartCreate.cart.id)

            } else {


                const { data } = await api.post("/cart/addToCart", {
                    cartId: cartID,
                    lines: [{ merchandiseId: variantId, quantity: 1 }],
                })

                console.log(data)
                window.location.reload()


            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <NavBar
                font="sans"
                color="#ffffff"
            />


            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="font-edwardian text-3xl md:text-8xl font-light tracking-tight mb-3">
                        Saved Items
                    </h1>
                    <p className="text-gray-400 text-lg font-light">Your curated collection</p>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-16 h-16 mb-8">
                            <div className="absolute inset-0 border border-white/20 rounded-full animate-spin" />
                            <div className="absolute inset-2 border border-white/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                        </div>
                        <p className="text-gray-500 text-sm font-light tracking-wide">Loading...</p>
                    </div>
                ) : items.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-24 h-24 mb-8 border border-white/10 rounded-full flex items-center justify-center">
                            <div className="w-12 h-12 border border-white/20 rounded-full" />
                        </div>
                        <h2 className="text-2xl font-light mb-3 text-gray-300">Save Items to your personal account!</h2>
                        <p className="text-gray-500 text-sm">Start building your collection</p>
                    </div>
                ) : (
                    /* Items grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="group relative bg-black/40 backdrop-blur-sm overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-[3/4] bg-black/20 overflow-hidden">
                                    {item.image?.url ? (
                                        <img
                                            src={item.image.url}
                                            alt={item.image.altText || item.product?.title || 'Product'}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-black/40">
                                            <div className="w-24 h-24 border border-white/10 rounded-full" />
                                        </div>
                                    )}

                                    {/* Remove button */}
                                    <button
                                        onClick={(event) => removeItem(event, item)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-black/80 hover:bg-black border border-white/10 hover:border-white/30 flex items-center justify-center backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                                        aria-label="Remove from wishlist"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    {/* Discount badge */}
                                    {item.compareAtPrice && parseFloat(item.compareAtPrice) > parseFloat(item.price) && (
                                        <div className="absolute top-4 left-4 bg-white text-black text-xs font-medium tracking-wider px-3 py-1.5 backdrop-blur-sm">
                                            SALE
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    {/* Product title */}
                                    <h3 className="text-lg font-light mb-2 text-white tracking-wide line-clamp-2 group-hover:text-gray-300 transition-colors">
                                        {item.product?.title || 'Untitled Product'}
                                    </h3>

                                    {/* Variant options */}
                                    {getVariantOptionsText(item) && (
                                        <p className="text-xs text-gray-500 mb-4 tracking-wide uppercase">
                                            {getVariantOptionsText(item)}
                                        </p>
                                    )}

                                    {/* Pricing */}
                                    <div className="flex items-baseline gap-3 mb-4">
                                        <div className="text-xl font-light text-white">
                                            {formatPrice(item.price)}
                                        </div>
                                        {item.compareAtPrice && parseFloat(item.compareAtPrice) > parseFloat(item.price) && (
                                            <div className="text-sm text-gray-600 line-through font-light">
                                                ${parseFloat(item.compareAtPrice).toFixed(2)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Availability */}
                                    <div className={`text-xs mb-6 tracking-wider uppercase font-light ${item.availableForSale ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {item.availableForSale ? 'In Stock' : 'Out of Stock'}
                                    </div>

                                    {/* Add to cart button */}
                                    <button
                                        className={`w-full font-light py-3 text-sm tracking-wider uppercase transition-all duration-300 ${item.availableForSale
                                            ? 'bg-white text-black hover:bg-gray-200'
                                            : 'bg-white/10 text-gray-600 cursor-not-allowed border border-white/5'
                                            }`}
                                        disabled={!item.availableForSale}
                                        onClick={(event) => { handleAddToCart(event, item) }}
                                    >
                                        {item.availableForSale ? 'Add to Cart' : 'Unavailable'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer stats */}
                {!loading && items.length > 0 && (
                    <div className="mt-20 text-center">
                        <div className="inline-block border-t border-white/10 pt-8">
                            <p className="text-gray-500 text-sm tracking-wide font-light">
                                {items.length} {items.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}