import React, { useState } from 'react';
import ProductForm from '@/components/ProductForm';
import ProductList from '@/components/ProductList';

const ProductPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const refreshList = () => setRefresh(!refresh);
  const clearEdit = () => setEditingProduct(null);

  return (
    <div className="container mx-auto space-y-8">
      <ProductForm refreshList={refreshList} editingProduct={editingProduct} clearEdit={clearEdit} />
      <ProductList key={refresh} onEdit={setEditingProduct} />
    </div>
  );
};

export default ProductPage;
