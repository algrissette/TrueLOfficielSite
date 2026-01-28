"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { api } from "@/app/util/apicCall";
import { Products, ProductNode } from "@/app/util/datatypes";
import { MdArrowDropDown } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useParams, useSearchParams } from "next/navigation";

type CategoryOption = {
    name: string;
    values: string[];
};

export default function CategorySideBar() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductNode[]>([]);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const { params } = useParams();

    // Toggle dropdown
    const handleShowMenuItems = (name: string) => {
        console.log("Toggling category:", name);
        setOpenCategory(openCategory === name ? null : name);
    };

    function filterForCategory(
        e: ChangeEvent<HTMLInputElement>,
        item: CategoryOption,
        wantedItem: string
    ) {
        const urlParams = new URLSearchParams(searchParams.toString());
        const key = item.name;
        const existing = urlParams.getAll(key);

        if (e.target.checked) {
            if (!existing.includes(wantedItem)) { urlParams.append(key, wantedItem); }
        } else {
            const filtered = existing.filter(v => v !== wantedItem);
            urlParams.delete(key);
            filtered.forEach(v => urlParams.append(key, v));
        }

        router.push(`?${urlParams.toString()}`);
    }

    useEffect(() => {
        console.log("CategorySideBar mounted");
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get<ProductNode[]>("/products/getAllProducts");
                console.log("API returned data:", data);

                const nodes = data;
                console.log("Mapped product nodes:", nodes);
                setProducts(nodes);

                const optionsList: CategoryOption[] = [];

                nodes.forEach(product => {
                    product.options?.forEach(option => {
                        const existing = optionsList.find(o => o.name === option.name);
                        if (existing) {
                            option.values?.forEach(v => {
                                if (v && !existing.values.includes(v)) existing.values.push(v);
                            });
                        } else {
                            optionsList.push({
                                name: option.name,
                                values: [...(option.values ?? [])].filter(Boolean),
                            });
                        }
                    });
                });

                optionsList.sort((a, b) => a.name.localeCompare(b.name));
                optionsList.forEach(option => option.values.sort((a, b) => a.localeCompare(b)));

                console.log("Final categories:", optionsList);
                setCategories(optionsList);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    console.log("Rendering CategorySideBar, products:", products);
    console.log("Rendering CategorySideBar, categories:", categories);

    if (loading) {
        return (
            <div className="sticky top-0 z-30 backdrop-blur-xl bg-black border-b border-white/10">
                <div className="flex items-center justify-center h-20 px-6">
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-[#4C9AFF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#FF3333] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#FFE735] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="sticky top-0 z-30 backdrop-blur-xl bg-black border-b border-white/10">
                <div className="flex items-center justify-center h-20 px-6">
                    <p className="text-white/60 text-sm font-light">No categories available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-black border-b border-white/10 shadow-2xl pt-16">
            <div className="flex items-stretch justify-center gap-1 px-6 h-20">
                {categories.map((item, idx) => {
                    const isOpen = openCategory === item.name;
                    const accentColors = ['#4C9AFF', '#FF3333', '#FFE735', '#F594FE'];
                    const accentColor = accentColors[idx % accentColors.length];

                    return (
                        <div
                            key={item.name}
                            className="relative group"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* HEADER BUTTON */}
                            <button
                                type="button"
                                onClick={() => handleShowMenuItems(item.name)}
                                className="relative flex items-center justify-between w-44 h-20 px-6 text-sm font-medium text-white/90 hover:text-white transition-all duration-300 overflow-hidden"
                            >
                                {/* Hover background effect */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, ${accentColor}15 0%, transparent 100%)`
                                    }}
                                ></div>

                                {/* Active indicator line */}
                                <div
                                    className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${isOpen ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`}
                                    style={{ backgroundColor: accentColor }}
                                ></div>

                                <span className="relative z-10 tracking-wider uppercase text-xs font-semibold">
                                    {item.name}
                                </span>

                                <MdArrowDropDown
                                    className={`relative z-10 h-5 w-5 transition-all duration-500 ${isOpen ? "rotate-180" : "rotate-0"
                                        }`}
                                    style={{ color: isOpen ? accentColor : 'currentColor' }}
                                />
                            </button>

                            {/* DROPDOWN MENU */}
                            <div
                                className={`absolute left-0 top-full w-64 bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-out ${isOpen
                                    ? 'opacity-100 translate-y-2 '
                                    : 'opacity-0 -translate-y-4 pointer-events-none max-h-0'
                                    }`}
                                style={{
                                    borderTopColor: accentColor,
                                    borderTopWidth: '10px'
                                }}
                            >
                                <div className="p-4 space-y-1 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                    {item.values.map((v, vIdx) => {
                                        const isChecked = searchParams.getAll(item.name).includes(v);

                                        return (
                                            <label
                                                key={v}
                                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer group/item"
                                                style={{
                                                    animationDelay: `${vIdx * 50}ms`
                                                }}
                                            >
                                                {/* Custom Checkbox */}
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="peer sr-only"
                                                        checked={isChecked}
                                                        onChange={(e) => filterForCategory(e, item, v)}
                                                    />
                                                    <div
                                                        className="w-5 h-5 border-2 border-white/30 rounded transition-all duration-300 peer-checked:border-0"
                                                        style={{
                                                            backgroundColor: isChecked ? accentColor : 'transparent'
                                                        }}
                                                    >
                                                        {isChecked && (
                                                            <svg
                                                                className="w-full h-full text-black p-0.5"
                                                                fill="none"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="3"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path d="M5 13l4 4L19 7"></path>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                <span className="relative group-hover/item:translate-x-0.5 transition-transform duration-200">
                                                    {v}
                                                </span>

                                                {/* Active pill indicator */}
                                                {isChecked && (
                                                    <div
                                                        className="ml-auto w-1.5 h-1.5 rounded-full"
                                                        style={{ backgroundColor: accentColor }}
                                                    ></div>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}