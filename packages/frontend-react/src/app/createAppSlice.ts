import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export default {
  // `buildCreateSlice` allows us to create a slice with async thunks.
  createAppSlice: buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
  }),
};
