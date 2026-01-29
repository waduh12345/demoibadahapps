import { apiSlice } from "@/services/base-query";

// --- TYPES ---
export interface AsmaulHusnaTranslation {
  id: number;
  asmaul_husna_id: number;
  locale: string;
  meaning: string; // HTML String
  description: string; // HTML String
  created_at: string;
  updated_at: string;
}

export interface AsmaulHusna {
  id: number;
  number: number;
  name_arabic: string;
  name_latin: string;
  created_at: string;
  updated_at: string;
  translations: AsmaulHusnaTranslation[];
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const asmaulHusnaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint: /public/asmaul-husna
    getAsmaulHusna: builder.query<AsmaulHusna[], void>({
      query: () => ({
        url: "/public/asmaul-husna",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<AsmaulHusna[]>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(
          response.message || "Gagal mengambil data Asmaul Husna.",
        );
      },
      providesTags: ["AsmaulHusna"],
    }),
  }),
});

export const { useGetAsmaulHusnaQuery } = asmaulHusnaApi;