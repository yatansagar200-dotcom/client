import React, { useEffect, useState } from 'react';
import { fetchTiles, addTile, updateTile, deleteTile } from '../api/tiles';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const nav = useNavigate();
  const token = localStorage.getItem('karma_token');
  const [tiles, setTiles] = useState([]);
  const [q, setQ] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notify, setNotify] = useState({ type: '', msg: '' });

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
    setSubmitting(true);
    try {
      await addTile(fd, token);
      form.reset();
      await load();
      setNotify({ type: 'success', msg: 'Tile added successfully' });
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || err.message || 'Failed to add tile';
      setNotify({ type: 'error', msg: message });
    } finally {
      setSubmitting(false);
      // auto-dismiss notification
      setTimeout(() => setNotify({ type: '', msg: '' }), 3500);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete tile?')) return;
    await deleteTile(id, token);
    load();
  };

  const handleEdit = async (id) => {
    // legacy: unused (replaced by modal-based edit)
    return;
  };

  // Modal-based edit state & handlers
  const [editingTile, setEditingTile] = useState(null);
  const [editingSubmitting, setEditingSubmitting] = useState(false);

  const openEdit = (tile) => {
    setEditingTile({ ...tile });
  };

  const closeEdit = () => {
    setEditingTile(null);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (!editingTile) return;
    if (name === 'image') {
      setEditingTile({ ...editingTile, imageFile: files && files[0] });
    } else {
      setEditingTile({ ...editingTile, [name]: value });
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingTile) return;
    setEditingSubmitting(true);
    try {
      const { _id, name, price, size, surface, brand, imageFile } = editingTile;
      if (imageFile) {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('price', price);
        if (size) fd.append('size', size);
        if (surface) fd.append('surface', surface);
        if (brand) fd.append('brand', brand);
        fd.append('image', imageFile);
        await updateTile(_id, fd, token);
      } else {
        await updateTile(_id, { name, price: Number(price), size, surface, brand }, token);
      }
      await load();
      closeEdit();
    } catch (err) {
      console.error('submitEdit error', err);
      alert(err?.response?.data?.message || 'Failed to update tile');
    } finally {
      setEditingSubmitting(false);
    }
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
        {notify.msg && (
          <div className={`mb-3 p-3 rounded ${notify.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {notify.msg}
          </div>
        )}

        <form onSubmit={handleAdd} className="flex gap-2 flex-wrap">
          <input name="name" placeholder="Name" required className="px-3 py-2 border rounded"/>
          <input name="price" placeholder="Price (INR)" required className="px-3 py-2 border rounded"/>
          <input name="size" placeholder="Size" className="px-3 py-2 border rounded"/>
          <input name="surface" placeholder="Surface" className="px-3 py-2 border rounded"/>
          <input name="brand" placeholder="Brand" className="px-3 py-2 border rounded"/>
          <input type="file" name="image" accept="image/*" className="px-3 py-2 border rounded"/>
          <button
            type="submit"
            disabled={submitting}
            className={`px-3 py-2 bg-green-600 text-white rounded transition transform focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-center ${submitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Adding...
              </>
            ) : (
              'Add'
            )}
          </button>
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
              <button onClick={()=>openEdit(t)} className="px-2 py-1 bg-yellow-500 rounded">Edit</button>
              <button onClick={()=>handleDelete(t._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-3">Edit Tile</h3>
            <form onSubmit={submitEdit} className="flex flex-col gap-3">
              <input name="name" value={editingTile.name || ''} onChange={handleEditChange} placeholder="Name" required className="px-3 py-2 border rounded"/>
              <input name="price" value={editingTile.price || ''} onChange={handleEditChange} placeholder="Price (INR)" required className="px-3 py-2 border rounded"/>
              <input name="size" value={editingTile.size || ''} onChange={handleEditChange} placeholder="Size" className="px-3 py-2 border rounded"/>
              <input name="surface" value={editingTile.surface || ''} onChange={handleEditChange} placeholder="Surface" className="px-3 py-2 border rounded"/>
              <input name="brand" value={editingTile.brand || ''} onChange={handleEditChange} placeholder="Brand" className="px-3 py-2 border rounded"/>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Change Image (optional)</label>
                <input type="file" name="image" accept="image/*" onChange={handleEditChange} className="px-3 py-2 border rounded"/>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={closeEdit} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" disabled={editingSubmitting} className={`px-3 py-2 bg-blue-600 text-white rounded ${editingSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
                  {editingSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
