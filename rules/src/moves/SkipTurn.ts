import { MoveType } from "./MoveType";

export type SkipTurn = {
    type: MoveType.SkipTurn
}

export function skipTurn(): SkipTurn {
    return {
        type: MoveType.SkipTurn
    }
}