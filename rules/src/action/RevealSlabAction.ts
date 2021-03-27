import { GameState, GameStateView } from '../GameState'
import { RevealSlab, RevealSlabView } from '../moves'

/**
 * Perform action when eliminating a frog
 *  - Remove the frog position
 * @param state THe game state
 * @param move The actual movement
 */
const revealSlab = (state: GameState, move: RevealSlab): void => {
    state.pond[move.slabPosition.x][move.slabPosition.y] = {
        ...state.pond[move.slabPosition.x][move.slabPosition.y],
        displayed: true
    };
}

const revealSlabInView = (state: GameStateView, move: RevealSlabView) => {
    state.pond[move.slabPosition.x][move.slabPosition.y] = {
        ...state.pond[move.slabPosition.x][move.slabPosition.y],
        displayed: true,
        front: move.front
    };
}

export {
    revealSlab,
    revealSlabInView
};