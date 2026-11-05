/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Anchor, X } from 'lucide-react';
import { ISLANDS } from '../../config/islands';
import { IslandId } from '../../types/content';

interface IslandModalContainerProps {
  islandId: IslandId | null;
  onClose: () => void;
  children: React.ReactNode;
}

export const IslandModalContainer: React.FC<IslandModalContainerProps> = ({
  islandId,
  onClose,
  children,
}) => {
  if (!islandId) return null;
  const island = ISLANDS[islandId];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-auto">
        {/* Backdrop Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Drawer Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-50 w-full max-w-4xl max-h-[88vh] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: island.color }}
              >
                <Anchor className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Island Anchorage
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                  {island.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Undock / Close panel"
              >
                <span>Undock & Sail</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-6">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
