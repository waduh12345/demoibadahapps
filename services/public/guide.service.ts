import { apiSlice } from "@/services/base-query";

// --- Types ---
export interface GuideTranslation {
  id: number;
  guide_id: number;
  locale: string;
  title: string;
  summary: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface GuideItem {
  id: number;
  title: string;
  summary: string; // HTML String (Short Desc)
  description: string; // HTML String (Full Content)
  type: "umrah" | "hajj";
  order: number;
  created_at: string;
  updated_at: string;
  translations: GuideTranslation[];
}

export interface GuideResponse {
  code: number;
  message: string;
  data: GuideItem[];
}

// --- API Slice ---
export const publicGuidesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 Get Public Guides by Type (umrah / hajj)
    getGuides: builder.query<GuideResponse, { type: "umrah" | "hajj" }>({
      query: ({ type }) => ({
        url: "/public/guides",
        method: "GET",
        params: { type },
      }),
      transformResponse: (response: GuideResponse) => {
        if (response.code === 200) {
          return response;
        }
        throw new Error(response.message || "Gagal mengambil data panduan.");
      },
      providesTags: (result, error, arg) => [
        { type: "PublicGuides", id: arg.type },
      ],
    }),
  }),
});

export const { useGetGuidesQuery } = publicGuidesApi;