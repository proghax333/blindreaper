
import { configureStore } from "@reduxjs/toolkit";
import payloadsSlice from "~/modules/payloads/payloads.slice";

export const store = configureStore({
  reducer: {
    payloads: payloadsSlice
  }
});
