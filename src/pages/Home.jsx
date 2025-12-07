import React, { useEffect, useState } from 'react';
import { fetchTiles } from '../api/tiles';
import TileCard from '../components/TileCard';

export default function Home(){
  const [tiles, setTiles] = useState([]);
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  const load = async (search='', sort='newest') => {
    try {
      const res = await fetchTiles(search);
      let sorted = res.data;
      if (sort === 'price-low') sorted = sorted.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') sorted = sorted.sort((a, b) => b.price - a.price);
      else if (sort === 'name') sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
      setTiles(sorted);
    } catch (err) { console.error(err) }
    finally { setLoading(false); }
  };

  useEffect(()=> { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(q, sortBy);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    load(q, e.target.value);
  };

  return (
    <div>
      {/* Hero section */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 flex flex-col items-center text-center gap-4 hero-cta">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold">Beautiful Tiles For Every Space</h1>
          <p className="mt-2 text-gray-600">Browse a curated selection of premium tiles — quality, style and durability combined.</p>
          <div className="mt-6">
            <a href="#tiles-grid" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Shop Tiles
            </a>
          </div>
        </div>
      </div>

      {/* Search and Sort Bar */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
              placeholder="Search by name or brand..." 
              className="px-4 py-2 border rounded-l-md flex-1 md:flex-none"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">Search</button>
          </form>
          <select 
            value={sortBy} 
            onChange={handleSort}
            className="px-4 py-2 border rounded-md"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Tiles Grid */}
      <div id="tiles-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 min-h-[180px]" role="status" aria-live="polite">
            <svg className="animate-spin h-12 w-12 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="4"></circle>
              <path className="opacity-75" fill="#2563eb" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <p className="text-gray-600 text-lg">Loading tiles...</p>
          </div>
        ) : tiles.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-gray-500 text-lg">No tiles found</p>
          </div>
        ) : (
          tiles.map(t => <TileCard key={t._id} tile={t} />)
        )}
      </div>
    </div>
  )
}
