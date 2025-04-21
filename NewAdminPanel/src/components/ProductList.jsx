import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel } from './ui/alert-dialog';
import VariationModal from './VariationModal';

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [activeProductId, setActiveProductId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/product/getAllProducts', {
        method: 'GET',
      });
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/product/deleteProduct/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Product deleted");
        setProducts(products.filter((p) => p._id !== id));
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const addVariation = async (productId, variation) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/product/addVariations/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variation),
      });

      if (!res.ok) throw new Error();

      toast.success('Variation added');
      fetchProducts(); // refresh list to show updated variations
    } catch {
      toast.error('Failed to add variation');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center p-6"><Loader className="animate-spin inline" /> Loading...</div>;
  }

  return (
    <div className="p-6 mt-6 bg-white rounded shadow text-black">
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow-sm space-y-2">
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-sm">Tags: {p.tags?.join(', ')}</p>

              <div className="flex gap-2 justify-end">
                <Button size="sm" onClick={() => onEdit(p)}>Edit</Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deletingId === p._id}>
                      {deletingId === p._id ? "Deleting..." : "Delete"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <p>Are you sure you want to delete {p.name}?</p>
                    <div className="mt-4 flex justify-end gap-2">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteProduct(p._id)}>Confirm</AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>

                <VariationModal
                  onAddVariation={(variation) => addVariation(p._id, variation)}
                  triggerLabel="Add Variation"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
