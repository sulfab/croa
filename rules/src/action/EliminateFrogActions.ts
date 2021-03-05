import { GameState, GameStateView } from "../GameState";
import { EliminateFrog } from "../moves";

class EliminateFrogAction {
    /**
     * Perform action when eliminating a frog
     *  - Remove the frog position
     * @param state THe game state
     * @param move The actual movement
     */
    static apply(state: GameState | GameStateView, move: EliminateFrog): void {
        const player = state.players.find(player => player.color === move.playerId)
        if (!player) {
            return;
        }

        const eliminatedFrog = player.femaleFrogs.find(frog => frog.id === move.frogId)
        if (eliminatedFrog) {
            delete eliminatedFrog.position;
            eliminatedFrog.eliminated = false;

            // TODO: Generate a move for player elimintion
            if (!player.eliminated && player.femaleFrogs.every(frog => !frog.position)) {
                player.eliminated = true;
            }
        }

        player.eliminationChoice = [];
    }
}

export {
    EliminateFrogAction
};