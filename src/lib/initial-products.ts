import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "./types";

export const initialProductData: Omit<Product, 'id'>[] = [
  {
    name: "AeroRun Pro Sneakers",
    description: "Lightweight and responsive, these sneakers are designed for maximum speed and comfort during your runs. Featuring a breathable mesh upper and cushioned sole.",
    price: 12000.00,
    offerPrice: 9999.00,
    imageUrl: "https://picsum.photos/seed/a1/600/400",
    category: "Footwear",
    sizes: ["8", "9", "10", "11", "12"],
  },
  {
    name: "SoundWave+ Headphones",
    description: "Immerse yourself in high-fidelity audio with these wireless over-ear headphones. Noise-cancellation and a 30-hour battery life make them perfect for any environment.",
    price: 15999.00,
    imageUrl: "https://picsum.photos/seed/b2/600/400",
    category: "Electronics",
    sizes: ["One Size"],
  },
  {
    name: "Nomad Travel Backpack",
    description: "A durable and spacious backpack for all your adventures. Water-resistant material, multiple compartments, and a padded laptop sleeve for the modern traveler.",
    price: 6500.00,
    offerPrice: 5500.00,
    imageUrl: "https://picsum.photos/seed/c3/600/400",
    category: "Accessories",
    sizes: ["30L", "45L"],
  },
  {
    name: "ChronoFit Smart Watch",
    description: "Track your fitness, receive notifications, and stay connected. With a vibrant AMOLED display and advanced health sensors, it's your ultimate lifestyle companion.",
    price: 20000.00,
    imageUrl: "https://picsum.photos/seed/d4/600/400",
    category: "Electronics",
    sizes: ["40mm", "44mm"],
  },
  {
    name: "ErgoFlow Office Chair",
    description: "Experience unparalleled comfort with our ergonomic office chair. Fully adjustable with lumbar support to promote good posture during long work hours.",
    price: 28000.00,
    imageUrl: "https://picsum.photos/seed/e5/600/400",
    category: "Furniture",
    sizes: ["One Size"],
  },
  {
    name: "BeatBox Portable Speaker",
    description: "Take the party anywhere with this powerful and portable Bluetooth speaker. Delivers rich sound and deep bass with a rugged, waterproof design.",
    price: 6000.00,
    offerPrice: 4999.00,
    imageUrl: "https://picsum.photos/seed/f6/600/400",
    category: "Electronics",
    sizes: ["Small", "Large"],
  },
];

export async function seedProducts() {
  const productsCollectionRef = collection(db, "products");
  try {
    const querySnapshot = await getDocs(productsCollectionRef);
    if (querySnapshot.empty) {
      console.log("Products collection is empty. Seeding initial data...");
      const batch = writeBatch(db);
      initialProductData.forEach((product) => {
        const docRef = doc(productsCollectionRef);
        batch.set(docRef, product);
      });
      await batch.commit();
      console.log("Seeding complete.");
    } else {
      console.log("Products collection already contains data. Skipping seed.");
    }
    return true;
  } catch (error) {
    console.error("Error seeding products:", error);
    return false;
  }
}
