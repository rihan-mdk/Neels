'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  Shirt,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  ProductRecord,
  ProductFormData,
  ProductQueryOptions,
  PaginatedProductsResult,
} from '@/lib/validations/product.schema';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleProductActiveStatus,
  toggleProductFeaturedStatus,
  cloneAdminProduct,
} from '@/lib/services/product-admin.service';
import ProductListTable from './ProductListTable';
import ProductFilterToolbar from './ProductFilterToolbar';
import AdminPagination from './AdminPagination';
import ProductFormModal from './ProductFormModal';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

interface CategoryOption { slug: string; name: string; }
interface CollectionOption { slug: string; name: string; }

interface ProductManagerProps {
  initialResult: PaginatedProductsResult;
  categories: CategoryOption[];
  collections: CollectionOption[];
}

const PAGE_SIZE = 10;

export default function ProductManager({
  initialResult,
  categories,
  collections,
}: ProductManagerProps) {
  const [result, setResult] = useState<PaginatedProductsResult>(initialResult);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ProductQueryOptions>({
    page: 1,
    pageSize: PAGE_SIZE,
    searchQuery: '',
    categorySlug: 'all',
    collectionSlug: 'all',
    status: 'all',
    featuredOnly: false,
    newOnly: false,
  });

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'clone' | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  // Debounced search
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadProducts = useCallback(
    async (queryFilters: ProductQueryOptions) => {
      try {
        setIsLoading(true);
        const data = await fetchAdminProducts(queryFilters);
        setResult(data);
      } catch (err) {
        setFeedback({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to load products.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleFiltersChange = (next: Partial<ProductQueryOptions>) => {
    const merged = { ...filters, ...next };
    setFilters(merged);

    if (next.searchQuery !== undefined) {
      // Debounce search
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        loadProducts(merged);
      }, 350);
    } else {
      loadProducts(merged);
    }
  };

  const handlePageChange = (page: number) => {
    const merged = { ...filters, page };
    setFilters(merged);
    loadProducts(merged);
  };

  // Auto clear feedback after 6 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleCreate = async (
    data: ProductFormData,
    files: { primary?: File; hover?: File; galleryNew?: File[] },
    removedImageUrls: string[]
  ) => {
    await createAdminProduct(data, {
      primary: files.primary,
      hover: files.hover,
      gallery: files.galleryNew,
    });
    await loadProducts(filters);
    setFeedback({ type: 'success', message: `Product "${data.name}" created successfully.` });
  };

  const handleEdit = async (
    data: ProductFormData,
    files: { primary?: File; hover?: File; galleryNew?: File[] },
    removedImageUrls: string[]
  ) => {
    if (!editingProduct) return;
    await updateAdminProduct(editingProduct.id, data, files, removedImageUrls);
    await loadProducts(filters);
    setFeedback({ type: 'success', message: `Product "${data.name}" updated successfully.` });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      setIsDeleting(true);
      const allUrls = [
        deletingProduct.image_primary,
        ...(deletingProduct.image_hover ? [deletingProduct.image_hover] : []),
        ...(deletingProduct.image_gallery || []),
      ].filter(Boolean);

      const result = await deleteAdminProduct(deletingProduct.id, allUrls);
      await loadProducts(filters);

      if (result.warning) {
        setFeedback({ type: 'warning', message: result.warning });
      } else {
        setFeedback({
          type: 'success',
          message: `Product "${deletingProduct.name}" has been deleted.`,
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete product.',
      });
    } finally {
      setIsDeleting(false);
      setDeletingProduct(null);
    }
  };

  const handleCloneSubmit = async (
    data: ProductFormData,
    files: { primary?: File; hover?: File; galleryNew?: File[] },
    removedImageUrls: string[]
  ) => {
    if (!editingProduct) return;
    await cloneAdminProduct(editingProduct.id);
    await loadProducts(filters);
    setFeedback({
      type: 'success',
      message: `Cloned "${editingProduct.name}" as draft. You can edit it in the product list.`,
    });
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await toggleProductActiveStatus(id, !current);
      setResult((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === id ? { ...p, is_active: !current } : p
        ),
      }));
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update product status.',
      });
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await toggleProductFeaturedStatus(id, !current);
      setResult((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === id ? { ...p, is_featured: !current } : p
        ),
      }));
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update featured status.',
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-[#E7E4DD] pb-5">
        <div>
          <h1
            className="text-3xl md:text-4xl font-light text-[#171717]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Product Catalog
          </h1>
          <p
            className="text-[10px] text-[#9B9891] mt-1 font-normal tracking-wide"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Manage all your silhouettes, fabrics, pricing, and editorial imagery
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => loadProducts(filters)}
            disabled={isLoading}
            className="h-[34px] w-[34px] flex items-center justify-center bg-[#FFFFFF] border border-[#E4E1DA] text-[#6F6D68] hover:text-[#171717] hover:bg-[#F7F6F2] transition-colors duration-150 disabled:opacity-40 rounded-[3px]"
            title="Refresh list"
          >
            <RefreshCw size={13} strokeWidth={1.4} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setActiveModal('create');
            }}
            className="inline-flex items-center gap-1.5 h-[34px] px-4 bg-[#111111] hover:bg-[#262626] text-white text-[10px] font-normal uppercase tracking-[0.12em] transition-colors duration-150 rounded-[3px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Plus size={13} strokeWidth={1.5} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`px-4 py-3 border flex items-center justify-between text-[11px] rounded-[3px] ${
            feedback.type === 'success'
              ? 'bg-[#F0F7F3] border-[#C3E6D3] text-[#2D6A4F]'
              : feedback.type === 'warning'
              ? 'bg-[#FEFAF0] border-[#F0DFA8] text-[#7A6200]'
              : 'bg-[#FDF2F2] border-[#F0C9C9] text-[#A93226]'
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={14} strokeWidth={1.5} className="shrink-0" />
            ) : feedback.type === 'warning' ? (
              <AlertTriangle size={14} strokeWidth={1.5} className="shrink-0" />
            ) : (
              <AlertCircle size={14} strokeWidth={1.5} className="shrink-0" />
            )}
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

      {/* Filter Toolbar */}
      <ProductFilterToolbar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        collections={collections}
        totalCount={result.totalCount}
      />

      {/* Product Table */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DD] overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <Loader2 size={22} strokeWidth={1.3} className="text-[#9B9891] animate-spin mb-3" />
            <p
              className="text-[11px] text-[#9B9891] font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Loading products…
            </p>
          </div>
        ) : result.products.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-[#F7F6F2] border border-[#E7E4DD] text-[#9B9891] flex items-center justify-center mb-4">
              <Shirt size={20} strokeWidth={1.3} />
            </div>
            <h3
              className="text-[13px] font-normal text-[#171717]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              No products found
            </h3>
            <p
              className="text-[11px] text-[#9B9891] mt-1.5 max-w-xs leading-relaxed font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {filters.searchQuery
                ? 'Try adjusting your search or filters.'
                : 'Click \"Add Product\" to create your first atelier piece.'}
            </p>
          </div>
        ) : (
          <>
            <ProductListTable
              products={result.products}
              onEdit={(p) => {
                setEditingProduct(p);
                setActiveModal('edit');
              }}
              onClone={(p) => {
                setEditingProduct(p);
                setActiveModal('clone');
              }}
              onDelete={(p) => setDeletingProduct(p)}
              onToggleActive={handleToggleActive}
              onToggleFeatured={handleToggleFeatured}
            />
            <AdminPagination
              page={result.page}
              totalPages={result.totalPages}
              totalCount={result.totalCount}
              pageSize={result.pageSize}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Create / Edit / Clone Modal */}
      <ProductFormModal
        isOpen={activeModal !== null}
        onClose={() => {
          setActiveModal(null);
          setEditingProduct(null);
        }}
        onSubmit={
          activeModal === 'create'
            ? handleCreate
            : activeModal === 'clone'
            ? handleCloneSubmit
            : handleEdit
        }
        initialData={editingProduct}
        categories={categories}
        collections={collections}
        isClone={activeModal === 'clone'}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deletingProduct?.name}"?`}
        description="This will permanently remove the product from the database. All associated media files will be cleaned up from storage after the database deletion succeeds."
        warningText="This action cannot be undone. The product will be immediately removed from any active storefront listings."
        isLoading={isDeleting}
      />
    </div>
  );
}
