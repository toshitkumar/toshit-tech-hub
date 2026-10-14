import React from 'react';
import Link from 'next/link';
import { Cpu, Database, Heart } from 'lucide-react';
import { YouTubeIcon, LinkedInIcon, GitHubIcon } from '@/components/Icons';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white font-mono tracking-wide">
                TOSHIT<span className="text-cyan-400">.TECH</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Curated engineering articles, hardware tutorials, microcontroller schematics, AI toolchains, and post-production workflows created by <strong className="text-slate-200">Toshit Kumar</strong>.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@TechwithToshit"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-red-600/20 hover:text-red-400 border border-slate-800 flex items-center justify-center transition-all duration-200 text-slate-300"
                title="YouTube - Tech with Toshit"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/toshit-kumar-a782901a7/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-600/20 hover:text-blue-400 border border-slate-800 flex items-center justify-center transition-all duration-200 text-slate-300"
                title="Connect on LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/toshitkumar"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-cyan-600/20 hover:text-cyan-400 border border-slate-800 flex items-center justify-center transition-all duration-200 text-slate-300"
                title="GitHub Profile"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Topic Categories */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?category=AI" className="hover:text-cyan-400 transition-colors">
                  🤖 Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href="/?category=Arduino" className="hover:text-cyan-400 transition-colors">
                  🕹️ Arduino & Microcontrollers
                </Link>
              </li>
              <li>
                <Link href="/?category=Electronics" className="hover:text-cyan-400 transition-colors">
                  ⚡ Electronics & PCB Design
                </Link>
              </li>
              <li>
                <Link href="/?category=Editing" className="hover:text-cyan-400 transition-colors">
                  🎬 Video & Audio Editing
                </Link>
              </li>
              <li>
                <Link href="/?category=Projects" className="hover:text-cyan-400 transition-colors">
                  🚀 Hands-On Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Database & Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono mb-3">
              Database Architecture
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold">
                <Database className="w-3.5 h-3.5" />
                <span>Isolated SQLite Engine</span>
              </div>
              <p className="text-slate-400 leading-normal">
                All articles, tags, and metrics are stored in a standalone local database (<code className="text-cyan-300 font-mono">data/articles.db</code>).
              </p>
              <div className="pt-1 text-[11px] text-slate-500 font-mono">
                WAL mode enabled • Zero cloud bills
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Toshit Kumar. Built with Next.js & SQLite.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for makers & engineers with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
