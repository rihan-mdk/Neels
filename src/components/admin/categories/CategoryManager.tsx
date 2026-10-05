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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-[#E4E1DA] pb-5">
        <div>
          <h1
            className="text-3xl md:text-[32px] font-normal text-[#171717] tracking-tight leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Categories
          </h1>
          <p
            className="text-[12px] text-[#68655F] mt-1.5 font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Manage atelier silhouettes, navigation taxonomies, and cover editorial imagery
          </p>
        </div>
        <div className="flex items-center gap-3.5 flex-shrink-0">
          <button
            type="button"
            onClick={loadCategories}
            disabled={isLoading}
            className="w-[38px] h-[38px] flex items-center justify-center bg-[#FFFFFF] hover:bg-[#EAE7E0] border border-[#111111] text-[#111111] hover:text-[#111111] transition-colors duration-150 disabled:opacity-40 rounded-[6px] shadow-xs cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw size={15} strokeWidth={2} className={`text-[#111111] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setActiveModal('create');
            }}
            className="inline-flex items-center justify-center h-[38px] min-w-[130px] px-5 bg-[#FFFFFF] hover:bg-[#EAE7E0] border border-[#111111] text-[#111111] hover:text-[#111111] text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors duration-150 rounded-[6px] shadow-xs cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Add Category
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
            placeholder="Search categories..."
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
          {categories.length} {categories.length === 1 ? 'Category' : 'Categories'} Total
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
              Loading categories…
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="h-[130px] flex flex-col items-center justify-center text-center px-4">
            <h3
              className="text-[13px] font-medium text-[#171717]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {searchQuery ? 'No matching categories found' : 'No categories created yet'}
            </h3>
            <p
              className="text-[11px] text-[#99958D] mt-1 max-w-xs font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
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
