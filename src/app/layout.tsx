import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WOMB | Stage Lighting, Sound & Entertainment Ecosystem',
  description: 'The premier marketplace and rental ecosystem for stage lighting, professional audio, laser systems, and entertainment tech specialists.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07070c] text-slate-100 min-h-screen flex flex-col selection:bg-womb-cyan selection:text-womb-dark">
        {children}
      </body>
    </html>
  );
}
