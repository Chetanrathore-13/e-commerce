import React, { useState } from 'react';
import BrandForm from '@/components/brandForm';
import BrandList from '@/components/brandList';

const BrandPage = () => {
  const [brandToEdit, setBrandToEdit] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleSuccess = () => {
    setBrandToEdit(null);
    setRefresh((prev) => !prev); // toggle refresh to reload list
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-black text-center">Brand Management</h1>
      <BrandForm brandToEdit={brandToEdit} onSuccess={handleSuccess} />
      <BrandList refresh={refresh} onEdit={setBrandToEdit} />
    </div>
  );
};

export default BrandPage;
