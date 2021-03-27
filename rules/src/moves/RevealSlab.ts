import { Position } from '../common/Position';
import { SlabFrontType } from '../pond';
import { Move } from './Move';
import { MoveType } from './MoveType';

export type RevealSlab = {
    type: MoveType.RevealSlab,
    slabPosition: Position
}

export type RevealSlabView = RevealSlab & {
    front: SlabFrontType;
}

export function isRevealSlab(move: Move): move is RevealSlab {
    return MoveType.RevealSlab === move.type;
}

export function revealSlabMove(position: Position): RevealSlab {
    return {
        type: MoveType.RevealSlab,
        slabPosition: position
    };
}