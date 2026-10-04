import React from 'react';
import { createClient } from '@/lib/supabase/server';
import CollectionManager from '@/components/admin/collections/CollectionManager';
import { CollectionRecord } from '@/lib/validations/collection.schema';

export const revalidate = 0; // Fresh database data

export default async function AdminCollectionsPage() {
  const supabase = await createClient();

  const { data: initialCollections } = await supabase
    .from('collections')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  return (
    <CollectionManager
      initialCollections={(initialCollections || []) as CollectionRecord[]}
    />
  );
}
