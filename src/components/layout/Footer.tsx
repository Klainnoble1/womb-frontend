'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Truck, Headphones, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-white/10 bg-womb-dark/95 text-slate-400 mt-20">
      
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="p-3 rounded-lg bg-womb-cyan/10 text-womb-cyan">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Verified Tech Gear</h4>
            <p className="text-xs text-slate-400">Inspected lighting & sound systems</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="p-3 rounded-lg bg-womb-magenta/10 text-womb-magenta">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Paystack Secured</h4>
            <p className="text-xs text-slate-400">Escrow & fast payout processing</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="p-3 rounded-lg bg-womb-purple/10 text-womb-purple">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Nationwide Freight</h4>
            <p className="text-xs text-slate-400">Safe heavy equipment transport</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="p-3 rounded-lg bg-womb-amber/10 text-womb-amber">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">24/7 Tech Support</h4>
            <p className="text-xs text-slate-400">Concert & event sound engineers</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Brand Summary */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-womb-purple to-womb-cyan p-0.5">
              <div className="w-full h-full bg-womb-dark rounded-[6px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-womb-cyan" />
              </div>
            </div>
            <span className="text-xl font-bold text-white tracking-wider">WOMB</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            The premier marketplace and rental ecosystem for stage lighting, professional audio, laser systems, and entertainment tech specialists.
          </p>
          
          {/* Newsletter Signup */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-200">Subscribe for New Gear Drop Alerts</label>
            <div className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your work email"
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-womb-cyan flex-1"
              />
              <button className="px-4 py-2 rounded-lg bg-womb-cyan text-womb-dark font-bold text-xs hover:bg-womb-cyan/90 transition-colors flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/marketplace?cat=lighting" className="hover:text-womb-cyan transition-colors">Moving Heads & Fixtures</Link></li>
            <li><Link href="/marketplace?cat=audio" className="hover:text-womb-cyan transition-colors">Line Array Speakers</Link></li>
            <li><Link href="/marketplace?cat=lasers" className="hover:text-womb-cyan transition-colors">Laser & FX Machines</Link></li>
            <li><Link href="/marketplace?cat=staging" className="hover:text-womb-cyan transition-colors">Trussing & Stage Platforms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/rentals" className="hover:text-womb-magenta transition-colors">Equipment Rentals</Link></li>
            <li><Link href="/projects" className="hover:text-womb-magenta transition-colors">Concert Project Bidding</Link></li>
            <li><Link href="/professionals" className="hover:text-womb-magenta transition-colors">Lighting Designers</Link></li>
            <li><Link href="/professionals" className="hover:text-womb-magenta transition-colors">Sound Engineers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Vendors & Partners</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/vendor" className="hover:text-womb-purple transition-colors">Become a Vendor</Link></li>
            <li><Link href="/vendor" className="hover:text-womb-purple transition-colors">Vendor Dashboard</Link></li>
            <li><Link href="/docs" className="hover:text-womb-purple transition-colors">API Documentation</Link></li>
            <li><Link href="/terms" className="hover:text-womb-purple transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 py-6 px-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} WOMB Platform. All rights reserved. Powered by Paystack Payment Engine.
      </div>
    </footer>
  );
}
