"use client";

import type { Product } from "@/lib/types";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Frown } from "lucide-react";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onProductClick: (product: Product) => void;
}

export default function ProductList({ products, loading, onProductClick }: ProductListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <Frown className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">No Products Found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search or check back later.</p>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
      ))}
    </div>
  );
}
