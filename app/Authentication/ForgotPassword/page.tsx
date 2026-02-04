"use client";

import { api } from "@/app/util/apicCall";
import NavBar from "@/components/navbar/navbar";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSendResetLink(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await api.post("/users/sendPasswordResetLink", { email });
            toast.success("Password reset link has been sent to your email");
            setEmail("");
        } catch (error) {
            toast.error("Failed to send reset link. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-[100dvh] bg-black/90">
            <NavBar font="sans" color="#ffffff" />

            <div className="w-full max-w-md mx-auto flex flex-col place-items-center justify-center px-6 pt-24">
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
                    <p className="text-gray-300 mb-6">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSendResetLink} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                placeholder="your@email.com"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}