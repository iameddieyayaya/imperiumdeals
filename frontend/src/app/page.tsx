import SearchBar from '@components/SearchBar';
import { ProductCard } from '@components/ProductCard';
import { PriceDropCard } from '@components/PriceDropCard';
import { API_URL } from '../../config';
import ImperiumSVG from '../../assets/imperium.svg';

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
  const mostTrackedProductsData = await fetch(`${API_URL}/products/most-tracked`);
  const mostTrackedProducts: Product[] = await mostTrackedProductsData.json();

  const latestPriceDropsData = await fetch(`${API_URL}/products/price-drops`);
  const latestPriceDrops: PriceDrop[] = await latestPriceDropsData.json();

  if (!mostTrackedProducts || !latestPriceDrops) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <a
        href="https://buymeacoffee.com/eddieegomet"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 rounded-full p-2 shadow-lg "
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          className="h-12 w-auto hover:transform hover:scale-110 transition-transform"
        />
      </a>
      <div className="container mx-auto px-4">
        <div className='text-center mb-4'>
          <div className='flex justify-center items-center'>
            <h1 className="text-3xl font-bold text-gold-500">Imperium Deals</h1>
            <ImperiumSVG className="w-20 invert brightness-150 contrast-125" />
          </div>
        </div>

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

      {/* GitHub Link */}
      <a
        href="https://github.com/iameddieyayaya/imperiumdeals"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.547 1.377.203 2.394.1 2.647.64.699 1.026 1.592 1.026 2.683 0 3.842-2.338 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
          />
        </svg>
      </a>
    </div>
  );
}