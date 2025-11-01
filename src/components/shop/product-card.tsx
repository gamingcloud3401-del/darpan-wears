"use client";

import Image from 'next/image';
import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      className="overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[4/5]">
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 flex-grow">
        <CardTitle className="text-sm sm:text-lg font-semibold leading-tight mb-2">{product.name}</CardTitle>
        <Badge variant="secondary" className="text-xs">{product.category}</Badge>
      </CardContent>
      <CardFooter className="p-2 sm:p-4 pt-0">
        {product.offerPrice ? (
          <div className="flex items-baseline gap-2">
            <p className="text-base sm:text-xl font-bold text-primary">
              ₹{product.offerPrice.toFixed(2)}
            </p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground line-through">
              ₹{product.price.toFixed(2)}
            </p>
          </div>
        ) : (
          <p className="text-base sm:text-xl font-bold text-primary">
            ₹{product.price.toFixed(2)}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
