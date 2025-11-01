"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp, limit, startAfter, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";

const PAGE_SIZE = 8;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);

  const fetchInitialProducts = useCallback(() => {
    setLoading(true);
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const productsData: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({ 
              id: doc.id, 
              ...data,
              createdAt: (data.createdAt as Timestamp)?.toDate() 
            } as Product);
        });
        setProducts(productsData);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === PAGE_SIZE);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);
  
  useEffect(() => {
    const unsubscribe = fetchInitialProducts();
    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, [fetchInitialProducts]);


  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDoc) return;

    setLoadingMore(true);

    const q = query(
      collection(db, "products"), 
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );

    try {
      const querySnapshot = await getDocs(q);
      const newProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newProducts.push({ 
            id: doc.id, 
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate() 
          } as Product);
      });

      setProducts(prev => [...prev, ...newProducts]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === PAGE_SIZE);
    } catch(error) {
        console.error("Error loading more products: ", error);
    } finally {
        setLoadingMore(false);
    }

  }, [lastDoc, hasMore, loadingMore]);


  return { products, loading, loadMore, loadingMore, hasMore };
}
