import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';

const VariationModal = ({ onAddVariation }) => {
  const [variation, setVariation] = useState({
    size: '',
    color: '',
    price: '',
    salePrice: '',
    image: '',
    gallery: [],
    sku: '',
    quantity: '',
  });

  const handleChange = (e) => {
    setVariation({ ...variation, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!variation.size || !variation.color || !variation.price || !variation.sku) {
      toast.error("Required fields missing");
      return;
    }
    onAddVariation(variation);
    setVariation({ size: '', color: '', price: '', salePrice: '', image: '', gallery: [], sku: '', quantity: '' });
    toast.success("Variation added");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-2">Add Variation</Button>
      </DialogTrigger>
      <DialogContent className="text-black space-y-4">
        <Input name="size" placeholder="Size" onChange={handleChange} />
        <Input name="color" placeholder="Color" onChange={handleChange} />
        <Input name="price" placeholder="Price" type="number" onChange={handleChange} />
        <Input name="salePrice" placeholder="Sale Price" type="number" onChange={handleChange} />
        <Input name="sku" placeholder="SKU" onChange={handleChange} />
        <Input name="quantity" placeholder="Quantity" type="number" onChange={handleChange} />
        <Input name="image" placeholder="Main Image URL" onChange={handleChange} />
        <Button onClick={handleAdd}>Save Variation</Button>
      </DialogContent>
    </Dialog>
  );
};

export default VariationModal;
