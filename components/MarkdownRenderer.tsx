'use client';

import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState('');

  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    const parsed = marked.parse(content || '') as string;
    setHtml(parsed);
  }, [content]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Highlight code blocks and attach copy buttons
    const codeBlocks = containerRef.current.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement);

      const pre = block.parentElement;
      if (pre && !pre.querySelector('.copy-btn')) {
        pre.style.position = 'relative';

        const button = document.createElement('button');
        button.className =
          'copy-btn absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700/80 transition-all shadow-md';
        button.innerText = 'Copy';
        button.onclick = (e) => {
          e.preventDefault();
          navigator.clipboard.writeText(block.textContent || '');
          button.innerText = 'Copied!';
          button.classList.add('bg-emerald-600', 'text-white', 'border-emerald-500');
          setTimeout(() => {
            button.innerText = 'Copy';
            button.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-500');
          }, 2000);
        };
        pre.appendChild(button);
      }
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="markdown-content text-slate-200 max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
