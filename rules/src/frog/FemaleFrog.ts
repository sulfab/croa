import { Position } from "../common/Position";
import { PlayerColor } from "../player";
import { FrogStatus } from "./FrogStatus";

export type FemaleFrog = {
    // color act as the player id
    color: PlayerColor,
    id: number,
    isQueen: boolean,
    position?: Position,
    previousPosition?: Position
    status: FrogStatus

}

export type FemaleFrogId = {
    color: PlayerColor;
    id: number;
}