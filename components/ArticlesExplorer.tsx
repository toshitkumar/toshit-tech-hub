'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Bot, 
  Cpu, 
  Zap, 
  Sliders, 
  FolderGit2, 
  Search, 
  Clock, 
  Eye, 
  ArrowRight, 
  Database, 
  Sparkles, 
  PenTool,
  CheckCircle2
} from 'lucide-react';
import { YouTubeIcon, LinkedInIcon } from '@/components/Icons';
import { Article } from '@/lib/types';

interface ArticlesExplorerProps {
  initialArticles: Article[];
  initialStats: {
    totalArticles: number;
    totalViews: number;
    dbPath: string;
  };
}

function ArticlesExplorerContent({ initialArticles, initialStats }: ArticlesExplorerProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...initialArticles];

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          (a.tags && a.tags.toLowerCase().includes(q))
      );
    }

    setArticles(filtered);
  }, [selectedCategory, searchQuery, initialArticles]);

  const categories = [
    { id: 'All', label: 'All Articles', icon: Sparkles, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20' },
    { id: 'AI', label: 'Artificial Intelligence', icon: Bot, color: 'text-violet-400 border-violet-500/30 bg-violet-950/20' },
    { id: 'Arduino', label: 'Arduino & Robotics', icon: Cpu, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20' },
    { id: 'Electronics', label: 'Electronics & Hardware', icon: Zap, color: 'text-amber-400 border-amber-500/30 bg-amber-950/20' },
    { id: 'Editing', label: 'Video & Audio Editing', icon: Sliders, color: 'text-rose-400 border-rose-500/30 bg-rose-950/20' },
    { id: 'Projects', label: 'Featured Projects', icon: FolderGit2, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20' },
  ];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'AI':
        return 'bg-violet-950/60 text-violet-300 border-violet-700/50';
      case 'Arduino':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-700/50';
      case 'Electronics':
        return 'bg-amber-950/60 text-amber-300 border-amber-700/50';
      case 'Editing':
        return 'bg-rose-950/60 text-rose-300 border-rose-700/50';
      case 'Projects':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Independent Knowledge Base &bull; Powered by SQLite</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Hardware, Circuits &amp; <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
              In-depth tutorials, microcontrollers schematics, AI agent architectures, and post-production workflows by <strong className="text-slate-200">Toshit Kumar</strong>.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/studio"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-105"
              >
                <PenTool className="w-4 h-4" />
                <span>Publish New Article</span>
              </Link>
              <a
                href="https://www.youtube.com/@TechwithToshit"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium text-sm transition-all duration-200"
              >
                <YouTubeIcon className="w-4 h-4 text-red-500" />
                <span>YouTube Channel</span>
              </a>
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="mt-12 flex items-center justify-center flex-wrap gap-2 sm:gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Articles Feed */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Search & Active Category Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                <span className="text-slate-400">Showing:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono text-xs">
                  {selectedCategory === 'All' ? 'All Topics' : selectedCategory}
                </span>
                <span className="text-xs text-slate-500">
                  ({articles.length} {articles.length === 1 ? 'article' : 'articles'})
                </span>
              </div>

              {/* Search Form */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search articles, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 pl-9 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Articles List */}
            {articles.length === 0 ? (
              <div className="text-center py-20 p-8 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 space-y-4">
                <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-300">No articles found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  No posts matched your filter or search query. Click below to write the first article in this category!
                </p>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Write Post Now</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => {
                  const tagList = article.tags ? article.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
                  
                  return (
                    <article
                      key={article.slug}
                      className="group relative rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/30 overflow-hidden flex flex-col md:flex-row"
                    >
                      {/* Thumbnail Image */}
                      {article.cover_image && (
                        <div className="md:w-64 h-48 md:h-auto overflow-hidden relative flex-shrink-0 bg-slate-950">
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:hidden" />
                          <div className="absolute top-3 left-3 md:hidden">
                            <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border font-semibold ${getCategoryBadgeClass(article.category)}`}>
                              {article.category}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Content Area */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Top Badges */}
                          <div className="hidden md:flex items-center justify-between mb-3">
                            <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border font-semibold ${getCategoryBadgeClass(article.category)}`}>
                              {article.category}
                            </span>
                            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                {article.read_time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                {article.views} views
                              </span>
                            </div>
                          </div>

                          {/* Title */}
                          <Link href={`/article/${article.slug}`}>
                            <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2 leading-snug">
                              {article.title}
                            </h2>
                          </Link>

                          {/* Excerpt */}
                          <p className="text-sm text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>

                        {/* Card Footer: Tags & Read Link */}
                        <div className="mt-5 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {tagList.slice(0, 3).map((tag) => (
                              <button
                                key={tag}
                                onClick={() => {
                                  setSearchQuery(tag);
                                  setSelectedCategory('All');
                                }}
                                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>

                          <Link
                            href={`/article/${article.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link ml-auto"
                          >
                            <span>Read Full Article</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Profile Card */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-cyan-500/20">
                  TK
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Toshit Kumar</h3>
                  <p className="text-xs text-cyan-400 font-mono">ICT Trainer &bull; Full-Stack &amp; Maker</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Specializing in Embedded Robotics (Arduino, ESP32), Generative AI systems, and Media Production. Creator of <strong>Tech with Toshit</strong>.
              </p>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.youtube.com/@TechwithToshit"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-300 text-xs font-semibold transition-all"
                >
                  <YouTubeIcon className="w-4 h-4 text-red-400" />
                  <span>Subscribe</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/toshit-kumar-a782901a7/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-all"
                >
                  <LinkedInIcon className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Standalone Database Status Card */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs text-slate-400 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  DATABASE ENGINE
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ISOLATED
                </span>
              </div>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Engine:</span>
                  <span className="text-slate-200">SQLite 3 (Embedded)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>File Location:</span>
                  <span className="text-cyan-300 text-[11px]">data/articles.db</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Articles:</span>
                  <span className="text-slate-200 font-semibold">{initialStats.totalArticles}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Views:</span>
                  <span className="text-slate-200">{initialStats.totalViews}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 font-sans leading-normal border-t border-slate-800/80">
                Aapka poora content aapke machine par safe hai. Ek single file backup se poora data restore ho sakta hai.
              </div>
            </div>

            {/* Quick Studio Callout */}
            <div className="rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-900 border border-cyan-500/30 p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <PenTool className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">
                Easy Article Posting
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ready-made templates for Arduino C++, AI tutorials, and Video Editing. Split-screen live preview ke sath post karein!
              </p>
              <Link
                href="/studio"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                <span>Launch Studio Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

export default function ArticlesExplorer(props: ArticlesExplorerProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-24 flex flex-col items-center justify-center space-y-3 bg-slate-950">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Loading Toshit.Tech...</p>
      </div>
    }>
      <ArticlesExplorerContent {...props} />
    </Suspense>
  );
}
