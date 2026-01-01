// services/dictionary.service.ts
import { apiSlice } from "@/services/base-query"; // Sesuaikan path import base-query
import { DictionaryEntry, DictionaryResponse } from "@/types/public/dictionary";

export const dictionaryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📖 Get Dictionary Entries (Kamus Istilah)
    // Endpoint: /public/dictionary/entries
    getDictionaryEntries: builder.query<DictionaryEntry[], void>({
      query: () => ({
        url: "/public/dictionary/entries",
        method: "GET",
      }),
      // Transform response: Ambil array 'data' langsung
      transformResponse: (response: DictionaryResponse) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil data kamus.");
      },
      // Tag untuk caching/invalidasi (opsional)
      providesTags: ["DictionaryEntries"],
    }),
  }),
});

export const { useGetDictionaryEntriesQuery } = dictionaryApi;