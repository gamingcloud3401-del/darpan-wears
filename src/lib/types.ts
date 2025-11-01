export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  imageUrl: string;
  category: string;
  sizes: string[];
};

export type SocialLinks = {
  id: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
};
