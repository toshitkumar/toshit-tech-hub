import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  Eye, 
  ArrowLeft, 
  PenTool, 
  Tag, 
  Sparkles,
  Database
} from 'lucide-react';
import { getArticleBySlug, getArticles } from '@/lib/db';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} — Toshit.Tech`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getArticles({ category: article.category })
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const tagsList = article.tags ? article.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'AI':
        return 'bg-violet-950/70 text-violet-300 border-violet-700/60';
      case 'Arduino':
        return 'bg-cyan-950/70 text-cyan-300 border-cyan-700/60';
      case 'Electronics':
        return 'bg-amber-950/70 text-amber-300 border-amber-700/60';
      case 'Editing':
        return 'bg-rose-950/70 text-rose-300 border-rose-700/60';
      case 'Projects':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </Link>

          <Link
            href={`/studio?edit=${article.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-all"
          >
            <PenTool className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edit in Studio</span>
          </Link>
        </div>

        {/* Article Header Card */}
        <header className="mb-10 space-y-6">
          
          {/* Category & Stats Row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${getCategoryBadgeClass(article.category)}`}>
              {article.category}
            </span>
            <span className="text-xs text-slate-500 font-mono">•</span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {article.read_time}
            </span>
            <span className="text-xs text-slate-500 font-mono">•</span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              {article.views} views
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Excerpt / Lead */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Author & Database Meta */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                TK
              </div>
              <div>
                <p className="font-bold text-white text-sm">{article.author}</p>
                <p className="text-[11px] text-slate-400 font-mono">Published • Verified Maker</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Stored in: SQLite articles.db</span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {article.cover_image && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-900 aspect-video max-h-[460px]">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Article Body (Markdown Content) */}
        <article className="prose prose-invert prose-cyan max-w-none mb-14">
          <MarkdownRenderer content={article.content} />
        </article>

        {/* Tags Section */}
        {tagsList.length > 0 && (
          <div className="py-6 border-t border-b border-slate-800/80 mb-12 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-2">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              TOPIC TAGS:
            </span>
            {tagsList.map((tag) => (
              <Link
                key={tag}
                href={`/?tag=${tag}`}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-slate-700 transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-14">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-lg flex-shrink-0">
            TK
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-base font-bold text-white">Written by Toshit Kumar</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              ICT Process Trainer, Full-Stack Developer, and Maker. Explores Embedded Systems (ESP32/Arduino), Generative AI applications, and video workflows on YouTube channel <strong>Tech with Toshit</strong>.
            </p>
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold">
              <a
                href="https://www.youtube.com/@TechwithToshit"
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                YouTube Channel &rarr;
              </a>
              <a
                href="https://www.linkedin.com/in/toshit-kumar-a782901a7/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                LinkedIn &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Related Articles in Same Category */}
        {relatedArticles.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>More in {article.category}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/article/${rel.slug}`}
                  className="group p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mt-3">
                    {rel.read_time}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
