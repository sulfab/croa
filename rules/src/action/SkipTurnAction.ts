import { GameState, GameStateView } from "../GameState";
import { SkipTurn } from "../moves";

class SkipTurnAction {
    /**
     * Skip the player turn and change the active player to the next one
     * @param state THe game state
     * @param move The actual movement
     */
    static apply(state: GameState | GameStateView, move: SkipTurn): void {
        const player = state.players.find(player => player.color === move.playerColor);
        if (!player) {
            return;
        }

        // On turn skipping, frog mud is removed, frog are not boucing anymore and deleting previous position
        player.femaleFrogs
            .forEach(f => {
                f.mudded = false;
                f.bouncing = false;
                f.stung = false;
                delete f.previousPosition
            });
      
        const playerNotEliminated = state.players.filter(player => !player.eliminated)
        const activePlayerIndex = playerNotEliminated.findIndex(player => player.color === state.activePlayer)
        const nextPlayerIndex = (activePlayerIndex + 1) % playerNotEliminated.length
        state.activePlayer = playerNotEliminated.length > 1? playerNotEliminated[nextPlayerIndex].color: undefined
    }
}

export {
    SkipTurnAction
};