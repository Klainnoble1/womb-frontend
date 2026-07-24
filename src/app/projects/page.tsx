'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { API_URL } from '../../lib/api';
import { Briefcase, Lock, Send, X } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  event_type: string;
  budget: number;
  location: string;
  description: string;
  status: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showRfpModal, setShowRfpModal] = useState(false);
  const [bidProject, setBidProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('Music Festival');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [status, setStatus] = useState('');

  const defaultProjects: Project[] = [
    {
      id: 1,
      title: 'Neon Pulse Festival 2026 Stage Lighting',
      event_type: 'Music Festival',
      budget: 15000000,
      location: 'Eko Atlantic, Lagos',
      description: 'Seeking full stage lighting rig, pixel mapping, and laser control team for 20,000 capacity festival.',
      status: 'Open for Bids',
    },
    {
      id: 2,
      title: 'Corporate Excellence Awards Audio & LED Rig',
      event_type: 'Corporate Event',
      budget: 6500000,
      location: 'Transcorp Hilton, Abuja',
      description: 'Requires P2.5 indoor LED wall screens, line array audio, and podium lighting setup.',
      status: 'Open for Bids',
    },
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        } else {
          setProjects(defaultProjects);
        }
      })
      .catch(() => setProjects(defaultProjects));
  }, []);

  const handlePostRfp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          event_type: eventType,
          budget: Number(budget),
          location,
          description,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_email: contactEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Project submission failed.');
      }
      setProjects((current) => [data.project, ...current]);
      setStatus('Project submitted. Contact details are visible only in the admin portal.');
      setShowRfpModal(false);
      setTitle('');
      setBudget('');
      setLocation('');
      setDescription('');
      setContactName('');
      setContactPhone('');
      setContactEmail('');
    } catch (err: any) {
      setStatus(err.message);
    }
  };

  const openBidForm = (project: Project) => {
    const savedToken = window.localStorage.getItem('womb_vendor_token');
    const savedUser = window.localStorage.getItem('womb_vendor_user');
    const role = savedUser ? JSON.parse(savedUser).role : '';
    if (!savedToken || !['vendor', 'professional', 'admin'].includes(role)) {
      setStatus('Only logged-in vendors can bid. Register or login through the Vendor Portal first.');
      return;
    }
    setStatus('');
    setBidProject(project);
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidProject) return;

    try {
      const savedToken = window.localStorage.getItem('womb_vendor_token');
      const response = await fetch(`${API_URL}/api/projects/${bidProject.id}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify({
          amount: Number(bidAmount),
          message: bidMessage,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Bid submission failed.');
      }

      setStatus('Bid submitted to admin for review.');
      setBidProject(null);
      setBidAmount('');
      setBidMessage('');
    } catch (err: any) {
      setStatus(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07070c] text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-womb-purple" />
              Event Stage RFPs & Project Bidding
            </h1>
            <p className="text-sm text-slate-400">
              Submit your concert production requirements or bid on active stage lighting & sound contracts.
            </p>
          </div>

          <button
            onClick={() => setShowRfpModal(true)}
            className="px-5 py-3 rounded-full bg-womb-purple hover:bg-womb-purple/90 text-white font-bold text-xs shadow-lg shadow-womb-purple/20 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Post New Stage RFP
          </button>
        </div>

        {status && (
          <div className="rounded-lg border border-womb-amber/30 bg-womb-amber/10 px-4 py-3 text-sm text-womb-amber">
            {status}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-womb-purple/20 text-womb-purple text-xs font-bold border border-womb-purple/30">
                  {project.event_type}
                </span>
                <span className="text-xs font-mono text-womb-cyan bg-womb-cyan/10 px-2.5 py-1 rounded-full">
                  {project.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white leading-snug">{project.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Budget</span>
                  <span className="text-lg font-black text-womb-cyan">₦{project.budget.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => openBidForm(project)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-womb-cyan" />
                  Submit Quote Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Post RFP Modal */}
      {showRfpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl max-w-lg w-full p-6 space-y-4 bg-womb-dark border border-womb-purple/40">
            <h3 className="text-xl font-bold text-white">Post Stage RFP Proposal</h3>
            
            <form onSubmit={handlePostRfp} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234..."
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lagos Mega Gospel Concert Sound Rig"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-womb-dark border border-white/10 text-xs text-white"
                >
                  <option value="Music Festival">Music Festival</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Arena Concert">Arena Concert</option>
                  <option value="Wedding / Gala">Wedding / Gala</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Budget (NGN)</label>
                  <input
                    type="number"
                    required
                    placeholder="10000000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Lagos, Nigeria"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Detailed Requirements</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe needed lighting fixtures, line array throw distance, stage size..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRfpModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-womb-purple text-white font-bold text-xs"
                >
                  Post Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {bidProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl max-w-lg w-full p-6 space-y-4 bg-womb-dark border border-womb-cyan/40">
            <h3 className="text-xl font-bold text-white">Submit Vendor Bid</h3>
            <p className="text-xs text-slate-400">{bidProject.title}</p>

            <form onSubmit={handleSubmitBid} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Quote Amount (NGN)</label>
                <input
                  type="number"
                  required
                  placeholder="5000000"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Proposal Summary</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Summarize your equipment package, crew, delivery, timeline, and inclusions."
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBidProject(null)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-womb-cyan text-womb-dark font-bold text-xs">
                  Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
