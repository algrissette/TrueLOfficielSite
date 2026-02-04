"use client";

import NavBar from "@/components/navbar/navbar";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../util/apicCall";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (!tokenFromUrl) {
            toast.error("Invalid or missing reset token");
            router.push("/forgot-password");
        } else {
            setToken(tokenFromUrl);
        }
    }, [searchParams, router]);

    async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!password || !repeatPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== repeatPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!token) {
            toast.error("Invalid reset token");
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await api.post("users/resetPassword", {
                token,
                newPassword: password
            });
            toast.success("Password has been reset successfully!");
            setPassword("");
            setRepeatPassword("");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("Authentication/Login");
            }, 2000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to reset password. Please try again.";
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="h-[100dvh] bg-black/90 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="h-[100dvh] bg-black/90">
            <NavBar font="sans" color="#ffffff" />

            <div className="w-full max-w-md mx-auto flex flex-col place-items-center justify-center px-6 pt-24">
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-gray-300 mb-6">
                        Enter your new password below.
                    </p>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                placeholder="Enter new password"
                                disabled={isLoading}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Must be 8+ characters with 1 number and 1 capital letter
                            </p>
                        </div>

                        <div>
                            <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-200 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="repeatPassword"
                                name="repeatPassword"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                placeholder="Confirm new password"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}