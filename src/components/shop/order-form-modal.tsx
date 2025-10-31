"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface OrderFormModalProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function OrderFormModal({ product, isOpen, onOpenChange }: OrderFormModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
        title: "Order Placed!",
        description: `Your order for ${product.name} has been received.`,
        variant: "default"
    });
    setTimeout(() => {
        onOpenChange(false);
        // Reset state after modal closes
        setTimeout(() => setIsSubmitted(false), 500);
    }, 3000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        onOpenChange(open);
        if(!open) setTimeout(() => setIsSubmitted(false), 500);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Order</DialogTitle>
          <DialogDescription>
            You're ordering the {product.name}. Please provide your details below.
          </DialogDescription>
        </DialogHeader>
        
        {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">Thank You!</h3>
                <p className="text-muted-foreground mt-2">Your order has been placed successfully.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input id="name" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                        Address
                    </Label>
                    <Input id="address" required className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full">Place Order</Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
