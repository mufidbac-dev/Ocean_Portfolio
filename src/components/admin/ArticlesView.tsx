/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Edit2, Plus, Trash2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ArticleItem } from '../../types/content';
import { ArticleModal } from './ArticleModal';

export const ArticlesView: React.FC = () => {
  const { articles, createArticle, updateArticle, deleteArticle } = useContent();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (article: ArticleItem) => {
    setEditingArticle(article);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      await deleteArticle(id);
    }
  };

  const handleTogglePublish = async (article: ArticleItem) => {
    await updateArticle(article.id, { isPublished: !article.isPublished });
  };

  const handleSaveModal = async (data: Omit<ArticleItem, 'id'>) => {
    if (editingArticle) {
      await updateArticle(editingArticle.id, data);
    } else {
      await createArticle(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Journal Articles (Library)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish technical essays, spatial research, and notes shown on Library Island.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Essay</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No articles published yet. Click "Write New Essay" above.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">
                          {article.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          /{article.slug} · {article.readTimeMinutes || 4} min read
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {article.tags && article.tags.length > 0
                        ? article.tags.join(', ')
                        : '—'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 tabular-nums">
                      {article.publishedAt || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(article)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold cursor-pointer ${
                          article.isPublished
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {article.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(article)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors cursor-pointer"
                          title="Edit Essay"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                          title="Delete Essay"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ArticleModal
          article={editingArticle}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
};
