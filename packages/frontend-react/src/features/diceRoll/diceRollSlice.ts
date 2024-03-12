import { createSlice } from "@reduxjs/toolkit";

export interface DiceRollState {
  /** The current dice roll. */
  value: number;
}

const initialState: DiceRollState = {
  value: 0,
};

export const diceRollSlice = createSlice({
  name: "diceRoll",
  initialState,
  reducers: (create) => ({
    roll: create.reducer((state) => {
      state.value = Math.floor(Math.random() * 21);
    }),
  }),
  selectors: {
    selectValue: (state) => state.value,
  },
});

export const { roll } = diceRollSlice.actions;
export const { selectValue } = diceRollSlice.selectors;
