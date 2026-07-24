'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { API_URL } from '../../lib/api';
import {
  Award,
  Boxes,
  CalendarPlus,
  CheckCircle,
  Lock,
  LogIn,
  LogOut,
  Package,
  PackagePlus,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

type VendorUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ListingMode = 'product' | 'rental' | 'professional';

const initialProduct = {
  name: '',
  category: 'lighting',
  price: '',
  brand: '',
  stock: '10',
  image: '',
  description: '',
};

const initialRental = {
  item_name: '',
  category: 'lighting',
  daily_rate: '',
  image: '',
  location: 'Lagos, Nigeria',
};

const initialProfessional = {
  name: '',
  role: '',
  hourly_rate: '',
  avatar: '',
};

export default function VendorDashboardPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeMode, setActiveMode] = useState<ListingMode>('product');
  const [user, setUser] = useState<VendorUser | null>(null);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'vendor',
  });
  const [productForm, setProductForm] = useState(initialProduct);
  const [rentalForm, setRentalForm] = useState(initialRental);
  const [professionalForm, setProfessionalForm] = useState(initialProfessional);

  useEffect(() => {
    const savedToken = window.localStorage.getItem('womb_vendor_token');
    const savedUser = window.localStorage.getItem('womb_vendor_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveSession = (nextToken: string, nextUser: VendorUser) => {
    window.localStorage.setItem('womb_vendor_token', nextToken);
    window.localStorage.setItem('womb_vendor_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    window.localStorage.removeItem('womb_vendor_token');
    window.localStorage.removeItem('womb_vendor_user');
    setToken('');
    setUser(null);
    setStatus('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    const payload = authMode === 'register'
      ? authForm
      : { email: authForm.email, password: authForm.password };

    const res = await fetch(`${API_URL}/api/auth/${authMode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Authentication failed.');
      return;
    }

    saveSession(data.token, data.user);
    setStatus(authMode === 'register' ? 'Vendor account created.' : 'Logged in.');
  };

  const postVendorResource = async (path: string, payload: Record<string, string | number>) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Publish failed.');
    }
    return data;
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postVendorResource('/api/products', {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      });
      setProductForm(initialProduct);
      setStatus('Marketplace product published.');
    } catch (error: any) {
      setStatus(error.message);
    }
  };

  const handleRentalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postVendorResource('/api/rentals', {
        ...rentalForm,
        daily_rate: Number(rentalForm.daily_rate),
      });
      setRentalForm(initialRental);
      setStatus('Rental listing published.');
    } catch (error: any) {
      setStatus(error.message);
    }
  };

  const handleProfessionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postVendorResource('/api/professionals', {
        ...professionalForm,
        hourly_rate: Number(professionalForm.hourly_rate),
      });
      setProfessionalForm(initialProfessional);
      setStatus('Professional profile published.');
    } catch (error: any) {
      setStatus(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07070c] text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-womb-cyan" />
              Vendor Storefront & Inventory Portal
            </h1>
            <p className="text-sm text-slate-400">
              Sell equipment, publish rental stock, and register as a vetted stage professional.
            </p>
          </div>

          {user ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-womb-emerald/20 text-womb-emerald border border-womb-emerald/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                {user.name} - {user.role}
              </span>
              <button
                onClick={clearSession}
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="px-3 py-1 rounded-full bg-womb-amber/15 text-womb-amber border border-womb-amber/30 text-xs font-bold flex items-center gap-1.5 w-fit">
              <Lock className="w-4 h-4" />
              Vendor login required
            </span>
          )}
        </div>

        {!user ? (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 items-start">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel rounded-lg p-5 border-l-4 border-womb-cyan">
                  <Boxes className="w-5 h-5 text-womb-cyan mb-3" />
                  <div className="text-sm font-bold">Marketplace sales</div>
                  <div className="text-xs text-slate-400 mt-1">Publish equipment with price, brand, and stock.</div>
                </div>
                <div className="glass-panel rounded-lg p-5 border-l-4 border-womb-magenta">
                  <CalendarPlus className="w-5 h-5 text-womb-magenta mb-3" />
                  <div className="text-sm font-bold">Rental inventory</div>
                  <div className="text-xs text-slate-400 mt-1">List consoles, rigs, and daily hire items.</div>
                </div>
                <div className="glass-panel rounded-lg p-5 border-l-4 border-womb-amber">
                  <Award className="w-5 h-5 text-womb-amber mb-3" />
                  <div className="text-sm font-bold">Pro profile</div>
                  <div className="text-xs text-slate-400 mt-1">Register yourself as a hireable specialist.</div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6 border border-white/10">
              <div className="flex rounded-lg border border-white/10 bg-white/5 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 px-3 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 ${authMode === 'login' ? 'bg-womb-cyan text-womb-dark' : 'text-slate-300'}`}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 px-3 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 ${authMode === 'register' ? 'bg-womb-cyan text-womb-dark' : 'text-slate-300'}`}
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <input
                    type="text"
                    required
                    placeholder="Business or full name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white"
                  />
                )}
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white"
                />
                {authMode === 'register' && (
                  <select
                    value={authForm.role}
                    onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-womb-dark border border-white/10 text-sm text-white"
                  >
                    <option value="vendor">Vendor</option>
                    <option value="professional">Professional</option>
                  </select>
                )}
                <button type="submit" className="w-full px-4 py-3 rounded-lg bg-womb-cyan text-womb-dark font-black text-xs uppercase tracking-wider">
                  {authMode === 'register' ? 'Create Vendor Account' : 'Enter Vendor Portal'}
                </button>
                {status && <p className="text-xs text-womb-amber">{status}</p>}
              </form>
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'product', label: 'Sale Listing', icon: PackagePlus },
                { key: 'rental', label: 'Rental Listing', icon: CalendarPlus },
                { key: 'professional', label: 'Pro Profile', icon: ShieldCheck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveMode(item.key as ListingMode)}
                    className={`h-14 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 ${activeMode === item.key ? 'bg-white text-womb-dark border-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {status && (
              <div className="rounded-lg border border-womb-amber/30 bg-womb-amber/10 px-4 py-3 text-sm text-womb-amber">
                {status}
              </div>
            )}

            {activeMode === 'product' && (
              <VendorForm title="Publish Marketplace Equipment" icon={<PackagePlus className="w-5 h-5 text-womb-cyan" />} onSubmit={handleProductSubmit}>
                <Field label="Item title" value={productForm.name} onChange={(value) => setProductForm({ ...productForm, name: value })} placeholder="BeamX 350W BWS Moving Head" />
                <CategorySelect value={productForm.category} onChange={(value) => setProductForm({ ...productForm, category: value })} />
                <Field label="Price (NGN)" type="number" value={productForm.price} onChange={(value) => setProductForm({ ...productForm, price: value })} placeholder="450000" />
                <Field label="Stock" type="number" value={productForm.stock} onChange={(value) => setProductForm({ ...productForm, stock: value })} placeholder="10" />
                <Field label="Brand" value={productForm.brand} onChange={(value) => setProductForm({ ...productForm, brand: value })} placeholder="Chauvet Pro" />
                <Field label="Image URL" type="url" value={productForm.image} onChange={(value) => setProductForm({ ...productForm, image: value })} placeholder="https://images.unsplash.com/..." />
                <TextArea label="Specifications" value={productForm.description} onChange={(value) => setProductForm({ ...productForm, description: value })} />
              </VendorForm>
            )}

            {activeMode === 'rental' && (
              <VendorForm title="Publish Rental Equipment" icon={<CalendarPlus className="w-5 h-5 text-womb-magenta" />} onSubmit={handleRentalSubmit}>
                <Field label="Rental item" value={rentalForm.item_name} onChange={(value) => setRentalForm({ ...rentalForm, item_name: value })} placeholder="grandMA3 Light Console" />
                <CategorySelect value={rentalForm.category} onChange={(value) => setRentalForm({ ...rentalForm, category: value })} />
                <Field label="Daily rate (NGN)" type="number" value={rentalForm.daily_rate} onChange={(value) => setRentalForm({ ...rentalForm, daily_rate: value })} placeholder="150000" />
                <Field label="Location" value={rentalForm.location} onChange={(value) => setRentalForm({ ...rentalForm, location: value })} placeholder="Lagos, Nigeria" />
                <Field label="Image URL" type="url" value={rentalForm.image} onChange={(value) => setRentalForm({ ...rentalForm, image: value })} placeholder="https://images.unsplash.com/..." />
              </VendorForm>
            )}

            {activeMode === 'professional' && (
              <VendorForm title="Register as a Pro" icon={<Award className="w-5 h-5 text-womb-amber" />} onSubmit={handleProfessionalSubmit}>
                <Field label="Display name" value={professionalForm.name} onChange={(value) => setProfessionalForm({ ...professionalForm, name: value })} placeholder={user.name} />
                <Field label="Specialty" value={professionalForm.role} onChange={(value) => setProfessionalForm({ ...professionalForm, role: value })} placeholder="FOH Sound Engineer" />
                <Field label="Hourly rate (NGN)" type="number" value={professionalForm.hourly_rate} onChange={(value) => setProfessionalForm({ ...professionalForm, hourly_rate: value })} placeholder="40000" />
                <Field label="Profile photo URL" type="url" value={professionalForm.avatar} onChange={(value) => setProfessionalForm({ ...professionalForm, avatar: value })} placeholder="https://images.unsplash.com/..." />
              </VendorForm>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function VendorForm({ title, icon, onSubmit, children }: { title: string; icon: React.ReactNode; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode }) {
  return (
    <form onSubmit={onSubmit} className="glass-panel rounded-lg p-6 border border-white/10 space-y-5 max-w-4xl">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
      <button type="submit" className="px-6 py-3 rounded-lg bg-womb-cyan text-womb-dark font-black text-xs uppercase tracking-wider hover:bg-womb-cyan/90">
        Publish
      </button>
    </form>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="text-xs text-slate-300 block space-y-1">
      <span>{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-womb-cyan"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs text-slate-300 block space-y-1 sm:col-span-2">
      <span>{label}</span>
      <textarea
        rows={4}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Power, throw distance, included accessories, condition, warranty, and delivery notes."
        className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-womb-cyan"
      />
    </label>
  );
}

function CategorySelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs text-slate-300 block space-y-1">
      <span>Category</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg bg-womb-dark border border-white/10 text-sm text-white"
      >
        <option value="lighting">Stage Lighting</option>
        <option value="audio">Pro Audio & Line Arrays</option>
        <option value="lasers">Laser Systems</option>
        <option value="staging">Trussing & Staging</option>
      </select>
    </label>
  );
}
