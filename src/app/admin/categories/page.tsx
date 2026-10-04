import React from 'react';
import { createClient } from '@/lib/supabase/server';
import CategoryManager from '@/components/admin/categories/CategoryManager';
import { CategoryRecord } from '@/lib/validations/category.schema';

export const revalidate = 0; // Fresh database data

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: initialCategories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  return (
    <CategoryManager
      initialCategories={(initialCategories || []) as CategoryRecord[]}
    />
  );
}
