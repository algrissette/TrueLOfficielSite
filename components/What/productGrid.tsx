import { ProductNode } from "@/app/util/datatypes";
import ImageCard from "./imageCard";

export default function ProductGrid({ products }: { products: ProductNode[] }) {
    console.log("starting product grid");
    console.log("product grid products", products);

    return (
        <div className="w-full bg-black py-10 px-6">
            <div className="flex font-edwardian text-8xl mb-10">
                <h1 className="text-white mx-auto "> The Collection</h1>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                    {products.map((product) => (
                        <ImageCard key={product.id} item={product} />
                    ))}
                </div>

                {/* Empty state */}
                {products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
}