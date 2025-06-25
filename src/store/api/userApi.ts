import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./baseApi";

export interface UpdateUserRequest {
  fullName: string;
  birthday: string;
  gender: string;
}

export interface UpdateUserResponse {
  message: string;
  user: {
    _id: string;
    fullName: string;
    phone: string;
    gender: string;
    birthday: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    sellerId: string;
  };
}

export interface GetUserInfoResponse {
  message: string;
  success: boolean;
  status: number;
  data: {
    _id: string;
    fullName: string;
    phone: string;
    gender: string;
    birthday: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    sellerId: string;
    Type: string;
  };
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_API_URL}/api/users/`),
  endpoints: (builder) => ({
    getUserInfo: builder.query<GetUserInfoResponse, void>({
      query: () => ({
        url: "../auth/get-user-information",
        method: "GET",
      }),
    }),
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: (body) => ({
        url: "update",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useGetUserInfoQuery, useUpdateUserMutation } = userApi;
