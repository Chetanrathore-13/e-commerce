import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Button } from './ui/button';

const ProductForm = ({ editingProduct, refreshList, clearEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [material, setMaterial] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/brand/getBrands', {
        method: 'GET',
      });
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      toast.error("Failed to fetch brands");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/category/getCategories', { method: 'GET' });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setBrandId(editingProduct.brand_id);
      setCategoryId(editingProduct.category_id);
      setMaterial(editingProduct.material);
      setTags(editingProduct.tags?.join(', '));
      setIsFeatured(editingProduct.is_featured);
      setIsBestSeller(editingProduct.is_best_seller);
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      description,
      brand_id: brandId,
      category_id: categoryId,
      material,
      tags: tags.split(',').map((t) => t.trim()),
      is_featured: isFeatured,
      is_best_seller: isBestSeller,
    };

    try {
      const res = await fetch(editingProduct ? `http://localhost:8000/api/v1/product/updateProduct/${editingProduct._id}` : 'http://localhost:8000/api/v1/product/createProduct', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingProduct ? 'Product updated' : 'Product created');
        clearForm();
        refreshList();
        clearEdit();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setBrandId('');
    setCategoryId('');
    setMaterial('');
    setTags('');
    setIsFeatured(false);
    setIsBestSeller(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow text-black">
      <h2 className="text-xl font-semibold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>

      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required />
      <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      
      <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Select Brand</option>
        {brands.map((b) => (
          <option key={b._id} value={b._id}>{b.name}</option>
        ))}
      </select>

      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Material" />
      <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" />

      <div className="flex items-center gap-4">
        <label>
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          <span className="ml-2">Featured</span>
        </label>
        <label>
          <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
          <span className="ml-2">Best Seller</span>
        </label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
      </Button>
    </form>
  );
};

export default ProductForm;
