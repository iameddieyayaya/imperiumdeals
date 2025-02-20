import { PriceDrop } from '../app/page'

export const PriceDropCard = ({ product }: { product: PriceDrop }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2 text-gold-500">{product.name}</h3>
      <p className="text-gray-300 line-through">Old Price: <span className="text-red-500">${product.oldPrice.toFixed(2)}</span></p>
      <p className="text-green-500 font-semibold">New Price: ${product.newPrice.toFixed(2)}</p>
    </div>
  )
}