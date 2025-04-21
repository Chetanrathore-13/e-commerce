import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel } from './ui/alert-dialog';
import { Loader } from 'lucide-react'; // Optional loader icon

const BrandList = ({ refresh, onEdit }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/brand/getBrands'); // Replace with your actual endpoint
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      toast.error('Failed to fetch brands.');
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/brand/deleteBrand/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Brand deleted');
        setBrands((prev) => prev.filter((b) => b._id !== id));
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error('Failed to delete brand');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (brand) => {
    onEdit(brand); // Pass the brand to the parent
  };

  useEffect(() => {
    fetchBrands();
  }, [refresh]); // Now properly refreshes on external changes

  if (loading) {
    return (
      <div className="text-center p-6 text-black">
        Loading... <Loader className="animate-spin inline" />
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-6 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Brand List</h2>
      {brands.length === 0 ? (
        <p>No brands found.</p>
      ) : (
        <ul className="space-y-4">
          {brands.map((brand) => (
            <li key={brand._id} className="flex items-center justify-between border p-3 rounded">
              <span>{brand.name}</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(brand)}
                  className="bg-black text-white"
                  size="sm"
                >
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === brand._id}
                    >
                      {deletingId === brand._id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <p>Are you sure you want to delete "{brand.name}"?</p>
                    <div className="mt-4 flex justify-end gap-2">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteBrand(brand._id)}>
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

export default BrandList;
