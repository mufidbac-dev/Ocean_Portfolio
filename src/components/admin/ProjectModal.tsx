/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { ProjectItem } from '../../types/content';

interface ProjectModalProps {
  project: ProjectItem | null; // null means create new
  onClose: () => void;
  onSave: (data: Omit<ProjectItem, 'id'>) => Promise<void>;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [category, setCategory] = useState(project?.category || 'Campaign');
  const [year, setYear] = useState(project?.year || new Date().getFullYear());
  const [client, setClient] = useState(project?.client || '');
  const [summary, setSummary] = useState(project?.summary || '');
  const [description, setDescription] = useState(project?.description || '');
  const [coverUrl, setCoverUrl] = useState(
    project?.coverUrl ||
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  );
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    project?.galleryUrls || []
  );
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [order, setOrder] = useState(project?.order || 1);
  const [isPublished, setIsPublished] = useState(
    project ? project.isPublished : true
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug when title changes if creating new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!project) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const addGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGalleryUrls([...galleryUrls, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim()) {
      setError('Title and category are required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        slug: slug.trim() || 'project',
        category: category.trim(),
        year: Number(year) || new Date().getFullYear(),
        client: client.trim() || 'Internal Study',
        summary: summary.trim(),
        description: description.trim(),
        coverUrl: coverUrl.trim(),
        galleryUrls,
        order: Number(order) || 1,
        isPublished,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
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
              {project ? 'Edit Portfolio Project' : 'New Portfolio Project'}
            </h2>
            <p className="text-xs text-slate-500">
              Provide project details, category classification, and cover visual.
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
                htmlFor="proj-title"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Project Title
              </label>
              <input
                id="proj-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Nordic Horizon Archipelago"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              />
            </div>

            <div>
              <label
                htmlFor="proj-slug"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                URL Slug
              </label>
              <input
                id="proj-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="nordic-horizon"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="proj-category"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Category
              </label>
              <select
                id="proj-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none"
              >
                <option value="Campaign">Campaign</option>
                <option value="Interiors">Interiors</option>
                <option value="Still Life">Still Life</option>
                <option value="Travel">Travel</option>
                <option value="Interactive">Interactive</option>
                <option value="Architecture">Architecture</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="proj-year"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Year
              </label>
              <input
                id="proj-year"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="proj-client"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Client / Commission
              </label>
              <input
                id="proj-client"
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Client Name"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="proj-summary"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Short Summary (Card preview)
            </label>
            <input
              id="proj-summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="1-2 sentences summarizing the project scope..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="proj-desc"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Detailed Case Study (Markdown / Prose)
            </label>
            <textarea
              id="proj-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="In-depth narrative of the creative and technical process..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="proj-cover"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Cover Hero Image URL
            </label>
            <input
              id="proj-cover"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
            />
          </div>

          {/* Additional Gallery URLs */}
          <div className="space-y-2">
            <label
              htmlFor="proj-gallery-new"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Additional Gallery Image URLs
            </label>
            <div className="flex gap-2">
              <input
                id="proj-gallery-new"
                type="url"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-medium hover:bg-slate-300 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {galleryUrls.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {galleryUrls.map((url, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-lg"
                  >
                    <span className="truncate max-w-[400px] text-slate-600 dark:text-slate-400">
                      {url}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status & Display Order */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <label
                htmlFor="proj-published-toggle"
                className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Publish Status:
              </label>
              <button
                id="proj-published-toggle"
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

            <div className="flex items-center gap-2">
              <label
                htmlFor="proj-order"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Display Order:
              </label>
              <input
                id="proj-order"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-center font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
