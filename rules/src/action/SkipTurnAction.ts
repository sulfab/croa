import { FrogStatus } from "../frog";
import { GameState, GameStateView } from "../GameState";

/**
 * Skip the player turn and change the active player to the next one
 * @param state THe game state
 * @param move The actual movement
 */
const skipTurnAction = (state: GameState | GameStateView): void => {
    const player = state.players.find(player => player.color === state.activePlayer);
    if (!player) {
        return;
    }

    // On turn skipping, frog mud is removed, frog are not boucing anymore and deleting previous position
    const lastPlayedFrog = player.femaleFrogs.find(frog => frog.id === player.lastPlayedFrogId);
    player.femaleFrogs
        .filter(f => !lastPlayedFrog || lastPlayedFrog.color !== f.color || lastPlayedFrog.id !== f.id || ![FrogStatus.MUDDED, FrogStatus.STUNG, FrogStatus.BOUNCING].includes(f.status))
        .forEach(f => {
            f.status = FrogStatus.READY;
            f.previousPosition = undefined;
        });

    player.done = false;
    player.lastPlayedFrogId = undefined;
    
    const playerNotEliminated = state.players.filter(player => !player.eliminated)
    const activePlayerIndex = playerNotEliminated.findIndex(player => player.color === state.activePlayer)
    const nextPlayerIndex = (activePlayerIndex + 1) % playerNotEliminated.length
    state.activePlayer = playerNotEliminated.length > 1? playerNotEliminated[nextPlayerIndex].color: undefined
}

export {
    skipTurnAction
};