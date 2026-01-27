import { apiSlice } from "@/services/base-query";

// --- Types ---
export interface JourneyActivity {
  id: number;
  journey_id: number;
  activity: string;
  created_at: string;
  updated_at: string;
}

export interface JourneyItem {
  id: number;
  type: "haji" | "umrah";
  hijri_date: string;
  title: string;
  sub_title: string;
  description: string; // HTML string
  order: number;
  location: string; // HTML string or plain text
  created_at: string;
  updated_at: string;
  activities: JourneyActivity[];
}

export interface JourneyResponse {
  code: number;
  message: string;
  data: JourneyItem[];
}

// --- API Slice ---
export const publicJourneysApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 Get Public Journeys by Type
    getJourneys: builder.query<JourneyResponse, { type: "umrah" | "haji" }>({
      query: ({ type }) => ({
        url: "/public/journeys",
        method: "GET",
        params: { type },
      }),
      transformResponse: (response: JourneyResponse) => {
        if (response.code === 200) {
          return response;
        }
        throw new Error(response.message || "Gagal mengambil data perjalanan.");
      },
      providesTags: (result, error, arg) => [
        { type: "PublicJourneys", id: arg.type },
      ],
    }),
  }),
});

export const { useGetJourneysQuery } = publicJourneysApi;