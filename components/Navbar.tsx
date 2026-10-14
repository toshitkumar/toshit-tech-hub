'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Cpu, 
  Bot, 
  Zap, 
  Sliders, 
  FolderGit2, 
  PenTool, 
  Database,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'All Topics', href: '/', icon: Sparkles },
    { name: 'AI & ML', href: '/?category=AI', icon: Bot },
    { name: 'Electronics', href: '/?category=Electronics', icon: Zap },
    { name: 'Arduino', href: '/?category=Arduino', icon: Cpu },
    { name: 'Editing', href: '/?category=Editing', icon: Sliders },
    { name: 'Projects', href: '/?category=Projects', icon: FolderGit2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-white flex items-center gap-1.5 font-mono">
              TOSHIT<span className="text-cyan-400">.TECH</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 font-mono tracking-tight">
              AI • Arduino • Hardware • Editing
            </span>
          </div>
        </Link>

        {/* Desktop Category Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-80" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* SQLite Status Badge */}
          <div 
            title="Isolated Local SQLite Database (data/articles.db)" 
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[11px] text-slate-300">SQLite: Standalone</span>
          </div>

          {/* Easy Post / Studio Button */}
          <Link
            href="/studio"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <PenTool className="w-4 h-4" />
            <span>Studio / Post</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/studio"
            className="p-2 rounded-lg bg-cyan-600 text-white text-xs font-semibold"
          >
            <PenTool className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-3">
            <span className="flex items-center gap-1.5 font-mono">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              SQLite DB: Local & Isolated
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
