import { Product } from "@/types/public/store/product";
import { Store } from "@/types/public/store/store";

// Dummy Store
const dummyStore: Store = {
  id: 999,
  name: "Awqaf Store",
  slug: "awqaf-store",
  description: "Toko resmi Awqaf Indonesia",
  status: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  image: "/placeholder-image.jpg",
};

// Dummy Products
export const dummyProducts: Product[] = [
];
