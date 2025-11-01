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
      className="overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[1/1.25] w-full">
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow flex flex-col">
        <CardTitle className="text-sm font-semibold leading-tight mb-1">{product.name}</CardTitle>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 self-start">{product.category}</Badge>
      </CardContent>
      <CardFooter className="p-3 pt-0 mt-auto">
        {product.offerPrice ? (
          <div className="flex items-baseline gap-2">
            <p className="text-base font-bold text-primary">
              ₹{product.offerPrice.toFixed(2)}
            </p>
            <p className="text-xs font-medium text-muted-foreground line-through">
              ₹{product.price.toFixed(2)}
            </p>
          </div>
        ) : (
          <p className="text-base font-bold text-primary">
            ₹{product.price.toFixed(2)}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
