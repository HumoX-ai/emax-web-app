import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./baseApi";

export interface Order {
  _id: string;
  userId: string;
  orderNumber: number;
  hasComment: boolean;
  sellerId: string;
  name: string;
  description: string;
  weight: number;
  price: number;
  paidAmount: number;
  contractFile: string;
  status: "PENDING" | "IN_PROCESS" | "IN_BORDER" | "DONE";
  paymentStatus: "UNPAID" | "PARTIAL" | "PAID";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  seller: {
    _id: string;
    fullName: string;
    phone: string;
    password: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    about?: string;
  };
}

export interface OrdersResponse {
  orders: Order[];
  totalCount: number;
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_API_URL}/api`),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query<
      OrdersResponse,
      { status?: string; limit?: number; offset?: number }
    >({
      query: (params) => {
        let url = "/user/orders";
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append("status", params.status);
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        if (params?.offset)
          searchParams.append("offset", params.offset.toString());
        if ([...searchParams].length > 0) {
          url += `?${searchParams.toString()}`;
        }
        return url;
      },
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<Order, string>({
      query: (id) => `/user/orders/${id}`,
      providesTags: (_, __, id) => [{ type: "Order", id }],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery } = ordersApi;
