
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Recommendations from "./recommendations";
import { Video } from "lucide-react";
import VideoPlayerModal from "./video-player-modal";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onOrderNow: (product: Product, size: string) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onOpenChange,
  onOrderNow,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes.length === 1 ? product.sizes[0] : undefined);
  const [error, setError] = useState<string | null>(null);
  const [isProductVideoOpen, setIsProductVideoOpen] = useState(false);


  const handleOrderClick = () => {
    if (!selectedSize) {
      setError("Please select a size before ordering.");
      return;
    }
    setError(null);
    onOrderNow(product, selectedSize);
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    if(error) {
        setError(null);
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
          onOpenChange(open);
          if(!open) {
              setError(null);
              setSelectedSize(product.sizes.length === 1 ? product.sizes[0] : undefined);
          }
      }}>
        <DialogContent className="sm:max-w-4xl p-0">
            <ScrollArea className="max-h-[90vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 p-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {product.imageUrls.map((url, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-square md:aspect-auto rounded-lg overflow-hidden h-96">
                          <Image
                            src={url}
                            alt={`${product.name} image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {product.imageUrls.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
                <div className="flex flex-col pt-6 md:pt-0">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">{product.name}</DialogTitle>
                    <DialogDescription className="text-base pt-2">{product.description}</DialogDescription>
                  </DialogHeader>

                  <div className="my-6">
                    {product.offerPrice ? (
                      <div className="flex items-baseline gap-3">
                          <p className="text-3xl font-extrabold text-primary">₹{product.offerPrice.toFixed(2)}</p>
                          <p className="text-xl font-medium text-muted-foreground line-through">₹{product.price.toFixed(2)}</p>
                      </div>
                      ) : (
                          <p className="text-3xl font-extrabold text-primary">₹{product.price.toFixed(2)}</p>
                      )}
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Select Size</Label>
                    <RadioGroup value={selectedSize} onValueChange={handleSizeChange} className="flex flex-wrap gap-4">
                      {product.sizes.map((size) => (
                        <div key={size} className="flex items-center">
                          <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                          <Label
                            htmlFor={`size-${size}`}
                            className="cursor-pointer rounded-md border-2 border-muted bg-popover px-4 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary"
                          >
                            {size}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {error && <p id="selected-size-error" className="text-sm font-medium text-destructive pt-2">{error}</p>}
                  </div>
                  <div className="flex gap-2">
                    {product.videoUrl && (
                        <Button variant="outline" className="mt-4" onClick={() => setIsProductVideoOpen(true)}>
                            <Video className="mr-2 h-4 w-4" />
                            Watch Product Video
                        </Button>
                    )}
                  </div>

                  <Recommendations productDescription={product.description} />
                  
                  <DialogFooter className="mt-4 pt-6 sticky bottom-0 bg-background/95 pb-6">
                    <Button
                      onClick={handleOrderClick}
                      className="w-full bg-primary text-primary-foreground py-6 rounded-lg text-lg font-semibold shadow-md hover:bg-primary/90 transition duration-150"
                    >
                      Order Now
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>

      {product.videoUrl && (
        <VideoPlayerModal 
          videoUrl={product.videoUrl} 
          isOpen={isProductVideoOpen} 
          onOpenChange={setIsProductVideoOpen} 
          title={product.name}
        />
      )}
    </>
  );
}
