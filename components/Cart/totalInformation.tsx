import { Cart } from "@/app/util/datatypes";

type Props = {
    cart: Cart | undefined;
};

type Money = {
    amount: string;
    currencyCode: string;
};

export default function TotalInformation({ cart }: Props) {
    console.log("the cart", cart);

    // Guard: cart not loaded yet
    if (!cart) {
        return (
            <div className="w-full bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    // Guard: cart exists but no cost data
    if (!cart.cost) {
        return (
            <div className="w-full bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <p className="text-slate-500 text-center">No items in cart</p>
            </div>
        );
    }

    const { cost, checkoutUrl, createdAt } = cart;

    // Null-safe money formatter
    const formatMoney = (money?: Money | null) => {
        if (!money || !money.amount) return "—";

        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: money.currencyCode || "USD",
            }).format(Number(money.amount));
        } catch (error) {
            console.error("Error formatting money:", error);
            return `$${money.amount}`;
        }
    };

    return (
        <div className="w-full bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-slate-700">
                <h2 className="text-2xl font-light text-white tracking-wide">
                    Order Summary
                </h2>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-4 mb-6">
                <Row label="Subtotal" value={formatMoney(cost.subtotalAmount)} />
                <Row label="Tax" value={formatMoney(cost.totalTaxAmount)} />

                <div className="my-4 border-t border-slate-700/50" />

                <Row
                    label="Total"
                    value={formatMoney(cost.totalAmount)}
                    strong
                />
            </div>

            {/* Checkout Button */}
            {checkoutUrl ? (
                <a
                    href={checkoutUrl}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-4 rounded-xl text-center font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
                >
                    <span className="flex items-center justify-center gap-2">
                        Proceed to Checkout
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </span>
                </a>
            ) : (
                <button
                    disabled
                    className="block w-full bg-slate-800 text-slate-600 px-6 py-4 rounded-xl text-center font-medium cursor-not-allowed"
                >
                    Checkout Unavailable
                </button>
            )}

            {/* Cart Created Date */}
            {createdAt && (
                <p className="mt-6 text-xs text-slate-600 text-center">
                    Cart created{" "}
                    {new Date(createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            )}

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    <span>Secure checkout</span>
                </div>
            </div>
        </div>
    );
}

function Row({
    label,
    value,
    strong = false,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between ${strong ? "text-lg font-medium" : "text-sm font-light"
                }`}
        >
            <span className={strong ? "text-slate-300" : "text-slate-500"}>
                {label}
            </span>
            <span className={strong ? "text-white" : "text-slate-400"}>
                {value}
            </span>
        </div>
    );
}