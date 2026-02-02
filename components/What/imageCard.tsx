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
            className="group block relative"
        >
            {/* Image container with border accent */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-black mb-6">
                {/* Decorative corner borders - fashion editorial style */}
                <div className="absolute inset-0 pointer-events-none z-10">
                    {/* Top left */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                    {/* Top right */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                    {/* Bottom left */}
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                    {/* Bottom right */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                </div>

                {/* Main image */}
                <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Vignette effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>

                {/* Floating accent line - appears on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </div>

            {/* Product info - minimal and sophisticated */}
            <div className="space-y-3">
                {/* Title - editorial typography */}
                <h3 className=" font-light text-lg tracking-[.2em] text-white uppercase line-clamp-1 group-hover:text-sky-500 transition-colors duration-300">
                    {item.title}
                </h3>

                {/* Subtle separator with animation */}
                <div className="flex items-center gap-3">
                    <div className="h-px w-0 group-hover:w-8 bg-gradient-to-r from-[#4C9AFF] to-[#F594FE] transition-all duration-500"></div>
                    <span className="text-xs text-white/50 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                        Explore
                    </span>
                </div>
            </div>

            {/* Hover overlay - subtle cosmic glow */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4C9AFF]/5 via-transparent to-[#F594FE]/5"></div>
            </div>
        </Link>
    );
}