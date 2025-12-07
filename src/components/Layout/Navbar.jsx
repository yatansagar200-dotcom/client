import React from 'react';
import { Link } from 'react-router-dom';
import karmaLogo from '../../assets/karma-logo.png';

export default function Navbar(){
  return (
    <nav className="site-navbar shadow fixed top-0 left-0 right-0 z-30">
      <div className="container flex items-center justify-between h-20 py-3">
        {/* Left: Logo */}
        <Link to="/" aria-label="Karma Studios home" className="flex items-center gap-2 flex-shrink-0">
          <img src={karmaLogo} alt="logo" className="h-8 md:h-10 object-contain" />
          <span className="hidden sm:inline font-semibold text-lg">Karma Studios</span>
        </Link>

        {/* Right: Nav Links */}
        <div className="flex items-center gap-x-4 md:gap-x-6 flex-shrink-0">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/admin/login" className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">Admin</Link>
        </div>
      </div>
    </nav>
  )
}
