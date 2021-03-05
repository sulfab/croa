import { Position } from "../common/Position";
import { SlabFrontType } from "../pond";
import { Move } from "./Move";
import { MoveType } from "./MoveType";

export type RevealSlab = {
    type: MoveType.RevealSlab,
    slabPosition: Position
}

export type RevealSlabView = RevealSlab & {
    front: SlabFrontType;
}

export function isRevealSlabView(move: Move): move is RevealSlabView {
  return (move as RevealSlabView).front !== undefined;
}

export function revealSlab(position: Position): RevealSlab {
    return {
        type: MoveType.RevealSlab,
        slabPosition: position
    };
}