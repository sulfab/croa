import { GameState, GameStateView } from "../GameState";
import { EliminateFrog } from "../moves";

    /**
     * Perform action when eliminating a frog
     *  - Remove the frog position
     * @param state THe game state
     * @param move The actual movement
     */
const eliminateFrogAction = (state: GameState | GameStateView, move: EliminateFrog) => {
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

        // The eliminator win a servant birth if ther is one available
        const eliminator = state.players.find(p => p.femaleFrogs.some(frog => frog.hasMoved));
        if (eliminator && eliminatedFrog.isQueen) {
            eliminator.birth = true;
        }
    }

    player.eliminationChoice = [];
}

export {
    eliminateFrogAction
};