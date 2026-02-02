//fetch cart

import { api } from "@/app/util/apicCall";
import { Cart, CartLine, ProductVariant } from "@/app/util/datatypes";
import toast from "react-hot-toast";
import { CiTrash } from "react-icons/ci";
export default function displayCartItems(cart: CartLine[]) {
    const items = cart.map((item) => {
        return item.merchandise;
    });

    const fetchCart = () => {
        const cartID = sessionStorage.getItem("cartID");
        if (!cartID) {
            return null;
        } else {
            return cartID;
        }
    };

    // ===== Add to Cart =====
    const handleAddToCart = async (
        e: React.MouseEvent<HTMLButtonElement>,
        variant: ProductVariant
    ) => {
        e.preventDefault();

        const cartID = fetchCart();
        const variantId = variant?.id;
        if (!variantId || !cartID) return;

        try {
            const { data } = await api.post("/cart/addToCart", {
                cartId: cartID,
                lines: [{ merchandiseId: variantId, quantity: 1 }],
            });

            const warnings = data?.data?.cartLinesAdd?.warnings ?? [];

            const outOfStock = warnings.some(
                (w: any) => w.code === "MERCHANDISE_NOT_ENOUGH_STOCK"
            );

            if (outOfStock) {
                toast.error("Sorry — this item is out of stock past this point");
                return;
            }

            window.location.reload();
        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
        }
    };

    const handleChangeCart = async (
        e: React.MouseEvent<HTMLButtonElement>,
        variant: ProductVariant,
        int: number
    ) => {
        e.preventDefault();
        const cartID = fetchCart();

        const lineId = cart[int].id;
        if (!lineId) return;

        try {
            if (!cartID) {
                console.log("No Cart");
            } else {
                const newQuantity: number = cart[int].quantity - 1;

                const { data } = await api.post("/cart/changeCart", {
                    cartId: cartID,
                    lines: [{ id: lineId, quantity: newQuantity }],
                });

                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    };
    const handleRemoveFromCart = async (
        e: React.MouseEvent<HTMLButtonElement>,
        variant: ProductVariant,
        index: number
    ) => {
        e.preventDefault()

        const cartId = fetchCart()
        if (!cartId) {
            console.log("No Cart")
            return
        }

        const lineId = cart[index]?.id
        if (!lineId) return

        try {
            const { data } = await api.post("/cart/removeCartItem", {
                cartId,
                lineIds: [lineId], // ✅ correct
            })


            window.location.reload();
        } catch (err) {
            console.error(err)
        }
    }

    const handleSaveForLater = async (
        e: React.MouseEvent<HTMLButtonElement>,
        variant: ProductVariant,
        index: number
    ) => {
        e.preventDefault()

        const cartId = fetchCart()
        if (!cartId) return

        const line = cart[index]
        if (!line) return

        try {
            // 1️⃣ Save variant
            await api.post("/users/saveItemInDatabase", {
                variantId: variant.id, // or line.merchandise.id (both fine)
            })

            // 2️⃣ Remove cart line
            await api.post("/cart/removeCartItem", {
                cartId,
                lineIds: [line.id],
            })

            window.location.reload();
        } catch (error) {
            toast.error("Could not save. You may not be logged in!");

            console.error(error)
        }
    }



    function getVariantId(int: number) {
        const variantId = encodeURIComponent(
            cart[int].merchandise.id.split("/").pop() || ""
        );
        return variantId;
    }

    function getProductId(int: number) {
        const productId = encodeURIComponent(
            cart[int].merchandise.product.id.split("/").pop() || ""
        );
        return productId;
    }

    function getProductLink(int: number) {
        const variantId = getVariantId(int);
        const productId = getProductId(int);
        return `/Items/item?productId=${productId}&variantId=${variantId}`;
    }




    return (
        <div className="w-full">
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
                                        href={(() => {
                                            return getProductLink(int);
                                        })()}
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
                                                href={(() => {
                                                    return getProductLink(int);
                                                })()}
                                                className="group/link"
                                            >
                                                <h3 className="text-lg font-light text-slate-100 group-hover/link:text-white transition-colors line-clamp-2">
                                                    {item.product.title}
                                                </h3>
                                            </a>
                                            <button
                                                className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                                                aria-label="Remove item"
                                                onClick={(event) => { handleRemoveFromCart(event, item, int); }}
                                            >
                                                <CiTrash className="w-7 h-7 text-white hover:text-red-700 hover:drop-shadow-[0_0_6px_rgba(255,0,0,0.8)] transition-all duration-200" />

                                            </button>
                                        </div>

                                        {/* Product ID */}
                                        <p className="text-xs text-slate-600 font-mono mb-3 tracking-wider">
                                            #
                                            {(() => {
                                                return getProductId(int);
                                            })()}
                                            777
                                            {(() => {
                                                return getVariantId(int);
                                            })()}
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
                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={(event) => {
                                                        handleChangeCart(event, item, int);
                                                    }}
                                                    className="px-4 py-2 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
                                                >
                                                    −
                                                </button>
                                                <span className="px-4 py-2 min-w-[3rem] text-center font-medium text-slate-100 bg-slate-900/50">
                                                    {cart[int].quantity}
                                                </span>
                                                <button
                                                    onClick={(event) => {
                                                        handleAddToCart(event, item);
                                                    }}
                                                    className="px-4 py-2 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Save for Later */}
                                            <button
                                                onClick={(event) => {
                                                    handleSaveForLater(event, item, int);
                                                }}
                                                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                                            >
                                                Save For Later
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            {item.compareAtPrice?.amount && (
                                                <div className="flex items-center gap-2 justify-end mb-1">
                                                    <span className="text-xs bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                                                        Sale
                                                    </span>
                                                    <span className="text-sm text-slate-600 line-through">
                                                        ${item.compareAtPrice.amount}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-xl font-light text-white">
                                                $
                                                {item.compareAtPrice?.amount
                                                    ? item.price.amount
                                                    : item.price.amount}
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