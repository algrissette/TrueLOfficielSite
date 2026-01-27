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
    const router = useRouter();                 // ✅ top level


    const [products, setProducts] = useState<ProductNode[]>([]);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const { params } = useParams()




    // Toggle dropdown
    const handleShowMenuItems = (name: string) => {
        console.log("Toggling category:", name); // log which category is toggled
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

        // Push **only the query string** relative to the current route
        router.push(`?${urlParams.toString()}`);
    }




    useEffect(() => {
        console.log("CategorySideBar mounted"); // log on mount
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get<ProductNode[]>("/products/getAllProducts");
                console.log("API returned data:", data); // log API response

                // Safely map edges to nodes

                const nodes = data
                console.log("Mapped product nodes:", nodes); // log nodes
                setProducts(nodes);

                // Build categories safely
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

                // Sort categories and values alphabetically
                optionsList.sort((a, b) => a.name.localeCompare(b.name));
                optionsList.forEach(option => option.values.sort((a, b) => a.localeCompare(b)));

                console.log("Final categories:", optionsList); // log sorted categories
                setCategories(optionsList);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();



    }, []);



    console.log("Rendering CategorySideBar, products:", products); // log products on every render
    console.log("Rendering CategorySideBar, categories:", categories); // log categories on every render

    if (loading) {
        return <div className="w-full p-4">Loading categories...</div>;
    }

    if (categories.length === 0) {
        return <div className="w-full p-4">No categories available</div>;
    }

    return (
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 pt-10">
            <div className="flex items-stretch justify-center gap-6 px-6 h-14">
                {categories.map(item => (
                    <div key={item.name} className="relative">
                        {/* HEADER */}
                        <button
                            type="button"
                            onClick={() => handleShowMenuItems(item.name)}
                            className="flex items-center justify-between w-40 h-14 px-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                        >
                            <span>{item.name}</span>
                            <MdArrowDropDown
                                className={`h-5 w-5 transition-transform ${openCategory === item.name ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* DROPDOWN */}
                        {openCategory === item.name && (
                            <div className="absolute left-0 top-full mt-0 w-full  border border-gray-200 bg-white shadow-lg p-3 space-y-2">
                                {item.values.map(v => (
                                    <label
                                        key={v}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300"
                                            checked={searchParams.getAll(item.name).includes(v)}
                                            onChange={(e) => filterForCategory(e, item, v)}
                                        />
                                        {v}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );


}
