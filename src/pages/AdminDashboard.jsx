import React, { useEffect, useState } from 'react';
import { fetchTiles, addTile, updateTile, deleteTile } from '../api/tiles';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const nav = useNavigate();
  const token = localStorage.getItem('karma_token');
  const [tiles, setTiles] = useState([]);
  const [q, setQ] = useState('');

  useEffect(()=> {
    if(!token) nav('/admin/login');
    load();
  }, []);

  const load = async (search='') => {
    const res = await fetchTiles(search);
    setTiles(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    await addTile(fd, token);
    form.reset();
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete tile?')) return;
    await deleteTile(id, token);
    load();
  };

  const handleEdit = async (id) => {
    const name = prompt('New name');
    if (!name) return;
    const price = prompt('New price (number)');
    if (price === null) return;
    await updateTile(id, JSON.stringify({ name, price }), token).catch(async ()=>{
      // If server expects form-data, send as form
      const fd = new FormData();
      fd.append('name', name);
      fd.append('price', price);
      await updateTile(id, fd, token);
    });
    load();
  };

  const logout = () => { localStorage.removeItem('karma_token'); nav('/'); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <div>
          <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="px-3 py-2 border rounded mr-2"/>
          <button onClick={()=>load(q)} className="px-3 py-2 bg-blue-600 text-white rounded mr-2">Search</button>
          <button onClick={logout} className="px-3 py-2 bg-red-500 text-white rounded">Logout</button>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold mb-2">Add Tile</h3>
        <form onSubmit={handleAdd} className="flex gap-2 flex-wrap">
          <input name="name" placeholder="Name" required className="px-3 py-2 border rounded"/>
          <input name="price" placeholder="Price (INR)" required className="px-3 py-2 border rounded"/>
          <input name="size" placeholder="Size" className="px-3 py-2 border rounded"/>
          <input name="surface" placeholder="Surface" className="px-3 py-2 border rounded"/>
          <input name="brand" placeholder="Brand" className="px-3 py-2 border rounded"/>
          <input type="file" name="image" accept="image/*" className="px-3 py-2 border rounded"/>
          <button className="px-3 py-2 bg-green-600 text-white rounded">Add</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiles.map(t => (
          <div key={t._id} className="card">
            <div className="h-40 bg-gray-100 mb-2 flex items-center justify-center">
              {t.imageUrl ? <img src={t.imageUrl} className="h-full object-cover" /> : <span className="text-gray-400">No image</span>}
            </div>
            <h4 className="font-semibold">{t.name}</h4>
            <p className="text-sm">{t.brand} • {t.size}</p>
            <p className="font-bold">₹{t.price}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={()=>handleEdit(t._id)} className="px-2 py-1 bg-yellow-500 rounded">Edit</button>
              <button onClick={()=>handleDelete(t._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
