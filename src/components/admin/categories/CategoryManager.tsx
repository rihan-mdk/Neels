'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  CategoryRecord,
  CategoryFormData,
} from '@/lib/validations/category.schema';
import {
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  reorderAdminCategories,
} from '@/lib/services/catalog-admin.service';
import CategoryListTable from './CategoryListTable';
import CategoryFormModal from './CategoryFormModal';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

interface CategoryManagerProps {
  initialCategories?: CategoryRecord[];
}

export default function CategoryManager({
  initialCategories = [],
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryRecord[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(!initialCategories.length);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminCategories();
      setCategories(data);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to fetch categories.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto clear feedback after 6 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleCreate = async (data: CategoryFormData, file?: File) => {
    const newCategory = await createAdminCategory(data, file);
    setCategories((prev) => [...prev, newCategory].sort((a, b) => a.display_order - b.display_order));
    setFeedback({
      type: 'success',
      message: `Category "${newCategory.name}" created successfully.`,
    });
  };

  const handleEdit = async (data: CategoryFormData, file?: File) => {
    if (!editingCategory) return;
    const updated = await updateAdminCategory(
      editingCategory.slug,
      data,
      file,
      editingCategory.image
    );
    setCategories((prev) =>
      prev.map((c) => (c.slug === editingCategory.slug ? updated : c))
    );
    setFeedback({
      type: 'success',
      message: `Category "${updated.name}" updated successfully.`,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      setIsDeleting(true);
      await deleteAdminCategory(deletingCategory.slug, deletingCategory.image);
      setCategories((prev) => prev.filter((c) => c.slug !== deletingCategory.slug));
      setFeedback({
        type: 'success',
        message: `Category "${deletingCategory.name}" has been removed.`,
      });
      setDeletingCategory(null);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete category.',
      });
      setDeletingCategory(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (isReordering) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const [moved] = newCategories.splice(index, 1);
    newCategories.splice(targetIndex, 0, moved);

    // Reassign display_order
    const reordered = newCategories.map((c, idx) => ({ ...c, display_order: idx }));
    setCategories(reordered);

    try {
      setIsReordering(true);
      await reorderAdminCategories(reordered.map((c) => c.slug));
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update order.',
      });
      // Revert on failure
      loadCategories();
    } finally {
      setIsReordering(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.plural_name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#181515]">
            Categories
          </h1>
          <p className="text-xs text-[#8E867E] mt-0.5">
            Manage atelier departments, storefront navigation paths, and cover imagery
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadCategories}
            disabled={isLoading}
            className="p-2.5 bg-[#FFFDFC] border border-[#E5DFD7] text-[#5A524D] hover:text-[#181515] rounded-lg shadow-2xs hover:bg-[#F7F5F0] transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setActiveModal('create');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#181515] hover:bg-[#2A2421] text-[#FFFDFC] text-xs font-medium uppercase tracking-wider rounded-lg shadow-sm transition-colors"
          >
            <Plus size={15} />
            <span>Add Category</span>
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
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E5DFD7] bg-[#FBF9F5] text-[#181515] placeholder-[#8E867E] focus:outline-none focus:border-[#B07D3E]"
          />
        </div>
        <div className="text-xs text-[#8E867E] font-medium self-end sm:self-center">
          {categories.length} {categories.length === 1 ? 'Category' : 'Categories'} Total
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-[#FFFDFC] border border-[#E5DFD7] rounded-xl shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <Loader2 size={28} className="text-[#B07D3E] animate-spin mb-3" />
            <p className="text-xs text-[#8E867E]">Loading categories from Supabase...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#181515]/5 text-[#8E867E] flex items-center justify-center mb-4">
              <FolderTree size={26} />
            </div>
            <h3 className="text-sm font-semibold text-[#181515]">
              {searchQuery ? 'No matching categories found' : 'No categories created yet'}
            </h3>
            <p className="text-xs text-[#8E867E] mt-1 max-w-sm">
              {searchQuery
                ? 'Try adjusting your search terms.'
                : 'Click "Add Category" above to create your first atelier category.'}
            </p>
          </div>
        ) : (
          <CategoryListTable
            categories={filteredCategories}
            onEdit={(cat) => {
              setEditingCategory(cat);
              setActiveModal('edit');
            }}
            onDelete={(cat) => setDeletingCategory(cat)}
            onMoveUp={(idx) => handleMove(idx, 'up')}
            onMoveDown={(idx) => handleMove(idx, 'down')}
            isReordering={isReordering}
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      <CategoryFormModal
        isOpen={activeModal !== null}
        onClose={() => {
          setActiveModal(null);
          setEditingCategory(null);
        }}
        onSubmit={activeModal === 'create' ? handleCreate : handleEdit}
        initialData={editingCategory}
        defaultOrder={categories.length}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingCategory !== null}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Category "${deletingCategory?.name}"?`}
        description="Are you sure you want to permanently delete this category? This action cannot be undone."
        warningText="Category deletion will be rejected by the database if any products are currently linked to this category (Foreign Key RESTRICT)."
        isLoading={isDeleting}
      />
    </div>
  );
}
