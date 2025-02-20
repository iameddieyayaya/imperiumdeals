import { TrendingProduct } from "../app/page";

export const TrendingProductCard = ({ product }: { product: TrendingProduct }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2 text-gold-500">{product.name}</h3>
      <p className={`text-gray-300 ${product?.priceChange?.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
        Price Change: {product?.priceChange}
      </p>
    </div>
  )
}