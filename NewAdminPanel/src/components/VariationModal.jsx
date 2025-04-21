import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';

const VariationModal = ({ onAddVariation,productId }) => {
  
  const [variation, setVariation] = useState({
    size: '',
    color: '',
    price: '',
    salePrice: '',
    sku: '',
    quantity: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setVariation({ ...variation, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!variation.size || !variation.color || !variation.price || !variation.sku) {
      toast.error("Required fields missing");
      return;
    }

    const formData = new FormData();
    formData.append('size', variation.size);
    formData.append('color', variation.color);
    formData.append('price', variation.price);
    formData.append('salePrice', variation.salePrice);
    formData.append('sku', variation.sku);
    formData.append('quantity', variation.quantity);
    if (imageFile) formData.append('image', imageFile);
    if (galleryFiles.length > 0) {
      Array.from(galleryFiles).forEach((file) => formData.append('gallery', file));
    }

    try {
      setUploading(true);

      const response = await fetch(`http://localhost:8000/api/v1/product/addVariation/${productId}`, {
        method: 'POST',
        body: formData,
      });
      console.log(response);

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();

      onAddVariation(data);
      toast.success("Variation added");

      setVariation({
        size: '', color: '', price: '', salePrice: '', sku: '', quantity: '',
      });
      setImageFile(null);
      setGalleryFiles([]);
    } catch (error) {
      toast.error(error.message || 'Error uploading variation');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-2">Add Variation</Button>
      </DialogTrigger>
      <DialogContent className="text-black space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          <Input name="size" placeholder="Size (e.g. M)" onChange={handleChange} value={variation.size} />
          <Input name="color" placeholder="Color" onChange={handleChange} value={variation.color} />
          <Input name="price" placeholder="Price" type="number" onChange={handleChange} value={variation.price} />
          <Input name="salePrice" placeholder="Sale Price" type="number" onChange={handleChange} value={variation.salePrice} />
          <Input name="sku" placeholder="SKU" onChange={handleChange} value={variation.sku} />
          <Input name="quantity" placeholder="Quantity" type="number" onChange={handleChange} value={variation.quantity} />
        </div>

        <div>
          <label className="block font-medium mb-1">Main Image</label>
          <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block font-medium mb-1">Gallery Images</label>
          <Input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(e.target.files)} />
        </div>

        <Button onClick={handleAdd} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save Variation'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default VariationModal;
