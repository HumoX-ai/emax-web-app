import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./baseApi";

export interface Payment {
  _id: string;
  userId: string;
  orderId: string;
  orderNumber: number;
  sellerId: string;
  document: string;
  amount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  seller: {
    _id: string;
    fullName: string;
  };
  order: {
    _id: string;
    orderNumber: number;
    name: string;
  };
}

export interface PaymentsResponse {
  payments: Payment[];
  totalCount: number;
}

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_API_URL}/api`),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getPayments: builder.query<
      PaymentsResponse,
      { orderId?: string; limit?: number; offset?: number }
    >({
      query: (params) => {
        let url = "/user/payments";
        const searchParams = new URLSearchParams();
        if (params?.orderId) searchParams.append("orderId", params.orderId);
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        if (params?.offset)
          searchParams.append("offset", params.offset.toString());
        if ([...searchParams].length > 0) {
          url += `?${searchParams.toString()}`;
        }
        return url;
      },
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetPaymentsQuery } = paymentsApi;
