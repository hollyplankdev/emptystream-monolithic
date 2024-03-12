import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { roll, selectValue } from "./diceRollSlice";

export const DiceRoll = () => {
    const dispatch = useAppDispatch();
    const rollValue = useAppSelector(selectValue);
    
   return (
    <div>
        <button
            onClick={() => dispatch(roll())}
        >Roll The Dice</button>
        <span
            aria-label="Result"
        >Result: {rollValue}</span>
    </div>
   )
};