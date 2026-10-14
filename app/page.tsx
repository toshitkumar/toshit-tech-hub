import React from 'react';
import { getArticles, getStats } from '@/lib/db';
import ArticlesExplorer from '@/components/ArticlesExplorer';

export default function HomePage() {
  const initialArticles = getArticles();
  const initialStats = getStats();

  return (
    <ArticlesExplorer 
      initialArticles={initialArticles} 
      initialStats={initialStats} 
    />
  );
}
