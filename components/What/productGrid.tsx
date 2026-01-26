import { ProductNode } from "@/app/util/datatypes";
import ImageCard from "./imageCard";


export default function ProductGrid(
    { products }: { products: ProductNode[] }
) {
    console.log("starting product grid")
    console.log("product grid products", products)
    return (
        <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
                <ImageCard key={product.id} item={product} />
            ))}
        </div>
    );
}
