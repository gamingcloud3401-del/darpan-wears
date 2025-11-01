
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
import WelcomeLoader from "./welcome-loader";

export default function ShopPage() {
  const { products, loading: productsLoading, loadMore, loadingMore, hasMore, addOptimisticProduct } = useProducts();
  const { settings, loading: settingsLoading } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isPromoVideoOpen, setIsPromoVideoOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);


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
  
  useEffect(() => {
    if (!productsLoading) {
      const timer = setTimeout(() => setShowWelcome(false), 500); // slight delay for fade-out
      return () => clearTimeout(timer);
    } else {
      setShowWelcome(true);
    }
  }, [productsLoading]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
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
      <WelcomeLoader logoUrl={settings?.logoUrl} show={showWelcome} />
      <Header 
        searchTerm={searchTerm} 
        onSearchTermChange={setSearchTerm} 
        onAdminClick={() => setIsAdminPanelOpen(true)}
        settings={settings}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList
          products={filteredProducts}
          loading={productsLoading && showWelcome}
          onProductClick={handleProductClick}
          loadMore={loadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
          isSearching={!!searchTerm}
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
        addOptimisticProduct={addOptimisticProduct}
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
