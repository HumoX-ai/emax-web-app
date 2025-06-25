import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./baseApi";

export interface Comment {
  _id: string;
  stars: number;
  text: string;
  hasSelected: boolean;
  orderNumber: number;
  sellerId: string;
  orderId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    fullName: string;
  };
}

export interface CommentsResponse {
  comments: Comment[];
  totalCount: number;
}

export interface CreateCommentRequest {
  orderId: string;
  stars: number;
  text: string;
}

export interface CreateCommentResponse {
  message: string;
  comment: Comment;
}

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_API_URL}/api`),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getComments: builder.query<
      CommentsResponse,
      { orderId?: string; sellerId?: string; limit?: number; offset?: number }
    >({
      query: (params) => {
        let url = "/user/comments";
        const searchParams = new URLSearchParams();
        if (params?.orderId) searchParams.append("orderId", params.orderId);
        if (params?.sellerId) searchParams.append("sellerId", params.sellerId);
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        if (params?.offset)
          searchParams.append("offset", params.offset.toString());
        if ([...searchParams].length > 0) {
          url += `?${searchParams.toString()}`;
        }
        return url;
      },
      providesTags: ["Comment"],
    }),
    createComment: builder.mutation<
      CreateCommentResponse,
      CreateCommentRequest
    >({
      query: (body) => ({
        url: "/user/comments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const { useGetCommentsQuery, useCreateCommentMutation } = commentsApi;
