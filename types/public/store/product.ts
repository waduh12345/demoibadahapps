import { Store } from "./store";

export interface ProductTranslation {
  id: number;
  store_product_id: number;
  locale: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  store_product_category_id: number;
  store_id: number;
  name: string;
  slug: string;
  price: number;
  markup_price: number;
  stock: number;
  description: string | null;
  external_link: string;
  status: number;
  created_at: string;
  updated_at: string;
  image: string;
  store: Store; // Nested store object inside product
  translations: ProductTranslation[];
}

export interface GetProductsParams {
  page?: number;
  paginate?: number;
  store_id?: number;
}