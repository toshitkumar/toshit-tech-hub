export interface Article {
  id?: number;
  slug: string;
  title: string;
  category: 'AI' | 'Electronics' | 'Arduino' | 'Editing' | 'Projects' | 'Other';
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string;
  author: string;
  read_time: string;
  featured: number; // 0 or 1
  views: number;
  created_at?: string;
  updated_at?: string;
}

export type ArticleCategory = Article['category'];
