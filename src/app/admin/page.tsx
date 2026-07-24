'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { API_URL } from '../../lib/api';
import { clearSession, getSession, saveSession, Session } from '../../lib/auth';
import { Briefcase, Lock, LogIn, LogOut, Mail, Phone, ShieldCheck } from 'lucide-react';

type AdminProject = {
  id: number;
  title: string;
  event_type: string;
  budget: number;
  location: string;
  description: string;
  status: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
};

type ProjectBid = {
  id: number;
  project_id: number;
  vendor_id: number;
  vendor_email: string;
  amount: number;
  message: string;
  status: string;
  created_at: string;
};

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [bids, setBids] = useState<ProjectBid[]>([]);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('admin@womb.local');
  const [password, setPassword] = useState('');

  const loadAdminData = async (token: string) => {
    setStatus('Loading admin project desk...');
    const res = await fetch(`${API_URL}/api/projects/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Unable to load admin project desk.');
    }
    setProjects(data.projects || []);
    setBids(data.bids || []);
    setStatus('');
  };

  useEffect(() => {
    const saved = getSession();
    if (saved?.user.role === 'admin') {
      setSession(saved);
      loadAdminData(saved.token).catch((error) => setStatus(error.message));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Admin login failed.');
      return;
    }
    if (data.user.role !== 'admin') {
      setStatus('This account is not an admin.');
      return;
    }

    saveSession(data.token, data.user);
    const nextSession = { token: data.token, user: data.user };
    setSession(nextSession);
    await loadAdminData(data.token);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setProjects([]);
    setBids([]);
    setPassword('');
    setStatus('');
  };

  const bidsByProject = useMemo(() => {
    return bids.reduce<Record<number, ProjectBid[]>>((acc, bid) => {
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
              <ShieldCheck className="w-8 h-8 text-womb-emerald" />
              Admin Project Desk
            </h1>
            <p className="text-sm text-slate-400">Private submitter contacts and vendor bids require admin login.</p>
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
            <div className="flex items-center gap-2 text-sm font-bold text-womb-emerald">
              <Lock className="w-4 h-4" />
              Admin Login
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white" />
              <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white" />
              <button type="submit" className="w-full px-4 py-3 rounded-lg bg-womb-emerald text-womb-dark font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Enter Admin
              </button>
            </form>
          </section>
        ) : (
          <>
            <span className="px-3 py-1 rounded-full bg-womb-emerald/20 text-womb-emerald border border-womb-emerald/30 text-xs font-bold w-fit block">
              {projects.length} Projects / {bids.length} Bids
            </span>

            <div className="grid grid-cols-1 gap-5">
              {projects.map((project) => (
                <section key={project.id} className="glass-panel rounded-lg p-6 border border-white/10 space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-womb-purple/20 text-womb-purple text-xs font-bold border border-womb-purple/30">{project.event_type}</span>
                        <span className="text-xs font-mono text-womb-cyan bg-womb-cyan/10 px-2.5 py-1 rounded-full">{project.status}</span>
                      </div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-womb-purple" />
                        {project.title}
                      </h2>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
                      <p className="text-sm text-womb-cyan font-black">NGN {project.budget.toLocaleString()} - {project.location}</p>
                    </div>

                    <div className="rounded-lg bg-white/5 border border-white/10 p-4 min-w-full lg:min-w-80 space-y-2">
                      <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Private submitter contact</div>
                      <div className="text-sm font-bold text-white">{project.contact_name || 'Not provided'}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-womb-emerald" />
                        {project.contact_phone || 'No phone'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-womb-emerald" />
                        {project.contact_email || 'No email'}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <h3 className="text-sm font-bold text-white">Vendor Bids</h3>
                    {(bidsByProject[project.id] || []).length === 0 ? (
                      <p className="text-xs text-slate-500">No bids submitted yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {bidsByProject[project.id].map((bid) => (
                          <div key={bid.id} className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-black text-womb-cyan">NGN {bid.amount.toLocaleString()}</span>
                              <span className="text-[10px] uppercase tracking-wider text-womb-amber">{bid.status}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{bid.message}</p>
                            <p className="text-[11px] text-slate-500">{bid.vendor_email}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}

        {status && <div className="rounded-lg border border-womb-amber/30 bg-womb-amber/10 px-4 py-3 text-sm text-womb-amber">{status}</div>}
      </main>
      <Footer />
    </div>
  );
}
