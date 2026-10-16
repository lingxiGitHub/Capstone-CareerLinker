import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import toastReducer from "./components/toastSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    toasts: toastReducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
