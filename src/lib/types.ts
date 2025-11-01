import { FieldValue } from "firebase/firestore";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  imageUrls: string[];
  videoUrl?: string;
  productLink?: string;
  category: string;
  sizes: string[];
  createdAt: FieldValue | Date;
};

export type Settings = {
  id: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
  promoVideoUrl?: string;
  logoUrl?: string;
};
