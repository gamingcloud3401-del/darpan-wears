"use server";

import { revalidatePath } from "next/cache";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/types";

export async function addProductAction(productData: Omit<Product, "id">) {
  try {
    await addDoc(collection(db, "products"), productData);
    revalidatePath("/");
    return { success: true, message: "Product added successfully." };
  } catch (error) {
    console.error("Error adding product: ", error);
    return { success: false, message: "Failed to add product." };
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
