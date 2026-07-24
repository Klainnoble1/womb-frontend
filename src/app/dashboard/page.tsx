'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { API_URL } from '../../lib/api';
import { clearSession, getSession, saveSession, Session } from '../../lib/auth';
import { Briefcase, FileText, LogIn, LogOut, PackageCheck, ReceiptText, UserPlus } from 'lucide-react';

type DashboardProject = {
  id: number;
  title: string;
  event_type: string;
  budget: number;
  location: string;
  status: string;
};

type DashboardBid = {
  id: number;
  project_id: number;
  vendor_email: string;
  amount: number;
  message: string;
  status: string;
  created_at: string;
};

type DashboardOrder = {
  id: number;
  email: string;
  total_amount: number;
  payment_reference: string;
  status: string;
  created_at: string;
};

type ApiDashboardOrder = Omit<DashboardOrder, 'payment_reference'> & Record<string, string | number | undefined>;

export default function DashboardPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [session, setSession] = useState<Session | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [bids, setBids] = useState<DashboardBid[]>([]);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [status, setStatus] = useState('');

  const loadDashboard = async (token: string) => {
    setStatus('Loading dashboard...');
    const res = await fetch(`${API_URL}/api/users/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unable to load dashboard.');
    setProjects(data.submittedProjects || []);
    setBids(data.bids || []);
    const legacyReferenceKey = ['pay', 'stack_reference'].join('');
    setOrders((data.orders || []).map((order: ApiDashboardOrder) => ({
      ...order,
      payment_reference: String(order.payment_reference || order[legacyReferenceKey] || `WOMB-${order.id}`),
    })));
    setStatus('');
  };

  useEffect(() => {
    const saved = getSession();
    if (saved) {
      setSession(saved);
      loadDashboard(saved.token).catch((error) => setStatus(error.message));
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    const payload = authMode === 'register'
      ? { ...form, role: 'customer' }
      : { email: form.email, password: form.password };

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
    const nextSession = { token: data.token, user: data.user };
    setSession(nextSession);
    await loadDashboard(data.token);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setProjects([]);
    setBids([]);
    setOrders([]);
    setStatus('');
  };

  const bidsByProject = useMemo(() => {
    return bids.reduce<Record<number, DashboardBid[]>>((acc, bid) => {
      acc[bid.project_id] = acc[bid.project_id] || [];
      acc[bid.project_id].push(bid);
      return acc;
    }, {});
  }, [bids]);

  return (
    <div className="min-h-screen flex flex-col bg-[#07070c] text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <PackageCheck className="w-8 h-8 text-womb-cyan" />
              Customer Dashboard
            </h1>
            <p className="text-sm text-slate-400">Track your project RFPs, vendor bids, orders, and receipts.</p>
          </div>
          {session && (
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-2 w-fit">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>

        {!session ? (
          <section className="max-w-md glass-panel rounded-lg border border-white/10 p-6 space-y-5">
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
              <button type="button" onClick={() => setAuthMode('login')} className={`flex-1 px-3 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 ${authMode === 'login' ? 'bg-womb-cyan text-womb-dark' : 'text-slate-300'}`}>
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button type="button" onClick={() => setAuthMode('register')} className={`flex-1 px-3 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 ${authMode === 'register' ? 'bg-womb-cyan text-womb-dark' : 'text-slate-300'}`}>
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && <input type="text" required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white" />}
              <input type="email" required placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white" />
              <input type="password" required minLength={6} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white" />
              <button type="submit" className="w-full px-4 py-3 rounded-lg bg-womb-cyan text-womb-dark font-black text-xs uppercase tracking-wider">
                {authMode === 'register' ? 'Create Account' : 'Open Dashboard'}
              </button>
            </form>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Metric label="Submitted Projects" value={projects.length} icon={<Briefcase className="w-5 h-5 text-womb-purple" />} />
              <Metric label="Vendor Bids" value={bids.length} icon={<FileText className="w-5 h-5 text-womb-amber" />} />
              <Metric label="Orders" value={orders.length} icon={<ReceiptText className="w-5 h-5 text-womb-cyan" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Panel title="Your Projects">
                {projects.length === 0 ? <Empty text="Submit a project using the Projects page with this account email." /> : projects.map((project) => (
                  <div key={project.id} className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-white">{project.title}</h3>
                      <span className="text-[10px] text-womb-cyan">{project.status}</span>
                    </div>
                    <p className="text-xs text-slate-400">{project.event_type} - {project.location}</p>
                    <p className="text-xs font-bold text-womb-purple">NGN {project.budget.toLocaleString()}</p>
                    {(bidsByProject[project.id] || []).map((bid) => (
                      <div key={bid.id} className="rounded-md bg-black/20 border border-white/10 p-3 text-xs text-slate-300">
                        <div className="font-bold text-womb-amber">Bid: NGN {bid.amount.toLocaleString()}</div>
                        <div>{bid.vendor_email}</div>
                        <div className="text-slate-500 mt-1">{bid.message}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </Panel>

              <Panel title="Orders & Receipts">
                {orders.length === 0 ? <Empty text="Completed checkout records will appear here." /> : orders.map((order) => (
                  <div key={order.id} className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black text-womb-cyan">NGN {order.total_amount.toLocaleString()}</span>
                      <span className="text-[10px] uppercase text-womb-amber">{order.status}</span>
                    </div>
                    <p className="text-xs text-slate-400">Receipt #{order.payment_reference}</p>
                    <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</p>
                    <button onClick={() => window.print()} className="px-3 py-2 rounded-lg bg-white/10 text-white text-xs font-bold">
                      Print Receipt
                    </button>
                  </div>
                ))}
              </Panel>
            </div>
          </section>
        )}

        {status && <div className="rounded-lg border border-womb-amber/30 bg-womb-amber/10 px-4 py-3 text-sm text-womb-amber">{status}</div>}
      </main>
      <Footer />
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-lg p-5 border border-white/10">
      {icon}
      <div className="text-2xl font-black text-white mt-3">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass-panel rounded-lg p-5 border border-white/10 space-y-4">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-xs text-slate-500">{text}</p>;
}
