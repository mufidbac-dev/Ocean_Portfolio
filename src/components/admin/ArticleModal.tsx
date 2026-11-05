/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ArticleItem } from '../../types/content';

interface ArticleModalProps {
  article: ArticleItem | null;
  onClose: () => void;
  onSave: (data: Omit<ArticleItem, 'id'>) => Promise<void>;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [content, setContent] = useState(article?.content || '');
  const [coverUrl, setCoverUrl] = useState(article?.coverUrl || '');
  const [tagsStr, setTagsStr] = useState(article?.tags?.join(', ') || '');
  const [readTimeMinutes, setReadTimeMinutes] = useState(
    article?.readTimeMinutes || 4
  );
  const [isPublished, setIsPublished] = useState(
    article ? article.isPublished : true
  );
  const [publishedAt, setPublishedAt] = useState(
    article?.publishedAt || new Date().toISOString().split('T')[0]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!article) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const tags = tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave({
        title: title.trim(),
        slug: slug.trim() || 'essay',
        summary: summary.trim(),
        content: content.trim(),
        coverUrl: coverUrl.trim(),
        tags,
        readTimeMinutes: Number(readTimeMinutes) || 4,
        isPublished,
        publishedAt,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save essay');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {article ? 'Edit Journal Essay' : 'Write New Journal Essay'}
            </h2>
            <p className="text-xs text-slate-500">
              Essays and technical notes are showcased on Library Island.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="art-title"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Essay Title
              </label>
              <input
                id="art-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Crafting Tactile Water Waves..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="art-slug"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Slug
              </label>
              <input
                id="art-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="crafting-tactile-water"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="art-date"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Publish Date
              </label>
              <input
                id="art-date"
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="art-readtime"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Read Time (min)
              </label>
              <input
                id="art-readtime"
                type="number"
                value={readTimeMinutes}
                onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-center"
              />
            </div>

            <div>
              <label
                htmlFor="art-tags"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Tags (comma separated)
              </label>
              <input
                id="art-tags"
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="Three.js, GLSL, Design"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="art-summary"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Summary / Deck
            </label>
            <input
              id="art-summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary displayed on the article listing..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="art-cover"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Cover Image URL (Optional)
            </label>
            <input
              id="art-cover"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="art-content"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Essay Content (Markdown supported)
            </label>
            <textarea
              id="art-content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in markdown prose..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-sans focus:outline-none resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <label
                htmlFor="art-published-toggle"
                className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Publish Status:
              </label>
              <button
                id="art-published-toggle"
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                  isPublished
                    ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isPublished ? 'Published' : 'Draft'}
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : article ? 'Save Changes' : 'Publish Essay'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
