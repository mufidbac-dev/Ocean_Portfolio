/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, Mail, MailOpen, Trash2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const MessagesView: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useContent();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete transmission from "${name}"?`)) {
      await deleteMessage(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Signal Transmissions (Contact Messages)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review and archive visitor inquiries submitted from Signal Island.
        </p>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
          <Mail className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="font-serif text-base text-slate-700 dark:text-slate-300">
            No transmissions recorded.
          </p>
          <p className="text-xs">
            Inquiries dispatched by visitors on Signal Island will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl border transition-all ${
                !msg.isRead
                  ? 'bg-white dark:bg-slate-900 border-teal-500/40 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      !msg.isRead
                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {!msg.isRead ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MailOpen className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {msg.name}
                      </span>
                      {!msg.isRead && (
                        <span className="text-[10px] font-mono uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-1.5 py-0.5 rounded font-bold">
                          Unread
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-teal-600 dark:text-teal-400 font-mono hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : 'Recent'}
                  </span>
                  <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                  <button
                    onClick={() => markMessageRead(msg.id, !msg.isRead)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
                    title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id, msg.name)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transmission Body */}
              <div className="pt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
