import { PlayerColor } from "../player";
import { MoveType } from "./MoveType";

export type SkipTurn = {
    type: MoveType.SkipTurn,
    playerColor: PlayerColor
}

export function skipTurn(playerColor: PlayerColor): SkipTurn {
    return {
        type: MoveType.SkipTurn,
        playerColor
    }
}