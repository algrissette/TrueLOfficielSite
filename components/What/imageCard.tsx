import { ProductNode } from "@/app/util/datatypes";
import Link from "next/link";

export default function ImageCard({ item }: { item: ProductNode }) {
    // Grab the first variant (or adjust to whichever variant you want to show)
    const firstVariant = item.variants.edges[0]?.node;

    if (!firstVariant || !firstVariant.image?.url) return null;

    const imageUrl = firstVariant.image.url;
    const variantId = encodeURIComponent(firstVariant.id); // Shopify GID
    const productId = encodeURIComponent(item.id); // Parent product GID
    console.log(productId)

    return (
        <div className="relative w-full overflow-hidden rounded-lg group cursor-pointer">
            <Link
                href={`/Items/item?productId=${productId}&variantId=${variantId}`}
                className="block"
            >
                {/* IMAGE */}
                <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />

                {/* OVERLAY ON HOVER */}
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white text-lg font-semibold drop-shadow-md">
                        {item.title}
                    </h3>

                    <span className="mt-2 inline-block text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-gray-200">
                        View Product →
                    </span>
                </div>

                {/* SUBTLE SHADOW ON HOVER */}
                <div className="absolute inset-0 pointer-events-none group-hover:shadow-xl rounded-lg transition-shadow duration-300"></div>
            </Link>
        </div>
    );
}
