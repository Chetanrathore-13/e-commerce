import React, { useState } from 'react';
import CategoryForm from '@/components/CategoryForm';
import CategoryList from '@/components/CategoryList';

const CategoryPage = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const triggerRefresh = () => setRefreshFlag((prev) => !prev);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <CategoryForm
        refreshList={triggerRefresh}
        editingCategory={editingCategory}
        clearEdit={() => setEditingCategory(null)}
      />
      <CategoryList
        refresh={refreshFlag}
        onEdit={setEditingCategory}
      />
    </div>
  );
};

export default CategoryPage;
