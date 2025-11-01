"use server";

import { revalidatePath } from "next/cache";
import { addDoc, collection, deleteDoc, doc, setDoc, getDocs, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/types";

export async function addProductAction(productData: Omit<Product, "id" | "createdAt">) {
  try {
    const productToAdd = {
      ...productData,
      imageUrls: productData.imageUrls.filter(url => url.trim() !== ""),
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "products"), productToAdd);
    revalidatePath("/");
    return { success: true, message: "Product added successfully." };
  } catch (error) {
    console.error("Error adding product: ", error);
    return { success: false, message: "Failed to add product." };
  }
}

export async function updateProductAction(productId: string, productData: Partial<Omit<Product, "id">>) {
  try {
    const productRef = doc(db, "products", productId);
    const productToUpdate = {
        ...productData,
        imageUrls: productData.imageUrls?.filter(url => url.trim() !== "") || [],
    }
    await updateDoc(productRef, productToUpdate);
    revalidatePath("/");
    return { success: true, message: "Product updated successfully." };
  } catch (error) {
    console.error("Error updating product: ", error);
    return { success: false, message: "Failed to update product." };
  }
}

export async function removeProductAction(productId: string) {
  try {
    await deleteDoc(doc(db, "products", productId));
    revalidatePath("/");
    return { success: true, message: "Product removed successfully." };
  } catch (error) {
    console.error("Error removing product: ", error);
    return { success: false, message: "Failed to remove product." };
  }
}
