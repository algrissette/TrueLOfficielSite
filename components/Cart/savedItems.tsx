import { api } from "@/app/util/apicCall";
import { VariantNode } from "@/app/util/datatypes";
import { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";

export default function SavedItems() {
    const [items, setItems] = useState<VariantNode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = async () => {
        try {
            setLoading(true);
            console.log("Fetching saved items...");

            const response = await api.post("/users/getSavedItems", {});
            console.log("Full response:", response);

            const { data } = response as {
                data: {
                    success: boolean;
                    items: { USER_ID: number; VARIANT: string; quantity: number }[];
                };
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

    const handleRemoveItem = async (e: React.MouseEvent, item: VariantNode) => {
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
    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>, item: VariantNode) => {
        e.preventDefault();
        const cartID = sessionStorage.getItem("cartID");
        console.log(cartID);

        const variantId = item?.id;
        console.log(variantId);
        if (!variantId) return;

        try {
            if (!cartID) {
                console.log("Creating new cart");
                const { data } = await api.post("/cart/createCart", {
                    input: { lines: [{ merchandiseId: variantId, quantity: 1 }] },
                });
                sessionStorage.setItem("cartID", data.data.data.cartCreate.cart.id);
            } else {
                const { data } = await api.post("/cart/addToCart", {
                    cartId: cartID,
                    lines: [{ merchandiseId: variantId, quantity: 1 }],
                });
                console.log(data);
            }

            // Remove from saved items after adding to cart
            handleRemoveItem(e, item);
            window.location.reload()
        } catch (err) {
            console.error(err);
        }
    };

    const getProductLink = (index: number) => {
        const item = items[index];
        return `/product/${item.id}`;
    };

    const getProductId = (index: number) => {
        const item = items[index];
        return item.product.id.split("/").pop();
    };

    const getVariantId = (index: number) => {
        const item = items[index];
        return item.id.split("/").pop();
    };

    if (loading) {
        return (
            <div className="w-full min-h-[400px] flex items-center justify-center">
                <div className="text-slate-400 text-lg">Loading saved items...</div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
                <div className="text-slate-400 text-lg">No saved items yet</div>
                <p className="text-slate-500 text-sm">Items you save for later will appear here</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-light text-white">Saved Items</h2>
                <p className="text-slate-400 text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
            </div>

            <div className="space-y-4">
                {items.map((item, int) => {
                    return (
                        <div
                            key={int}
                            className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-slate-600 transition-all duration-300 overflow-hidden"
                        >
                            <div className="flex gap-6 p-6">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <a
                                        href={getProductLink(int)}
                                        className="block relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <img
                                            className="w-32 h-32 object-cover rounded-lg border border-slate-700 relative z-10"
                                            src={item.image?.url}
                                            alt={item.product.title}
                                        />
                                    </a>
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    {/* Top Section */}
                                    <div>
                                        <div className="flex justify-between items-start gap-4 mb-3">
                                            <a
                                                href={getProductLink(int)}
                                                className="group/link"
                                            >
                                                <h3 className="text-lg font-light text-slate-100 group-hover/link:text-white transition-colors line-clamp-2">
                                                    {item.product.title}
                                                </h3>
                                            </a>
                                            <button
                                                className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                                                aria-label="Remove item"
                                                onClick={(event) => {
                                                    handleRemoveItem(event, item);
                                                }}
                                            >
                                                <CiTrash className="w-7 h-7 text-white hover:text-red-700 hover:drop-shadow-[0_0_6px_rgba(255,0,0,0.8)] transition-all duration-200" />
                                            </button>
                                        </div>

                                        {/* Product ID */}
                                        <p className="text-xs text-slate-600 font-mono mb-3 tracking-wider">
                                            #{getProductId(int)}777{getVariantId(int)}
                                        </p>

                                        {/* Options */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {item.selectedOptions.map((option, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-slate-700/40 border border-slate-600/50 text-slate-300 text-sm rounded-full backdrop-blur-sm"
                                                >
                                                    {option.value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Section */}
                                    <div className="flex justify-between items-end gap-4 flex-wrap">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={(event) => {
                                                    handleAddToCart(event, item);
                                                }}
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            {item.compareAtPrice && (
                                                <div className="flex items-center gap-2 justify-end mb-1">
                                                    <span className="text-xs bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                                                        Sale
                                                    </span>
                                                    <span className="text-sm text-slate-600 line-through">
                                                        ${item.compareAtPrice}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-xl font-light text-white">
                                                ${item.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}