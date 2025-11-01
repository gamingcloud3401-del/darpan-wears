"use client";

import { useState, useMemo, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { useSettings } from "@/hooks/use-settings";
import { seedProducts } from "@/lib/initial-products";
import type { Product } from "@/lib/types";

import Header from "./header";
import ProductList from "./product-list";
import ProductDetailModal from "./product-detail-modal";
import OrderFormModal from "./order-form-modal";
import AdminPanel from "../admin/admin-panel";
import VideoPlayerModal from "./video-player-modal";

export default function ShopPage() {
  const { products, loading: productsLoading } = useProducts();
  const { settings, loading: settingsLoading } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isPromoVideoOpen, setIsPromoVideoOpen] = useState(false);

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

  useEffect(() => {
    if (settings?.promoVideoUrl && typeof window !== "undefined" && !sessionStorage.getItem("promoVideoShown")) {
        setIsPromoVideoOpen(true);
        sessionStorage.setItem("promoVideoShown", "true");
    }
  }, [settings]);

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
    setSelectedSize(size);
    setIsDetailModalOpen(false);
    setIsOrderModalOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        searchTerm={searchTerm} 
        onSearchTermChange={setSearchTerm} 
        onAdminClick={() => setIsAdminPanelOpen(true)}
        settings={settings}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList
          products={filteredProducts}
          loading={productsLoading}
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

      {selectedProduct && selectedSize && (
        <OrderFormModal
            product={selectedProduct}
            size={selectedSize}
            isOpen={isOrderModalOpen}
            onOpenChange={setIsOrderModalOpen}
        />
      )}
      
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onOpenChange={setIsAdminPanelOpen}
        products={products}
        settings={settings}
        loading={productsLoading || settingsLoading}
      />

      {settings?.promoVideoUrl && (
        <VideoPlayerModal
          videoUrl={settings.promoVideoUrl}
          isOpen={isPromoVideoOpen}
          onOpenChange={setIsPromoVideoOpen}
          title="How to Order"
        />
      )}
    </div>
  );
}
