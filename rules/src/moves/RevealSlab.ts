import { Position } from '../common/Position';
import { SlabFrontType } from '../pond';
import { Move } from './Move';
import { MoveType } from './MoveType';
import { GameState, GameStateView } from '../GameState';

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

export const revealSlabMove = (position: Position): RevealSlab => ({
    type: MoveType.RevealSlab,
    slabPosition: position
});

/**
 * Perform action when eliminating a frog
 *  - Remove the frog position
 * @param state THe game state
 * @param move The actual movement
 */
export const revealSlab = (state: GameState, move: RevealSlab): void => {
    state.pond[move.slabPosition.x][move.slabPosition.y] = {
        ...state.pond[move.slabPosition.x][move.slabPosition.y],
        displayed: true
    };
}

export const revealSlabInView = (state: GameStateView, move: RevealSlabView) => {
    state.pond[move.slabPosition.x][move.slabPosition.y] = {
        ...state.pond[move.slabPosition.x][move.slabPosition.y],
        displayed: true,
        front: move.front
    };
}