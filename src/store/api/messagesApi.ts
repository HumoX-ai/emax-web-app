import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./baseApi";

export interface Message {
  _id: string;
  userId: string;
  orderId: string;
  orderNumber: number;
  sellerId: string;
  text: string;
  senderType: "USER" | "SELLER";
  image?: string;
  createdAt: string;
  updatedAt: string;
  seller: {
    _id: string;
    fullName: string;
  };
}

export interface MessagesResponse {
  messages: Message[];
  totalCount: number;
}

export interface CreateMessageRequest {
  orderId: string;
  text: string;
  image?: string;
}

export interface CreateMessageResponse {
  message: string;
  data: Message;
}

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_API_URL}/api`),
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getMessages: builder.query<
      MessagesResponse,
      { orderId: string; limit?: number; offset?: number }
    >({
      query: (params) => {
        let url = "/user/messages";
        const searchParams = new URLSearchParams();
        searchParams.append("orderId", params.orderId);
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        if (params?.offset)
          searchParams.append("offset", params.offset.toString());
        url += `?${searchParams.toString()}`;
        return url;
      },
      providesTags: ["Message"],
    }),
    createMessage: builder.mutation<
      CreateMessageResponse,
      CreateMessageRequest
    >({
      query: (body) => ({
        url: "/user/messages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const { useGetMessagesQuery, useCreateMessageMutation } = messagesApi;
