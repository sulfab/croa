import { GameState, GameStateView } from "../GameState";
import { isRevealSlabView, RevealSlab, RevealSlabView } from "../moves/RevealSlab";

class RevealSlabAction {
    /**
     * Perform action when eliminating a frog
     *  - Remove the frog position
     * @param state THe game state
     * @param move The actual movement
     */
    static apply(state: GameState | GameStateView, move: RevealSlab | RevealSlabView): void {
        state.pond[move.slabPosition.x][move.slabPosition.y] = {
            ...state.pond[move.slabPosition.x][move.slabPosition.y],
            displayed: true
        };
  
        if (isRevealSlabView(move)) {
            state.pond[move.slabPosition.x][move.slabPosition.y] = {
                ...state.pond[move.slabPosition.x][move.slabPosition.y],
                front: move.front
            };
        }
    }
}

export {
    RevealSlabAction
};