import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export default function AdminLogin(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem('karma_token', res.data.token);
      nav('/admin/dashboard');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={handle} className="flex flex-col gap-3">
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="px-3 py-2 border rounded"/>
        <input required value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="px-3 py-2 border rounded"/>
        {err && <div className="text-red-600">{err}</div>}
        <button className="px-3 py-2 bg-green-600 text-white rounded">Login</button>
      </form>
    </div>
  )
}
