"use server";

import { revalidatePath } from "next/cache";
import { addDoc, collection, deleteDoc, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, SocialLinks } from "@/lib/types";

export async function addProductAction(productData: Omit<Product, "id">) {
  try {
    const productToAdd = {
      ...productData,
      imageUrls: productData.imageUrls.filter(url => url.trim() !== ""),
    };
    await addDoc(collection(db, "products"), productToAdd);
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

export async function updateSocialLinksAction(links: Omit<SocialLinks, "id">) {
  try {
    const settingsCollection = collection(db, "settings");
    const querySnapshot = await getDocs(settingsCollection);
    let docId: string;

    if (querySnapshot.empty) {
      const newDocRef = doc(settingsCollection);
      docId = newDocRef.id;
    } else {
      docId = querySnapshot.docs[0].id;
    }

    await setDoc(doc(db, "settings", docId), links, { merge: true });
    revalidatePath("/");
    return { success: true, message: "Social links updated successfully." };
  } catch (error) {
    console.error("Error updating social links:", error);
    return { success: false, message: "Failed to update social links." };
  }
}
