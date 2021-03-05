import { Position } from "../common/Position";
import { PlayerColor } from "../player";

export type FemaleFrog = {
    // color act as the player id
    color: PlayerColor,
    id: number,
    isQueen: boolean,
    position?: Position,
    previousPosition?: Position
    eliminated?: boolean;
    hasMoved?: boolean;
    mudded?: boolean;
    bouncing?: boolean;
    stung?: boolean;
}

export type FemaleFrogId = {
    color: PlayerColor;
    id: number;
}