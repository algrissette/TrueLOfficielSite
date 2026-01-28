import { ProductNode } from "@/app/util/datatypes";
import Link from "next/link";

export default function ImageCard({ item }: { item: ProductNode }) {
    const firstVariant = item.variants.edges[0]?.node;
    if (!firstVariant || !firstVariant.image?.url) return null;

    const imageUrl = firstVariant.image.url;

    // Extract numeric IDs from Shopify GIDs
    const variantId = encodeURIComponent(firstVariant.id.split("/").pop() || "");
    const productId = encodeURIComponent(item.id.split("/").pop() || "");

    return (
        <Link
            href={`/Items/item?productId=${productId}&variantId=${variantId}`}
            className="group block"
        >
            {/* Image container */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-4 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Corner accent - subtle design touch */}
                <div className="absolute top-3 right-3 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 right-0 w-3 h-0.5 bg-white/80"></div>
                    <div className="absolute top-0 right-0 w-0.5 h-3 bg-white/80"></div>
                </div>
            </div>

            {/* Product info */}
            <div className="space-y-2">
                {/* Title with more emphasis */}
                <h3 className="text-base font-semibold text-white line-clamp-2 tracking-tight group-hover:text-[#F594FE] transition-colors duration-200">
                    {item.title}
                </h3>

                {/* Divider line - subtle design element */}
                <div className="w-12 h-0.5 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:w-16"></div>

                {/* View product link - appears on hover */}
                <span className="inline-flex items-center text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                    View details
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5l7 7-7 7"></path>
                    </svg>
                </span>
            </div>
        </Link>
    );
}