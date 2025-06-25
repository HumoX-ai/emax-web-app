import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../api/authApi";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isNewUser: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        isNewUser: boolean;
      }>
    ) => {
      const { user, token, isNewUser } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isNewUser = isNewUser;
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isNewUser = false;
      localStorage.removeItem("token");
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isNewUser = false;
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
