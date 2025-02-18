
interface PriceHistory {
  date: string;
  price: number;
}

export default async function ProductPage({ params }: { params: { name: string } }) {
  const { name } = await params;

  // Mock price history data
  const priceHistory: PriceHistory[] = [
    { date: '2025-01-01', price: 60.0 },
    { date: '2025-01-15', price: 55.0 },
    { date: '2025-02-01', price: 53.12 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gold-500">Price History for {decodeURIComponent(name)}</h1>
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <table className="w-full text-gray-300">
            <thead>
              <tr>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {priceHistory.map((entry, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="py-2">${entry.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}