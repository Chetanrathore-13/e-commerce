import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

const BrandForm = ({ brandToEdit, onSuccess }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (brandToEdit) {
      form.reset({ name: brandToEdit.name });
    }
  }, [brandToEdit, form]);

  const onSubmit = async (data) => {
    try {
      if (brandToEdit) {
        // Edit existing brand
        const res = await fetch(`http://localhost:8000/api/v1/brand/updateBrand/${brandToEdit._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error();
        toast.success('Brand updated');
      } else {
        // Add new brand
        const res = await fetch('http://localhost:8000/api/v1/brand/createBrand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error();
        toast.success('Brand added');
      }

      form.reset();
      onSuccess?.(); // Refresh list or reset edit state
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white text-black rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">
        {brandToEdit ? 'Edit Brand' : 'Add Brand'}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter brand name"
                    {...field}
                    className="border border-black bg-white text-black"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-900 transition-colors"
          >
            {brandToEdit ? 'Update Brand' : 'Add Brand'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BrandForm;
