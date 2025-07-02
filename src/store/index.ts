import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import authReducer from "./slices/authSlice";
import { userApi } from "./api/userApi";
import { ordersApi } from "./api/ordersApi";
import { paymentsApi } from "./api/paymentsApi";
import { commentsApi } from "./api/commentsApi";
import { messagesApi } from "./api/messagesApi";
import { chatsApi } from "./api/chatsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [chatsApi.reducerPath]: chatsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      ordersApi.middleware,
      paymentsApi.middleware,
      commentsApi.middleware,
      messagesApi.middleware,
      chatsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
