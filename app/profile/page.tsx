"use client";

import { useEffect, useState } from "react";
import { api } from "../util/apicCall";
import NavBar from "@/components/navbar/navbar";

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

    if (!user) {
        return (
            <div> <NavBar font="sans" color="#ffffff" />
                <div className="min-h-screen flex items-center justify-center bg-black text-white">
                    <p className="tracking-widest text-sm opacity-60">LOADING</p>
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
                <div className="mt-10 flex gap-4">
                    <button className="px-6 py-3 rounded-full border border-white/20 hover:border-white transition text-sm tracking-wide">
                        CHANGE PASSWORD
                    </button>
                    <button className="px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition text-sm tracking-wide">
                        SAVE CHANGES
                    </button>
                </div>
            </div>
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
