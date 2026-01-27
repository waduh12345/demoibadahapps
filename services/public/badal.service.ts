import { apiSlice } from "@/services/base-query";

// --- Types ---
export interface BadalTag {
  id: number;
  name: string;
  icon: string; // e.g., "fas fa-edit" or just name mapping
  description: string;
}

export interface CheckTag {
  id: number;
  badal_id: number;
  badal_tag_id: number;
  badal_tag: BadalTag;
}

export interface BadalOrganizer {
  id: number;
  name: string;
  description: string;
}

export interface BadalItem {
  id: number;
  badal_organizer_id: number;
  title: string;
  description: string; // HTML String
  type: "umrah" | "haji";
  price: number;
  created_at: string;
  updated_at: string;
  organizer: BadalOrganizer;
  check_tags: CheckTag[];
}

export interface BadalResponse {
  code: number;
  message: string;
  data: BadalItem[];
}

// --- API Slice ---
export const publicBadalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 Get Public Badals by Type
    getBadals: builder.query<BadalResponse, { type: "umrah" | "haji" }>({
      query: ({ type }) => ({
        url: "/public/badals",
        method: "GET",
        params: { type },
      }),
      transformResponse: (response: BadalResponse) => {
        if (response.code === 200) {
          return response;
        }
        throw new Error(response.message || "Gagal mengambil data Badal.");
      },
      providesTags: (result, error, arg) => [
        { type: "PublicBadals", id: arg.type },
      ],
    }),
  }),
});

export const { useGetBadalsQuery } = publicBadalsApi;