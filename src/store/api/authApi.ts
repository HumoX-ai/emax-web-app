import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./baseApi";

export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  message: string;
  code: string;
  isNewUser: boolean;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface User {
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
}

export interface VerifyOtpResponse {
  message: string;
  isNewUser: boolean;
  user: User;
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_API_URL}/api/auth/`),
  endpoints: (builder) => ({
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (body) => ({
        url: "user-otp-auth",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "user-otp-auth",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation } = authApi;
