import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const fetchTiles = (q = '') => axios.get(`${API_BASE}/api/tiles${q ? ('?q=' + encodeURIComponent(q)) : ''}`);
// Let the browser/axios set the Content-Type for FormData (including boundary).
export const addTile = (formData, token) => axios.post(`${API_BASE}/api/tiles`, formData, { headers: { Authorization: 'Bearer ' + token }});
export const updateTile = (id, formData, token) => axios.put(`${API_BASE}/api/tiles/` + id, formData, { headers: { Authorization: 'Bearer ' + token }});
export const deleteTile = (id, token) => axios.delete(`${API_BASE}/api/tiles/` + id, { headers: { Authorization: 'Bearer ' + token }});
