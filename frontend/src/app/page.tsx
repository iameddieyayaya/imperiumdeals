import SearchBar from '@/app/components/SearchBar';

interface Product {
  name: string;
  price: number;
  url: string;
  source: string;
  lastUpdated: string;
}

interface TrendingProduct {
  name: string;
  priceChange: string; // e.g., "+5%", "-10%"
}

interface PriceDrop {
  name: string;
  oldPrice: number;
  newPrice: number;
}

export default function HomePage() {
  const mostTrackedProducts: Product[] = [
    { name: 'Tyranids Hive Tyrant', price: 53.12, url: 'https://wargameportal.com', source: 'Wargame Portal', lastUpdated: '2025-01-07' },
    { name: 'Space Marines Combat Patrol', price: 149.99, url: 'https://amazon.com', source: 'Amazon', lastUpdated: '2025-02-18' },
    { name: 'Necrons Monolith', price: 120.0, url: 'https://gamesworkshop.com', source: 'Games Workshop', lastUpdated: '2025-02-17' },
  ];

  const trendingProducts: TrendingProduct[] = [
    { name: 'Tyranids Hormagaunts', priceChange: '+5%' },
    { name: 'Adeptus Custodes Shield Captain', priceChange: '-10%' },
    { name: 'Ork Boyz', priceChange: '+3%' },
  ];

  const latestPriceDrops: PriceDrop[] = [
    { name: 'Tyranids Hive Tyrant', oldPrice: 60.0, newPrice: 53.12 },
    { name: 'Space Marines Combat Patrol', oldPrice: 159.99, newPrice: 149.99 },
    { name: 'Necrons Monolith', oldPrice: 130.0, newPrice: 120.0 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gold-500">Warhammer 40k Price Tracker</h1>

        {/* Search Bar */}
        <SearchBar />

        {/* Most Tracked Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gold-500">Most Tracked Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostTrackedProducts.map((product, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 text-gold-500">{product.name}</h3>
                <p className="text-gray-300">Price: <span className="text-gold-500">${product.price.toFixed(2)}</span></p>
                <p className="text-gray-300">Source: <span className="text-gold-500">{product.source}</span></p>
                <p className="text-gray-300">Last Updated: <span className="text-gold-500">{new Date(product.lastUpdated).toLocaleDateString()}</span></p>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-steel-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-steel-blue-600 transition-colors"
                >
                  View Product
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gold-500">Trending Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 text-gold-500">{product.name}</h3>
                <p className={`text-gray-300 ${product.priceChange.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                  Price Change: {product.priceChange}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Price Drops Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gold-500">Latest Price Drops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPriceDrops.map((product, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 text-gold-500">{product.name}</h3>
                <p className="text-gray-300 line-through">Old Price: <span className="text-red-500">${product.oldPrice.toFixed(2)}</span></p>
                <p className="text-green-500 font-semibold">New Price: ${product.newPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}