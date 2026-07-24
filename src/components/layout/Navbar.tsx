'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Zap, User, Calendar, Briefcase, Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 bg-womb-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-womb-purple via-womb-magenta to-womb-cyan p-0.5 shadow-lg shadow-womb-cyan/20 group-hover:shadow-womb-cyan/50 transition-all duration-300">
              <div className="w-full h-full bg-womb-dark rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-womb-cyan group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-womb-cyan">
                WOMB
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-womb-magenta -mt-1 uppercase">
                Lighting & Stage Ecosystem
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search moving heads, line arrays, lasers, stage rigs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-womb-cyan/60 focus:ring-1 focus:ring-womb-cyan/60 transition-all"
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link href="/marketplace" className="text-slate-300 hover:text-womb-cyan transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-womb-cyan" />
              Marketplace
            </Link>
            <Link href="/rentals" className="text-slate-300 hover:text-womb-magenta transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-womb-magenta" />
              Rentals
            </Link>
            <Link href="/projects" className="text-slate-300 hover:text-womb-purple transition-colors flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-womb-purple" />
              Projects
            </Link>
            <Link href="/professionals" className="text-slate-300 hover:text-womb-amber transition-colors flex items-center gap-1.5">
              <User className="w-4 h-4 text-womb-amber" />
              Pros
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-womb-cyan" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-womb-magenta text-white text-[11px] font-bold flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Vendor Portal CTA */}
            <Link
              href="/vendor"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-womb-cyan to-womb-purple text-womb-dark font-bold text-xs tracking-wide hover:opacity-95 transition-opacity shadow-lg shadow-womb-cyan/25"
            >
              Vendor Portal
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-white/10 px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10"
          >
            Marketplace
          </Link>
          <Link
            href="/rentals"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10"
          >
            Equipment Rentals
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10"
          >
            Event Projects
          </Link>
          <Link
            href="/professionals"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10"
          >
            Hire Professionals
          </Link>
          <Link
            href="/vendor"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-womb-cyan to-womb-purple text-womb-dark font-bold text-xs"
          >
            Vendor Portal
          </Link>
        </div>
      )}
    </header>
  );
}
