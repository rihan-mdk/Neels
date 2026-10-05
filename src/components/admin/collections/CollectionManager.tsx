'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  CollectionRecord,
  CollectionFormData,
} from '@/lib/validations/collection.schema';
import {
  fetchAdminCollections,
  createAdminCollection,
  updateAdminCollection,
  deleteAdminCollection,
  reorderAdminCollections,
} from '@/lib/services/catalog-admin.service';
import CollectionListTable from './CollectionListTable';
import CollectionFormModal from './CollectionFormModal';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

interface CollectionManagerProps {
  initialCollections?: CollectionRecord[];
}

export default function CollectionManager({
  initialCollections = [],
}: CollectionManagerProps) {
  const [collections, setCollections] = useState<CollectionRecord[]>(initialCollections);
  const [isLoading, setIsLoading] = useState(!initialCollections.length);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | null>(null);
  const [editingCollection, setEditingCollection] = useState<CollectionRecord | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<CollectionRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminCollections();
      setCollections(data);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to fetch collections.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  // Auto clear feedback after 6 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleCreate = async (data: CollectionFormData, file?: File) => {
    const newCollection = await createAdminCollection(data, file);
    setCollections((prev) => [...prev, newCollection].sort((a, b) => a.display_order - b.display_order));
    setFeedback({
      type: 'success',
      message: `Collection "${newCollection.name}" created successfully.`,
    });
  };

  const handleEdit = async (data: CollectionFormData, file?: File) => {
    if (!editingCollection) return;
    const updated = await updateAdminCollection(
      editingCollection.slug,
      data,
      file,
      editingCollection.image
    );
    setCollections((prev) =>
      prev.map((c) => (c.slug === editingCollection.slug ? updated : c))
    );
    setFeedback({
      type: 'success',
      message: `Collection "${updated.name}" updated successfully.`,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCollection) return;
    try {
      setIsDeleting(true);
      await deleteAdminCollection(deletingCollection.slug, deletingCollection.image);
      setCollections((prev) => prev.filter((c) => c.slug !== deletingCollection.slug));
      setFeedback({
        type: 'success',
        message: `Collection "${deletingCollection.name}" has been removed.`,
      });
      setDeletingCollection(null);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete collection.',
      });
      setDeletingCollection(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (isReordering) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= collections.length) return;

    const newCollections = [...collections];
    const [moved] = newCollections.splice(index, 1);
    newCollections.splice(targetIndex, 0, moved);

    // Reassign display_order
    const reordered = newCollections.map((c, idx) => ({ ...c, display_order: idx }));
    setCollections(reordered);

    try {
      setIsReordering(true);
      await reorderAdminCollections(reordered.map((c) => c.slug));
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update order.',
      });
      loadCollections();
    } finally {
      setIsReordering(false);
    }
  };

  const filteredCollections = collections.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.short_name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.season && c.season.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-[#E4E1DA] pb-5">
        <div>
          <h1
            className="text-3xl md:text-[32px] font-normal text-[#171717] tracking-tight leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Collections
          </h1>
          <p
            className="text-[12px] text-[#68655F] mt-1.5 font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Manage seasonal couture stories, curatorial edits, and campaign imagery
          </p>
        </div>
        <div className="flex items-center gap-3.5 flex-shrink-0">
          <button
            type="button"
            onClick={loadCollections}
            disabled={isLoading}
            className="w-[38px] h-[38px] flex items-center justify-center bg-[#FFFFFF] hover:bg-[#EAE7E0] border border-[#111111] text-[#111111] hover:text-[#111111] transition-colors duration-150 disabled:opacity-40 rounded-[6px] shadow-xs cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw size={15} strokeWidth={2} className={`text-[#111111] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingCollection(null);
              setActiveModal('create');
            }}
            className="inline-flex items-center justify-center h-[38px] min-w-[140px] px-5 bg-[#FFFFFF] hover:bg-[#EAE7E0] border border-[#111111] text-[#111111] hover:text-[#111111] text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors duration-150 rounded-[6px] shadow-xs cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Add Collection
          </button>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedback && (
        <div
          className={`px-4 py-3 border flex items-center justify-between text-[11px] rounded-[3px] ${
            feedback.type === 'success'
              ? 'bg-[#F0F7F3] border-[#C3E6D3] text-[#2D6A4F]'
              : 'bg-[#FDF2F2] border-[#F0C9C9] text-[#A93226]'
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="flex items-center gap-2.5">
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-50 hover:opacity-100 transition-opacity"
          >
            &times;
          </button>
        </div>
      )}

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E4E1DA] p-3 rounded-[4px]">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search collections or seasons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 h-[38px] text-[12px] rounded-[4px] border border-[#E2DED6] bg-[#FFFFFF] text-[#202020] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>
        <div
          className="text-[11px] text-[#99958D] font-normal self-end sm:self-center"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {collections.length} {collections.length === 1 ? 'Collection' : 'Collections'} Total
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-[4px] overflow-hidden">
        {isLoading ? (
          <div className="h-[140px] flex flex-col items-center justify-center">
            <p
              className="text-[12px] text-[#68655F] font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Loading collections…
            </p>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="h-[130px] flex flex-col items-center justify-center text-center px-4">
            <h3
              className="text-[13px] font-medium text-[#171717]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {searchQuery ? 'No matching collections found' : 'No collections created yet'}
            </h3>
            <p
              className="text-[11px] text-[#99958D] mt-1 max-w-xs font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {searchQuery
                ? 'Try adjusting your search terms.'
                : 'Click "Add Collection" above to create your first seasonal couture edit.'}
            </p>
          </div>
        ) : (
          <CollectionListTable
            collections={filteredCollections}
            onEdit={(col) => {
              setEditingCollection(col);
              setActiveModal('edit');
            }}
            onDelete={(col) => setDeletingCollection(col)}
            onMoveUp={(idx) => handleMove(idx, 'up')}
            onMoveDown={(idx) => handleMove(idx, 'down')}
            isReordering={isReordering}
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      <CollectionFormModal
        isOpen={activeModal !== null}
        onClose={() => {
          setActiveModal(null);
          setEditingCollection(null);
        }}
        onSubmit={activeModal === 'create' ? handleCreate : handleEdit}
        initialData={editingCollection}
        defaultOrder={collections.length}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingCollection !== null}
        onClose={() => setDeletingCollection(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Collection "${deletingCollection?.name}"?`}
        description="Are you sure you want to permanently delete this collection? This action cannot be undone."
        warningText="Products currently linked to this collection will remain safe in the atelier catalogue (their collection reference will automatically be set to unassigned)."
        isLoading={isDeleting}
      />
    </div>
  );
}
