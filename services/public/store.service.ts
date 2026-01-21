import { apiSlice } from "@/services/base-query";
import { PaginatedResponse } from "@/types/pagination";
import { Store, GetStoresParams } from "@/types/public/store/store";
import { Product, GetProductsParams } from "@/types/public/store/product";
import {
  ProductCategory,
  GetProductCategoriesParams,
} from "@/types/public/store/category";
import {
  CheckoutTransactionRequest,
  CheckoutTransactionResponse,
  Transaction,
} from "@/types/public/store/transaction";

export const publicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🏪 Get Public Stores
    getPublicStores: builder.query<
      PaginatedResponse<Store>["data"],
      GetStoresParams
    >({
      query: (params) => ({
        url: "/public/stores",
        method: "GET",
        params: {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        },
      }),
      // Transform response: Ambil langsung object "data" yang berisi array items & info pagination
      transformResponse: (response: PaginatedResponse<Store>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil data toko.");
      },
      providesTags: ["PublicStores"],
    }),

    // 📦 Get Public Products
    getPublicProducts: builder.query<
      PaginatedResponse<Product>["data"],
      GetProductsParams
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        };

        if (params.store_id) {
          queryParams.store_id = params.store_id;
        }

        return {
          url: "/public/products",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: PaginatedResponse<Product>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil data produk.");
      },
      providesTags: ["PublicProducts"],
    }),

    // 📂 Get Public Product Categories
    getPublicProductCategories: builder.query<
      PaginatedResponse<ProductCategory>["data"],
      GetProductCategoriesParams
    >({
      query: (params) => ({
        url: "/public/product-categories",
        method: "GET",
        params: {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        },
      }),
      transformResponse: (response: PaginatedResponse<ProductCategory>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal mengambil kategori produk."
        );
      },
      providesTags: ["PublicProductCategories"],
    }),

    // 💳 Checkout Transaction
    checkoutTransaction: builder.mutation<
      Transaction,
      CheckoutTransactionRequest
    >({
      query: (body) => ({
        url: "/transaction/checkout",
        method: "POST",
        body,
      }),
      transformResponse: (response: CheckoutTransactionResponse) => {
        if (response.code === 201) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal melakukan checkout transaksi."
        );
      },
      invalidatesTags: ["PublicProducts"],
    }),
  }),
});

export const {
  useGetPublicStoresQuery,
  useGetPublicProductsQuery,
  useGetPublicProductCategoriesQuery,
  useCheckoutTransactionMutation,
} = publicApi;