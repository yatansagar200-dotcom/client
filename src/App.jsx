import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Layout/Navbar';

export default function App(){
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <div className="container py-6">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/about" element={<About/>} />
              <Route path="/contact" element={<Contact/>} />
              <Route path="/admin/login" element={<AdminLogin/>} />
              <Route path="/admin/dashboard" element={<AdminDashboard/>} />
            </Routes>
          </div>
        </div>
      </main>
    </>
  )
}
