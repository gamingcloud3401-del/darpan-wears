"use client";

import { useTransition, useState, useMemo } from "react";
import type { Product, Settings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { removeProductAction } from "@/app/actions";
import AddProductForm from "./add-product-form";
import EditProductForm from "./edit-product-form";
import SettingsForm from "./settings-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { LogOut, Trash2, Loader2, Pencil, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AdminViewProps {
  products: Product[];
  settings?: Settings;
  loading: boolean;
  onLogout: () => void;
}

export default function AdminView({ products, settings, loading, onLogout }: AdminViewProps) {
  const [isPending, startTransition] = useTransition();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleRemoveProduct = (productId: string) => {
    startTransition(async () => {
      const result = await removeProductAction(productId);
      if (result.success) {
        toast({ title: "Success", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };
  
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Admin Dashboard</h3>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
      
      <SettingsForm settings={settings} />
      <AddProductForm />

      <Card>
        <CardHeader>
          <CardTitle>Existing Products</CardTitle>
          <CardDescription>Search, view, edit, or delete existing products.</CardDescription>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or product ID..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-20 rounded-md" />
                  </div>
                ))
              ) : filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted/50">
                  <Image src={product.imageUrls[0]} alt={product.name} width={64} height={64} className="rounded-md object-cover aspect-square" />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                     {product.offerPrice ? (
                      <p className="text-sm">
                        <span className="text-destructive font-semibold">₹{product.offerPrice.toFixed(2)}</span>
                        <span className="text-muted-foreground line-through ml-2">₹{product.price.toFixed(2)}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">₹{product.price.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={isPending}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product
                            "{product.name}" from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveProduct(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isPending}
                          >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {editingProduct && (
        <EditProductForm 
            product={editingProduct}
            isOpen={!!editingProduct}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    handleCloseEdit();
                }
            }}
        />
      )}
    </div>
  );
}
