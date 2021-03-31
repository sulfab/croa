import { MoveType } from './MoveType';
import { GameState, GameStateView } from '../GameState';
import { FrogStatus } from '../frog';

export type SkipTurn = {
    type: MoveType.SkipTurn
}

export const skipTurnMove: SkipTurn = {
    type: MoveType.SkipTurn
}

/**
 * Skip the player turn and change the active player to the next one
 * @param state THe game state
 */
export const skipTurn = (state: GameState | GameStateView): void => {
    const player = state.players.find(player => player.color === state.activePlayer);
    if (!player) {
        return;
    }

    // On turn skipping, frog mud is removed, frog are not bouncing anymore and deleting previous position
    const lastPlayedFrog = player.femaleFrogs.find(frog => frog.id === player.lastPlayedFrogId);
    player.femaleFrogs
        .filter(f => !lastPlayedFrog || lastPlayedFrog.color !== f.color || lastPlayedFrog.id !== f.id || FrogStatus.Bogged !== f.status)
        .forEach(f => {
            f.status = FrogStatus.Ready;
            delete f.previousPosition;
        });

    player.done = false;
    delete player.lastPlayedFrogId;

    if (state.players.filter(player => !player.eliminated).length <= 1) {
        delete state.activePlayer;
        return;
    }

    for (let i = 1; i <= state.players.length; i++) {
        const activePlayerIndex = state.players.findIndex(player => player.color === state.activePlayer)
        const nextPlayerIndex = (activePlayerIndex + i) % state.players.length

        const nextPlayer = state.players[nextPlayerIndex];
        if (!nextPlayer.eliminated) {
            state.activePlayer = nextPlayer.color;
            return;
        }
    }
}