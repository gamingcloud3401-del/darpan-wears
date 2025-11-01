"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";

import { addProductAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  offerPrice: z.coerce.number().optional().or(z.literal('')),
  imageUrls: z.string().min(1, "At least one image URL is required.").transform(val => val.split(',').map(s => s.trim())),
  videoUrl: z.string().url("Must be a valid URL.").or(z.literal('')),
  productLink: z.string().url("Must be a valid URL.").or(z.literal('')),
  category: z.string().min(2, "Category must be at least 2 characters."),
  sizes: z.string().min(1, "At least one size is required.").transform(val => val.split(',').map(s => s.trim())),
});

export default function AddProductForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      offerPrice: "",
      imageUrls: "https://picsum.photos/seed/new/600/400",
      videoUrl: "",
      productLink: "",
      category: "",
      sizes: "",
    },
  });

  function onSubmit(values: Omit<z.infer<typeof formSchema>, 'sizes' | 'imageUrls'> & { sizes: string[], imageUrls: string[] }) {
    startTransition(async () => {
      const result = await addProductAction(values);
      if (result.success) {
        toast({ title: "Success", description: result.message });
        form.reset();
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. AeroRun Pro Sneakers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g. 120.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="offerPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Price (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g. 99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the product..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Footwear" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 8, 9, 10" {...field} value={Array.isArray(field.value) ? field.value.join(', ') : field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URLs</FormLabel>
                  <FormControl>
                    <Textarea placeholder="https://..." {...field} value={Array.isArray(field.value) ? field.value.join(', ') : field.value} />
                  </FormControl>
                  <FormDescription>
                    Add multiple image URLs, separated by commas. The first one will be the main image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Video URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="productLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/product/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Product
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
