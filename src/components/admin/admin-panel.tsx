
"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import AdminLogin from "./admin-login";
import AdminView from "./admin-view";
import type { Product, Settings } from "@/lib/types";

interface AdminPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  products: Product[];
  settings?: Settings;
  loading: boolean;
  addOptimisticProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  onProductAdded: () => void;
  removeOptimisticProduct: (productId: string) => void;
}

export default function AdminPanel({ isOpen, onOpenChange, products, settings, loading, addOptimisticProduct, onProductAdded, removeOptimisticProduct }: AdminPanelProps) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
      setIsAdminLoggedIn(loggedIn);
    }
  }, [isOpen]);

  const handleLoginSuccess = () => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem("isAdminLoggedIn", "true");
    }
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem("isAdminLoggedIn");
    }
    setIsAdminLoggedIn(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Admin Panel</SheetTitle>
          <SheetDescription>
            {isAdminLoggedIn ? "Manage your products and site settings." : "Please login to continue."}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          {isAdminLoggedIn ? (
            <AdminView 
              products={products} 
              settings={settings} 
              loading={loading} 
              onLogout={handleLogout}
              addOptimisticProduct={addOptimisticProduct}
              onProductAdded={onProductAdded}
              removeOptimisticProduct={removeOptimisticProduct}
            />
          ) : (
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
