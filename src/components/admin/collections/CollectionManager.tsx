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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#181515]">
            Collections
          </h1>
          <p className="text-xs text-[#8E867E] mt-0.5">
            Manage seasonal couture stories, curatorial edits, and campaign imagery
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadCollections}
            disabled={isLoading}
            className="p-2.5 bg-[#FFFDFC] border border-[#E5DFD7] text-[#5A524D] hover:text-[#181515] rounded-lg shadow-2xs hover:bg-[#F7F5F0] transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingCollection(null);
              setActiveModal('create');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#181515] hover:bg-[#2A2421] text-[#FFFDFC] text-xs font-medium uppercase tracking-wider rounded-lg shadow-sm transition-colors"
          >
            <Plus size={15} />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-[#EBF7EE] border-[#C2E8C8] text-[#1E7E34]'
              : 'bg-[#FDEDEC] border-[#FADBD8] text-[#C0392B]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={16} className="shrink-0" />
            ) : (
              <AlertCircle size={16} className="shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            &times;
          </button>
        </div>
      )}

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFDFC] border border-[#E5DFD7] p-3 rounded-xl shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E867E]"
          />
          <input
            type="text"
            placeholder="Search collections or seasons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E5DFD7] bg-[#FBF9F5] text-[#181515] placeholder-[#8E867E] focus:outline-none focus:border-[#B07D3E]"
          />
        </div>
        <div className="text-xs text-[#8E867E] font-medium self-end sm:self-center">
          {collections.length} {collections.length === 1 ? 'Collection' : 'Collections'} Total
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-[#FFFDFC] border border-[#E5DFD7] rounded-xl shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <Loader2 size={28} className="text-[#B07D3E] animate-spin mb-3" />
            <p className="text-xs text-[#8E867E]">Loading collections from Supabase...</p>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#181515]/5 text-[#8E867E] flex items-center justify-center mb-4">
              <Sparkles size={26} />
            </div>
            <h3 className="text-sm font-semibold text-[#181515]">
              {searchQuery ? 'No matching collections found' : 'No collections created yet'}
            </h3>
            <p className="text-xs text-[#8E867E] mt-1 max-w-sm">
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
