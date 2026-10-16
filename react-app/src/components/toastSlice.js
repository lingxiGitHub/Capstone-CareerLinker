import { createSlice, nanoid } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "toasts",
  initialState: [],
  reducers: {
    pushToast: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (message, kind = "success") => ({ payload: { id: nanoid(), message, kind } }),
    },
    dismissToast: (state, action) => state.filter((t) => t.id !== action.payload),
  },
});

export const { pushToast, dismissToast } = slice.actions;
export default slice.reducer;
