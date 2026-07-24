'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Filter, Search, ShoppingCart, Star, Sparkles, Check } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  brand: string;
  description: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  const defaultProducts: Product[] = [
    {
      id: 1,
      name: 'BeamX 350W BWS Moving Head Light',
      category: 'lighting',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      brand: 'Chauvet Pro',
      description: 'Ultra-bright 350W hybrid moving head beam fixture for arena concerts.',
    },
    {
      id: 2,
      name: 'Acoustics K2 Dual 12" Line Array System',
      category: 'audio',
      price: 1850000,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      brand: 'L-Acoustics',
      description: 'Touring-grade line array speaker with long throw clarity.',
    },
    {
      id: 3,
      name: 'CyberLaser 20W RGB High Power Projector',
      category: 'lasers',
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      brand: 'Kvant',
      description: 'Full color 20W RGB diode laser with ILDA & FB4 control.',
    },
    {
      id: 4,
      name: 'ProTruss Aluminum Concert Stage System',
      category: 'staging',
      price: 3500000,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      brand: 'Global Truss',
      description: 'Heavy duty F34 aluminum square truss stage roof setup.',
    },
  ];

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(defaultProducts);
        }
      })
      .catch(() => setProducts(defaultProducts));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesBrand = selectedBrand === 'all' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesBrand && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#07070c] text-white">
      <Navbar cartCount={cart.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-womb-cyan" />
            Equipment & Stage Tech Marketplace
          </h1>
          <p className="text-sm text-slate-400">
            Browse verified touring-grade audio systems, stage lights, lasers, and trussing platforms.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter */}
          <div className="glass-panel rounded-2xl p-6 space-y-6 h-fit">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Filter className="w-4 h-4 text-womb-cyan" />
              Filter Equipment
            </h3>

            {/* Categories */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Category</label>
              <div className="space-y-1.5 text-xs">
                {['all', 'lighting', 'audio', 'lasers', 'staging'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium capitalize flex items-center justify-between transition-colors ${
                      selectedCategory === cat
                        ? 'bg-womb-cyan/20 text-womb-cyan border border-womb-cyan/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Search filter input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Search Gear</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="BeamX, Line Array..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-womb-cyan"
                />
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 text-sm">
                No equipment matching your selected filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 w-full bg-slate-900">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-womb-dark/80 backdrop-blur-md text-[10px] font-mono text-womb-cyan uppercase border border-womb-cyan/30">
                          {product.brand}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-1 text-womb-amber text-xs">
                          <Star className="w-3.5 h-3.5 fill-womb-amber text-womb-amber" />
                          <span className="font-bold text-white">4.9</span>
                        </div>
                        <h3 className="font-bold text-white text-base leading-snug line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
                        <span className="text-base font-black text-womb-cyan">₦{product.price.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => setCart((prev) => [...prev, product])}
                        className="px-3 py-1.5 rounded-lg bg-womb-cyan/10 hover:bg-womb-cyan text-womb-cyan hover:text-womb-dark border border-womb-cyan/30 transition-all text-xs font-bold flex items-center gap-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
