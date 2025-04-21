import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';

const CategoryForm = ({ refreshList, editingCategory, clearEdit }) => {
  const [name, setName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/category/getCategories'); // Replace with your actual endpoint
        const data = await res.json();
        setAllCategories(data);
      } catch (err) {
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setParentCategoryId(editingCategory.parent_category_id || '');
    } else {
      setName('');
      setParentCategoryId('');
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const payload = {
      name,
      parent_category_id: parentCategoryId || null,
    };
  
    const url = editingCategory
      ? `http://localhost:8000/api/v1/category/updateCategory/${editingCategory._id}`
      : `http://localhost:8000/api/v1/category/createCategory`;
  
    const method = editingCategory ? 'PUT' : 'POST';
  
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        toast.success(editingCategory ? 'Category updated' : 'Category added');
        setName('');
        setParentCategoryId('');
        refreshList();
        clearEdit();
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Failed to save category');
      }
    } catch (err) {
      toast.error('Something went wrong while saving the category');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Parent Category (optional)</label>
        <select
          className="w-full p-2 border rounded"
          value={parentCategoryId}
          onChange={(e) => setParentCategoryId(e.target.value)}
        >
          <option value="">None</option>
          {allCategories
            .filter((cat) => !editingCategory || cat._id !== editingCategory._id)
            .map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="bg-black text-white" disabled={loading}>
          {loading ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
        </Button>
        {editingCategory && (
          <Button type="button" onClick={clearEdit} variant="outline">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
