import getDomainName from "@/helpers/getDomainName";
import { Product } from "../app/page";

export const ProductCard = ({ product }: { product: Product }) => {
  const formattedDate = new Date(product.lastUpdated).toLocaleDateString();
  const url = getDomainName(product.url);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2 text-gold-500">{product.name}</h3>
      <div className="text-gray-300">Price:
        <div className="text-gold-500">${product?.price?.toFixed(2)}</div>
      </div>
      <p className="text-gray-300">Source: <span className="text-gold-500">{url}</span></p>
      <p className="text-gray-300">Last Updated: <span className="text-gold-500">{formattedDate}</span></p>
      <a href={product.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-steel-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-steel-blue-600 transition-colors">
        View Product
      </a>
    </div>
  );
};