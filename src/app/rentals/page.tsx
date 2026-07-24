'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { API_URL } from '../../lib/api';
import { Calendar, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

interface Rental {
  id: number;
  item_name: string;
  category: string;
  daily_rate: number;
  image: string;
  location: string;
  available: boolean;
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);

  const defaultRentals: Rental[] = [
    {
      id: 1,
      item_name: 'MA Lighting grandMA3 Light Console (Rental)',
      category: 'lighting',
      daily_rate: 150000,
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      location: 'Lagos, Nigeria',
      available: true,
    },
    {
      id: 2,
      item_name: 'DiGiCo SD10 Digital Live Mixing Console',
      category: 'audio',
      daily_rate: 220000,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      location: 'Abuja, Nigeria',
      available: true,
    },
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/rentals`)
      .then((res) => res.json())
      .then((data) => {
        if (data.rentals && data.rentals.length > 0) {
          setRentals(data.rentals);
        } else {
          setRentals(defaultRentals);
        }
      })
      .catch(() => setRentals(defaultRentals));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#07070c] text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-womb-magenta" />
            Equipment Rentals & Console Booking
          </h1>
          <p className="text-sm text-slate-400">
            Book touring mixing desks, lighting consoles, and stage gear per day with full tech insurance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rentals.map((item) => (
            <div key={item.id} className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
              <img src={item.image} alt={item.item_name} className="w-full sm:w-48 h-40 object-cover rounded-xl bg-slate-900" />

              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-womb-magenta/20 text-womb-magenta text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.location}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">{item.item_name}</h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Daily Rate</span>
                    <span className="text-lg font-black text-womb-magenta">₦{item.daily_rate.toLocaleString()} / day</span>
                  </div>

                  <button
                    onClick={() => alert(`Booking request initiated for ${item.item_name}`)}
                    className="px-4 py-2 rounded-xl bg-womb-magenta text-white font-bold text-xs hover:bg-womb-magenta/90 transition-colors"
                  >
                    Book Rental Dates
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
