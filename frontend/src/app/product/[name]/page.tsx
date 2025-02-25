import PriceHistoryChart from "../../../components/PriceHistoryChart";

import { API_URL } from "@/app/page";

interface Product {
  description: string | null;
  faction: string
  isOnlineOnly: boolean | null;
  lastUpdated: string;
  name: string;
  price: number;
  source: string;
  url: string;
}

export default async function ProductPage({ params }: { params: Promise<{ name: string }> }) {
  const name = decodeURIComponent((await params).name);

  const fetchProducts = async (productName: string): Promise<Product[]> => {
    try {
      const URL = `${API_URL}/search?query=${encodeURIComponent(productName)}`;
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error('Failed to fetch price history');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching price history:', error);
      return [];
    }
  };

  const products = await fetchProducts(name);

  if (!products) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gold-500">Price History for {decodeURIComponent(name)}</h1>
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          {products.length > 0 ? (
            <table className="w-full text-gray-300">
              <thead>
                <tr>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {products.map((entry, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-2">{entry.name}</td>
                    <td className="py-2">${entry.price.toFixed(2)}</td>
                    <td className="py-2">
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >{entry.source}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-300 text-center">No price history available for this product.</p>
          )}
        </div>
        <div className="mt-8">
          <PriceHistoryChart productName={name} />
        </div>
      </div>
    </div>
  );
}