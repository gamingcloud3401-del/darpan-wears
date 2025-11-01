"use client";

import { useState, useRef, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface OrderFormModalProps {
  product: Product;
  size: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function OrderFormModal({ product, size, isOpen, onOpenChange }: OrderFormModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const price = product.offerPrice || product.price;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload the audio when the component mounts if it's not already loaded
    if (typeof window !== "undefined" && !audioRef.current) {
        audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_c848a6323c.mp3");
        audioRef.current.preload = "auto";
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const payment = paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment";

    const message = `New Order Details:\n\nProduct ID: ${product.id}\nProduct: ${product.name}\nSize: ${size}\nPrice: ₹${price.toFixed(2)}\n\nCustomer Info:\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nPayment Method: ${payment}`;
    
    const whatsappUrl = `https://wa.me/9332307996?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');

    if (audioRef.current) {
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }

    setIsSubmitted(true);
    toast({
        title: "Redirecting to WhatsApp",
        description: `Your order for ${product.name} is ready to be sent.`,
        variant: "default"
    });
    setTimeout(() => {
        onOpenChange(false);
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
            You're ordering the {product.name} (Size: {size}). Please provide your details below.
          </DialogDescription>
        </DialogHeader>
        
        {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">Thank You!</h3>
                <p className="text-muted-foreground mt-2">Your order details are ready to be sent via WhatsApp.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">Number</Label>
                        <Input id="phone" name="phone" type="tel" required className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">Address</Label>
                        <Input id="address" name="address" required className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Payment</Label>
                        <RadioGroup defaultValue="cod" onValueChange={setPaymentMethod} className="col-span-3 flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cod" id="cod" />
                                <Label htmlFor="cod">Cash on Delivery</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="online" id="online" />
                                <Label htmlFor="online">Online Payment</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full">Send Order via WhatsApp</Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
