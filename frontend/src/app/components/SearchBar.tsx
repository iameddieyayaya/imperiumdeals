'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-12">
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-l-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-gold-500 text-gray-900 rounded-r-lg hover:bg-gold-600 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}