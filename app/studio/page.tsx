'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  PenTool, 
  Sparkles, 
  Heading2, 
  Table, 
  Cpu, 
  Bot, 
  Sliders, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertCircle,
  Database,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { Article } from '@/lib/types';
import MarkdownRenderer from '@/components/MarkdownRenderer';

function StudioPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('edit');

  const [activeTab, setActiveTab] = useState<'write' | 'manage'>('write');
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<Article['category']>('Arduino');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80');
  const [tags, setTags] = useState('arduino, esp32, hardware');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ text: string; slug: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewTab, setPreviewTab] = useState<'editor' | 'preview' | 'split'>('split');

  // Pre-configured Cover Image Presets for rapid selection
  const imagePresets = [
    { label: '🤖 AI & Neural', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80' },
    { label: '🕹️ Arduino / Micro', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80' },
    { label: '⚡ Electronics PCB', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
    { label: '🎬 Video Timeline', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80' },
    { label: '🚀 Tech Project', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Quick Templates
  const templates = {
    arduino: {
      title: 'Interfacing Sensors with ESP32 / Arduino',
      category: 'Arduino' as const,
      tags: 'arduino, esp32, sensors, iot',
      cover: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80',
      body: `# Interfacing Sensors with ESP32

In this project, we will connect an external sensor to the ESP32 microcontroller and monitor real-time values.

## 🛠️ Required Hardware Components
- 1x ESP32 NodeMCU Development Board
- 1x Sensor Module (e.g. Ultrasonic / DHT / BMP)
- Jumper Wires & Breadboard

## ⚡ Circuit Wiring Table
| ESP32 Pin | Sensor Pin | Description |
| :--- | :--- | :--- |
| **GPIO 21** | SDA | I2C Data Signal |
| **GPIO 22** | SCL | I2C Clock Signal |
| **3.3V** | VCC | Power Supply |
| **GND** | GND | Ground Reference |

## 💻 Arduino C++ Code

\`\`\`cpp
#include <Wire.h>

void setup() {
  Serial.begin(115200);
  Serial.println("System Initialized!");
}

void loop() {
  // Read sensor values here
  Serial.println("Sensor loop executing...");
  delay(1000);
}
\`\`\`

## 📝 Testing & Troubleshooting
Open the Arduino Serial Monitor at 115200 baud to view telemetry data.`
    },
    ai: {
      title: 'Fine-Tuning Local AI Models with Custom Datasets',
      category: 'AI' as const,
      tags: 'ai, python, llm, pytorch, transformers',
      cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      body: `# Fine-Tuning Local AI Models

How to fine-tune compact open-weights models locally for domain-specific automation.

## 1. Environment Setup
Install required dependencies:
\`\`\`bash
pip install torch transformers datasets accelerate bitsandbytes
\`\`\`

## 2. Model Loading in 4-bit Quantization
\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch

model_id = "meta-llama/Llama-3-8B"
quantization_config = BitsAndBytesConfig(load_in_4bit=True)

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, quantization_config=quantization_config)
print("[+] Model loaded successfully!")
\`\`\`

## 3. Results and Inference
Test the prompt outputs with custom validation samples.`
    },
    editing: {
      title: 'Speed Up 4K Video Editing Workflow & Color Grade Rules',
      category: 'Editing' as const,
      tags: 'editing, video, colorgrading, premiere, youtube',
      cover: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      body: `# 4K Video Editing Masterclass

Producing crisp tech videos requires an optimized timeline and structured editing pipeline.

## 1. Proxy Generation Strategy
- Generate ProRes Proxy or H.264 low-bitrate proxies at 1080p.
- Toggle proxy playback on complex multicam or VFX heavy timelines.

## 2. Color Grading Pipeline
1. **Exposure / Base Balance**: Set your black point and whites using waveform monitor.
2. **Skin Tone Line**: Check vectorscope to guarantee natural skin highlights.
3. **Creative LUT**: Apply creative look on a separate adjustment layer at 60-70% opacity.

## Recommended YouTube Export Preset
- **Resolution**: 3840 x 2160
- **Frame Rate**: 60 fps
- **Target Bitrate**: 45-60 Mbps VBR 2-Pass`
    }
  };

  // Load article if editSlug exists
  useEffect(() => {
    if (editSlug) {
      loadArticleToEdit(editSlug);
    } else if (!content) {
      // Default to Arduino template for instant gratification
      applyTemplate('arduino');
    }
  }, [editSlug]);

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchArticlesList();
    }
  }, [activeTab]);

  const loadArticleToEdit = async (targetSlug: string) => {
    try {
      const res = await fetch(`/api/articles/${targetSlug}`);
      const data = await res.json();
      if (data.success && data.article) {
        const a = data.article;
        setTitle(a.title);
        setSlug(a.slug);
        setCategory(a.category);
        setExcerpt(a.excerpt);
        setCoverImage(a.cover_image);
        setTags(a.tags);
        setContent(a.content);
        setIsFeatured(a.featured === 1);
        setActiveTab('write');
      }
    } catch (err) {
      console.error('Failed to load article for editing', err);
    }
  };

  const fetchArticlesList = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success) {
        setArticlesList(data.articles);
      }
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!editSlug) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const applyTemplate = (key: keyof typeof templates) => {
    const t = templates[key];
    setTitle(t.title);
    setSlug(t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
    setCategory(t.category);
    setTags(t.tags);
    setCoverImage(t.cover);
    setContent(t.body);
    setSuccessMessage(null);
  };

  // Quick insertion helpers for editor
  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || 'text';
    const replacement = `${before}${selected}${after}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Please provide both Title and Content for the article.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage(null);

    try {
      const isEdit = Boolean(editSlug);
      const url = isEdit ? `/api/articles/${editSlug}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          category,
          excerpt: excerpt.trim() || undefined,
          content,
          cover_image: coverImage,
          tags,
          author: 'Toshit Kumar',
          featured: isFeatured ? 1 : 0
        })
      });

      const data = await res.json();
      if (data.success) {
        const finalSlug = editSlug || data.slug || slug;
        setSuccessMessage({
          text: isEdit ? 'Article updated in SQLite Database!' : 'Article published successfully to SQLite Database!',
          slug: finalSlug
        });
        if (!isEdit) {
          // If created new, don't clear immediately so user can see it or edit
        }
      } else {
        setErrorMessage(data.error || 'Failed to save article.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (targetSlug: string) => {
    if (!window.confirm(`Are you sure you want to delete "${targetSlug}" from the database?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/articles/${targetSlug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArticlesList((prev) => prev.filter((a) => a.slug !== targetSlug));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting article');
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Direct SQLite Publisher &bull; Standalone Content Studio</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Toshit&apos;s Content Studio</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono font-medium">
                Easy Post v1.0
              </span>
            </h1>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'write'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{editSlug ? 'Editing Article' : 'Write / Create Post'}</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'manage'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Manage DB Articles</span>
            </button>
          </div>
        </div>

        {/* TAB 1: WRITE / POST STUDIO */}
        {activeTab === 'write' && (
          <div className="space-y-6">
            
            {/* Quick Templates Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>1-Click Starter Templates:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('arduino')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 text-xs font-semibold transition-all"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>+ Arduino / ESP32</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('ai')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-950/60 hover:bg-violet-900 text-violet-300 border border-violet-700/50 text-xs font-semibold transition-all"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>+ AI &amp; Python</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('editing')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-700/50 text-xs font-semibold transition-all"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>+ Video Editing</span>
                </button>
              </div>
            </div>

            {/* Notification Messages */}
            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm flex items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-center gap-2.5 font-medium">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{successMessage.text}</span>
                </div>
                <Link
                  href={`/article/${successMessage.slug}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all"
                >
                  <span>View Live Article</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    ARTICLE TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Temperature Monitor with ESP32 & OLED"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    CATEGORY *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Article['category'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="Arduino">🕹️ Arduino &amp; Robotics</option>
                    <option value="AI">🤖 Artificial Intelligence</option>
                    <option value="Electronics">⚡ Electronics &amp; Hardware</option>
                    <option value="Editing">🎬 Video &amp; Audio Editing</option>
                    <option value="Projects">🚀 Projects</option>
                    <option value="Other">💡 Other Tech</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Slug, Tags & Featured */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-400">
                    URL SLUG (AUTO-GENERATED)
                  </label>
                  <input
                    type="text"
                    placeholder="article-url-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-400">
                    TAGS (COMMA SEPARATED)
                  </label>
                  <input
                    type="text"
                    placeholder="esp32, oled, iot, arduino"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6 px-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="featured" className="text-xs font-mono text-slate-300 cursor-pointer">
                    Feature on Homepage Hero
                  </label>
                </div>
              </div>

              {/* Row 3: Cover Image Presets & Input */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    COVER IMAGE URL
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500">Fast Presets:</span>
                    {imagePresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Row 4: Short Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-400">
                  SHORT EXCERPT (SUMMARY FOR SOCIAL & CARDS)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief 1-2 sentence overview of what the reader will learn in this post..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Row 5: Formatting Toolbar */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/50">
                <div className="p-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Markdown Quick Buttons */}
                  <div className="flex items-center flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => insertText('**', '**')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('*', '*')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs italic font-serif"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('\n## ', '\n')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                      title="Heading 2"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('\n```cpp\n// Arduino Code\nvoid setup() {\n  // ...\n}\nvoid loop() {\n  // ...\n}\n```\n')}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-cyan-900/40 text-cyan-300 border border-slate-700 text-xs font-mono"
                      title="Arduino C++ Code Block"
                    >
                      + Arduino Code
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('\n```python\n# Python AI Snippet\nimport torch\n\n```\n')}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-violet-900/40 text-violet-300 border border-slate-700 text-xs font-mono"
                      title="Python Code Block"
                    >
                      + Python Code
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('\n| Pin | Component | Function |\n| :--- | :--- | :--- |\n| GPIO 21 | SDA | I2C Data |\n')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                      title="Circuit Pinout Table"
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Pin Table</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('\n> [!NOTE]\n> Important tip: Check baud rate in serial monitor!\n\n')}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs"
                      title="Callout Note"
                    >
                      Note Box
                    </button>
                  </div>

                  {/* View Mode Selector (Editor vs Preview vs Split) */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('editor')}
                      className={`px-2.5 py-1 rounded ${previewTab === 'editor' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('split')}
                      className={`hidden md:inline px-2.5 py-1 rounded ${previewTab === 'split' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Split View
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('preview')}
                      className={`px-2.5 py-1 rounded ${previewTab === 'preview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {/* Editor & Live Preview Area */}
                <div className={`grid ${previewTab === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800' : 'grid-cols-1'}`}>
                  
                  {/* Editor Column */}
                  {(previewTab === 'editor' || previewTab === 'split') && (
                    <div className="p-4 bg-slate-950">
                      <textarea
                        id="markdown-editor"
                        required
                        rows={22}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write article in Markdown... (Syntax highlighting, tables, code snippets fully supported)"
                        className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-200 leading-relaxed focus:outline-none resize-y"
                      />
                    </div>
                  )}

                  {/* Real-Time Live Preview Column */}
                  {(previewTab === 'preview' || previewTab === 'split') && (
                    <div className="p-6 bg-slate-900/40 overflow-y-auto max-h-[600px] border-l border-slate-800/40">
                      <div className="text-xs font-mono text-cyan-400 border-b border-slate-800 pb-2 mb-4 flex items-center justify-between">
                        <span>LIVE ARTICLE PREVIEW</span>
                        <span className="text-[10px] text-slate-500">Updates as you type</span>
                      </div>
                      {content ? (
                        <MarkdownRenderer content={content} />
                      ) : (
                        <p className="text-xs text-slate-500 font-mono italic">
                          Start typing in the editor on the left to see live preview...
                        </p>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saves directly to <code className="text-cyan-300">data/articles.db</code></span>
                </div>

                <div className="flex items-center gap-3">
                  {editSlug && (
                    <button
                      type="button"
                      onClick={() => {
                        router.push('/studio');
                        applyTemplate('arduino');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>{isSubmitting ? 'Publishing to SQLite...' : editSlug ? 'Save Changes' : 'Publish Article 🚀'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* TAB 2: MANAGE ARTICLES IN SQLITE */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>All Articles in Database ({articlesList.length})</span>
              </h2>
              <button
                onClick={fetchArticlesList}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {loadingList ? (
              <div className="text-center py-16 text-slate-400 font-mono text-sm">
                Loading articles from SQLite database...
              </div>
            ) : articlesList.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-mono text-sm">
                No articles found in database.
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-900 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Title &amp; Slug</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {articlesList.map((article) => (
                      <tr key={article.slug} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <Link 
                            href={`/article/${article.slug}`} 
                            className="font-bold text-white hover:text-cyan-400 transition-colors line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          <span className="text-[11px] font-mono text-slate-500">
                            /{article.slug}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-800 border border-slate-700 text-cyan-300">
                            {article.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {article.views}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                          {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/article/${article.slug}`}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300"
                              title="View Article"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => {
                                loadArticleToEdit(article.slug);
                                router.push(`/studio?edit=${article.slug}`);
                              }}
                              className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60"
                              title="Edit Article"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(article.slug)}
                              className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/60"
                              title="Delete from Database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-24 flex flex-col items-center justify-center space-y-3 bg-slate-950">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Loading Studio Panel...</p>
      </div>
    }>
      <StudioPageContent />
    </Suspense>
  );
}
