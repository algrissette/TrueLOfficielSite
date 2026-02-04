"use client";

import { useEffect, useState } from "react";
import { api } from "../util/apicCall";
import NavBar from "@/components/navbar/navbar";
import toast from "react-hot-toast";

type User = {
    id: number;
    FIRST_NAME: string;
    LAST_NAME: string;
    EMAIL: string;
    DOB: string;
    SUD: string;
    CART: any;
};


export default function Profile() {

    const [user, setUser] = useState<User | null>(null);
    const [showPasswordPopUp, setShowPasswordPopUp] = useState<boolean>(false)

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await api.post("users/getUser", {});
                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        getUser();
    }, []);



    function handleChangePassword(event: React.MouseEvent<HTMLButtonElement>) {
        setShowPasswordPopUp((x) => !x)
    }
    async function handleSavePassword(event: React.MouseEvent<HTMLButtonElement>) {
        const password = (document.getElementsByName("password")[0] as HTMLInputElement).value;
        const repeatPassword = (document.getElementsByName("repeatPassword")[0] as HTMLInputElement).value;

        if (password !== repeatPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const { data } = await api.post("/users/updatePassword", { newPassword: password });
            console.log(data);
            toast.success("Password has been changed");
            setShowPasswordPopUp(false);
        } catch (error) {
            toast.error("Password did not meet criteria");
        }
    }

    if (!user) {
        return (
            <div> <NavBar font="sans" color="#ffffff" />
                <div className="min-h-screen flex items-center justify-center bg-black text-white">
                    <p className="tracking-widest text-sm opacity-60">Log in to create a profile!</p>
                </div>
            </div>
        );
    }

    return (<div>
        <NavBar font="sans" color="#ffffff" />

        <div className="min-h-screen bg-[#050508] text-white px-30 py-12">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-xs tracking-[0.3em] text-gray-400 mb-2">
                        USER PROFILE
                    </p>
                    <h1 className="text-4xl font-light tracking-tight">
                        {user.FIRST_NAME}{" "}
                        <span className="opacity-60">{user.LAST_NAME}</span>
                    </h1>
                </div>

                {/* Profile Card */}
                <div className="space-y-6 border border-white/10 rounded-2xl p-8 backdrop-blur">
                    <ProfileRow
                        label="EMAIL"
                        value={user.EMAIL}
                        hideButton={true}

                    />
                    <ProfileRow
                        label="DATE OF BIRTH"
                        value={new Date(user.DOB).toLocaleDateString()}
                        hideButton={true}

                    />
                    <ProfileRow
                        label="SIGNED UP"
                        value={new Date(user.SUD).toLocaleDateString()}
                        hideButton={true}
                    />

                </div>


                {/* Footer Actions */}
                <div className="m-10 flex gap-4 justify-center">
                    <button
                        onClick={(event) => { handleChangePassword(event) }}
                        className="px-6 py-3 rounded-full border border-white/20 hover:border-white transition text-sm tracking-wide">
                        CHANGE PASSWORD
                    </button>
                    <button onClick={(event) => { handleSavePassword(event) }} className="px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition text-sm tracking-wide">
                        SAVE CHANGES
                    </button>
                </div>
            </div>

            {/* Password Modal Overlay */}
            {showPasswordPopUp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        {/* Header */}
                        <div className="mb-6">
                            <p className="text-xs tracking-[0.3em] text-gray-400 mb-2">
                                SECURITY
                            </p>
                            <h2 className="text-2xl font-light tracking-tight">
                                Change Password
                            </h2>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs tracking-widest text-gray-400 mb-2">
                                    NEW PASSWORD
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-xs tracking-widest text-gray-400 mb-2">
                                    CONFIRM PASSWORD
                                </label>
                                <input
                                    name="repeatPassword"
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        {/* Password Criteria */}
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                            <p className="text-xs tracking-widest text-gray-400 mb-3">
                                PASSWORD REQUIREMENTS
                            </p>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-500 mt-1">•</span>
                                    <span>Minimum 8 characters</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-500 mt-1">•</span>
                                    <span>At least one uppercase letter</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-500 mt-1">•</span>
                                    <span>At least one number</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-500 mt-1">•</span>
                                    <span>No special characters or spaces</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPasswordPopUp(false)}
                                className="flex-1 px-6 py-3 rounded-full border border-white/20 hover:border-white transition text-sm tracking-wide"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleSavePassword}
                                className="flex-1 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition text-sm tracking-wide"
                            >
                                UPDATE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>

    );
}

function ProfileRow({
    label,
    value,
    hideButton = false,
}: {
    label: string;
    value: string;
    hideButton?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-6">
            <div>
                <p className="text-xs tracking-widest text-gray-400 mb-1">
                    {label}
                </p>
                <p className="text-lg font-light tracking-tight">
                    {value}
                </p>
            </div>

            {!hideButton && (
                <button className="text-xs tracking-widest px-4 py-2 rounded-full border border-white/20 hover:border-white transition opacity-80 hover:opacity-100">
                    UPDATE
                </button>
            )}
        </div>
    );
}