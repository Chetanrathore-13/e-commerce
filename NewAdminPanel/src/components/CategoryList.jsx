import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel } from './ui/alert-dialog';
import { Loader } from 'lucide-react';

const CategoryList = ({ refresh, onEdit }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/category/getCategories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/category/deleteCategory/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Category deleted');
        setCategories(categories.filter((c) => c._id !== id));
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  const getParentName = (id) => {
    const parent = categories.find((cat) => cat._id === id);
    return parent ? parent.name : '-';
  };

  if (loading) {
    return (
      <div className="text-center p-6 text-black">
        Loading... <Loader className="animate-spin inline" />
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-6 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Category List</h2>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li key={cat._id} className="flex justify-between items-center border p-3 rounded">
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-gray-600">Parent: {getParentName(cat.parent_category_id)}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onEdit(cat)} className="bg-black text-white" size="sm">
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === cat._id}
                    >
                      {deletingId === cat._id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <p>Are you sure you want to delete "{cat.name}"?</p>
                    <div className="mt-4 flex justify-end gap-2">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteCategory(cat._id)}>
                        Confirm
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
