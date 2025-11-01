
"use client";

import type { Product } from "@/lib/types";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Frown, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useRef, useCallback } from "react";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onProductClick: (product: Product) => void;
  loadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  isSearching: boolean;
}

export default function ProductList({ products, loading, onProductClick, loadMore, hasMore, loadingMore, isSearching }: ProductListProps) {
  const observer = useRef<IntersectionObserver>();
  const lastProductElementRef = useCallback(node => {
    if (loadingMore || isSearching) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, loadMore, isSearching]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 opacity-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] sm:h-[250px] w-full rounded-lg" />
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
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {products.map((product, index) => {
           if (products.length === index + 1) {
            return <div ref={lastProductElementRef} key={product.id}><ProductCard product={product} onClick={() => onProductClick(product)} /></div>
           } else {
            return <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
           }
        })}
      </div>
      
      {!isSearching && (
        <div className="flex justify-center mt-8">
            {loadingMore ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : hasMore ? (
                <Button onClick={loadMore} variant="outline">Load More</Button>
            ) : (
                <p className="text-muted-foreground">You've reached the end!</p>
            )}
        </div>
      )}
    </>
  );
}
