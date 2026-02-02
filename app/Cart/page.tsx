"use client";

import { useEffect, useState } from "react";
import { api } from "../util/apicCall";
import { Cart, CartLine } from "../util/datatypes";
import displayCartItems from "@/components/Cart/cart";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import TotalInformation from "@/components/Cart/totalInformation";
import SavedItems from "@/components/Cart/savedItems";

type TabType = "cart" | "saved";

export default function CartPage() {
    const [cart, setCart] = useState<CartLine[]>([]);
    const [cartInfo, setCartInfo] = useState<Cart>();
    const [activeTab, setActiveTab] = useState<TabType>("cart");

    useEffect(() => {
        const fetchCart = async () => {
            const cartID = sessionStorage.getItem("cartID");

            if (!cartID) {
                console.log("There are no items added to cart yet");
                return;
            }

            try {
                const response = await api.post("/cart/getAllCartItems", {
                    cartId: cartID,
                });
                setCart(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchCartInfo = async () => {
            const cartID = sessionStorage.getItem("cartID");

            if (!cartID) {
                console.log("There are no items added to cart yet");
                return;
            }

            try {
                const { data } = await api.post<{ cart: Cart }>(
                    "/cart/getCartInfo",
                    { cartId: cartID }
                );

                setCartInfo(data.cart);
            } catch (error) {
                console.log(error);
            }
        };

        fetchCart();
        fetchCartInfo();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
            <NavBar font="sans" color="#ffffff" />

            <div className="container mx-auto px-6 py-12 max-w-7xl">
                {/* Header Section with Tabs */}
                <div className="mb-12">
                    <div className="border-b border-slate-800">
                        <div className="flex items-baseline gap-8 pb-6">
                            <h1 className="text-7xl md:text-8xl text-white font-edwardian tracking-wider">
                                Shopping
                            </h1>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-1 -mb-px">
                            <button
                                onClick={() => setActiveTab("cart")}
                                className={`px-8 py-4 font-light text-lg transition-all duration-300 relative ${activeTab === "cart"
                                    ? "text-white"
                                    : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                The Cart
                                {activeTab === "cart" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("saved")}
                                className={`px-8 py-4 font-light text-lg transition-all duration-300 relative ${activeTab === "saved"
                                    ? "text-white"
                                    : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                Saved Items
                                {activeTab === "saved" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Content Section - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
                            {activeTab === "cart" ? (
                                // Cart Tab Content
                                cart.length > 0 ? (
                                    <div>{displayCartItems(cart)}</div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="inline-block p-6 bg-slate-800/50 rounded-full mb-6">
                                            <svg
                                                className="w-16 h-16 text-slate-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-light text-slate-400 mb-2">
                                            Your cart is empty
                                        </h3>
                                        <p className="text-slate-600">
                                            Start exploring the cosmos of fashion
                                        </p>
                                    </div>
                                )
                            ) : (
                                // Saved Items Tab Content
                                <SavedItems />
                            )}
                        </div>
                    </div>

                    {/* Order Summary Section - Takes 1 column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {activeTab === "cart" ? (
                                cartInfo ? (
                                    <TotalInformation cart={cartInfo} />
                                ) : (
                                    <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
                                        Loading cart details...
                                    </div>
                                )
                            ) : (
                                // Saved Items Summary
                                <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8">
                                    <h2 className="text-2xl font-light text-white tracking-wide mb-4">
                                        Saved Items
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                        Browse your saved items and move them to your cart when you're ready to purchase.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}