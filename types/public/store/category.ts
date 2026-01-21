export interface ProductCategoryTranslation {
  id: number;
  store_product_category_id: number;
  locale: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
  translations: ProductCategoryTranslation[];
}

export interface GetProductCategoriesParams {
  page?: number;
  paginate?: number;
}
