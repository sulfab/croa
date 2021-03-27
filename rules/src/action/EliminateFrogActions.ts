import { FrogStatus } from '../frog';
import { GameState, GameStateView } from '../GameState';
import { EliminateFrog } from '../moves';

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
        eliminatedFrog.status = FrogStatus.READY;

        // TODO: Generate a move for player elimination
        if (!player.eliminated && player.femaleFrogs.every(frog => !frog.position)) {
            const eliminatedCount: number[] = state.players.filter(p => !!p.eliminated).flatMap(player => player.eliminated!);
            player.eliminated = eliminatedCount.length === 0? 1: Math.max(...eliminatedCount) + 1;
        }

        // The eliminator win a servant birth if there is one available
        const eliminator = state.players.find(p => p.femaleFrogs.some(frog => FrogStatus.MOVED === frog.status));
        if (eliminator && eliminatedFrog.isQueen) {
            eliminator.birth = true;
        }
    }

    player.eliminationChoice = [];
}

export {
    eliminateFrogAction
};