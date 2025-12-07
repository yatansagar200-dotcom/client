import React from 'react';

export default function TileCard({ tile }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 transform transition hover:scale-105 hover:shadow-lg">
      <div className="h-48 w-full bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        {tile.imageUrl ? (
          <img src={tile.imageUrl} alt={tile.name} className="h-48 w-full object-cover rounded"/>
        ) : (
          <div className="text-gray-400">No Image</div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-lg truncate">{tile.name}</h3>
        <p className="text-sm text-gray-600">{tile.brand} • {tile.size} • {tile.surface}</p>
        <p className="mt-3 font-bold text-blue-700">₹{tile.price}</p>
      </div>
    </div>
  )
}
