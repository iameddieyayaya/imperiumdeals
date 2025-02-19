import SearchBar from '@/app/components/SearchBar';
import { ProductCard } from '@/app/components/ProductCard';
import { PriceDropCard } from './components/PriceDropCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  name: string;
  price: number;
  url: string;
  source: string;
  lastUpdated: string;
}

export interface TrendingProduct {
  name: string;
  priceChange: string; // e.g., "+5%", "-10%"
} //TODO: Implement TrendingProduct component

export interface PriceDrop {
  name: string;
  oldPrice: number;
  newPrice: number;
}

export default async function HomePage() {
  const mostTrackedProductsData = await fetch(`${API_URL}/products/most-tracked`)
  const mostTrackedProducts: Product[] = await mostTrackedProductsData.json()

  const latestPriceDropsData = await fetch(`${API_URL}/products/price-drops`)
  const latestPriceDrops: PriceDrop[] = await latestPriceDropsData.json()

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gold-500">Warhammer 40k Price Tracker</h1>

        <SearchBar />

        {/* Most Tracked Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gold-500">Most Tracked Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostTrackedProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </section>

        {/* Latest Price Drops */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gold-500">Latest Price Drops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPriceDrops.map((product, index) => (
              <PriceDropCard key={index} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

