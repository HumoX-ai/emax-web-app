import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./baseApi";

export interface CreateChatRequest {
  orderId: string;
}

export interface CreateChatResponse {
  message: string;
  chatId: string;
}

export const chatsApi = createApi({
  reducerPath: "chatsApi",
  baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_API_URL}/api`),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    createChat: builder.mutation<CreateChatResponse, CreateChatRequest>({
      query: (body) => ({
        url: "/user/chats",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate orders cache to refresh hasChat status
          dispatch({
            type: "ordersApi/util/invalidateTags",
            payload: ["Order"],
          });
        } catch {
          // ignore
        }
      },
    }),
  }),
});

export const { useCreateChatMutation } = chatsApi;
