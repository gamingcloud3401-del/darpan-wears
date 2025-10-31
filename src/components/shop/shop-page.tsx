"use client";

import { useState, useMemo, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { seedProducts } from "@/lib/initial-products";
import type { Product } from "@/lib/types";

import Header from "./header";
import ProductList from "./product-list";
import ProductDetailModal from "./product-detail-modal";
import OrderFormModal from "./order-form-modal";
import AdminPanel from "../admin/admin-panel";

export default function ShopPage() {
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    const doSeed = async () => {
      if (typeof window !== "undefined" && !sessionStorage.getItem("seeded")) {
        const success = await seedProducts();
        if (success) {
          sessionStorage.setItem("seeded", "true");
        }
      }
    };
    doSeed();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleOrderNow = (product: Product, size: string) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(false);
    setIsOrderModalOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        searchTerm={searchTerm} 
        onSearchTermChange={setSearchTerm} 
        onAdminClick={() => setIsAdminPanelOpen(true)}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList
          products={filteredProducts}
          loading={loading}
          onProductClick={handleProductClick}
        />
      </main>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          onOrderNow={handleOrderNow}
        />
      )}

      {selectedProduct && (
        <OrderFormModal
            product={selectedProduct}
            isOpen={isOrderModalOpen}
            onOpenChange={setIsOrderModalOpen}
        />
      )}
      
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onOpenChange={setIsAdminPanelOpen}
        products={products}
        loading={loading}
      />
    </div>
  );
}
