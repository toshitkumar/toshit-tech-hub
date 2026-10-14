import { NextRequest, NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const tag = searchParams.get('tag') || undefined;

    const articles = getArticles({ category, search, tag });
    return NextResponse.json({ success: true, articles });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Auto-generate slug if not provided
    let slug = body.slug;
    if (!slug && body.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Title, category, and content are required' },
        { status: 400 }
      );
    }

    // Auto-estimate read time if not provided
    const words = body.content.split(/\s+/).length;
    const calculatedReadTime = `${Math.max(1, Math.ceil(words / 180))} min read`;

    // Auto-generate excerpt if not provided
    const cleanExcerpt = body.excerpt || body.content.replace(/[#*`_\[\]]/g, '').slice(0, 160) + '...';

    const newId = createArticle({
      slug: slug || `post-${Date.now()}`,
      title: body.title,
      category: body.category,
      excerpt: cleanExcerpt,
      content: body.content,
      cover_image: body.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      tags: body.tags || '',
      author: body.author || 'Toshit Kumar',
      read_time: body.read_time || calculatedReadTime,
      featured: body.featured ? 1 : 0
    });

    return NextResponse.json({ 
      success: true, 
      id: newId, 
      slug, 
      message: 'Article published successfully!' 
    }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
