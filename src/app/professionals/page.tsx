'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { API_URL } from '../../lib/api';
import { UserCheck, Star, Award, CheckCircle } from 'lucide-react';

interface Professional {
  id: number;
  name: string;
  role: string;
  hourly_rate: number;
  avatar: string;
  rating: string;
  projects_completed: number;
}

export default function ProfessionalsPage() {
  const [pros, setPros] = useState<Professional[]>([]);

  const defaultPros: Professional[] = [
    {
      id: 1,
      name: 'Tunde Adeleke',
      role: 'Senior Lighting Designer (LD)',
      hourly_rate: 35000,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: '5.0',
      projects_completed: 68,
    },
    {
      id: 2,
      name: 'Emeka Nwosu',
      role: 'FOH Sound Engineer',
      hourly_rate: 40000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      rating: '4.9',
      projects_completed: 85,
    },
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/professionals`)
      .then((res) => res.json())
      .then((data) => {
        if (data.professionals && data.professionals.length > 0) {
          setPros(data.professionals);
        } else {
          setPros(defaultPros);
        }
      })
      .catch(() => setPros(defaultPros));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#07070c] text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-womb-amber" />
            Stage Tech Specialists & Engineers
          </h1>
          <p className="text-sm text-slate-400">
            Hire certified lighting designers, grandMA3 programmers, line array sound engineers, and pyrotechnic crew.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pros.map((pro) => (
            <div key={pro.id} className="glass-panel glass-panel-hover rounded-2xl p-6 text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-womb-amber/50 p-0.5">
                <img src={pro.avatar} alt={pro.name} className="w-full h-full object-cover rounded-full" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{pro.name}</h3>
                <span className="text-xs text-womb-amber font-semibold block">{pro.role}</span>
              </div>

              <div className="flex items-center justify-center gap-4 py-2 border-y border-white/10 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-womb-amber text-womb-amber" />
                  <span className="font-bold text-white">{pro.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Award className="w-3.5 h-3.5 text-womb-cyan" />
                  <span>{pro.projects_completed} Events</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rate</span>
                  <span className="text-sm font-black text-white">₦{pro.hourly_rate.toLocaleString()} / hr</span>
                </div>

                <button
                  onClick={() => alert(`Inquiry sent to ${pro.name}`)}
                  className="px-4 py-2 rounded-xl bg-womb-amber text-womb-dark font-bold text-xs hover:bg-womb-amber/90 transition-colors"
                >
                  Hire Engineer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
