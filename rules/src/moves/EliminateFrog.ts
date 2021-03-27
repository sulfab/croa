import { FemaleFrogId, FrogStatus } from '../frog';
import { PlayerColor } from '../player';
import { MoveType } from './';
import Move from './Move';
import { GameState, GameStateView } from '../GameState';


export type EliminateFrog = {
    type: MoveType.EliminateFrog,
    frogId: number,
    playerId: PlayerColor
}

/**
 * Move to get back frogs
 * @param frog 
 */
export function eliminateFrogMove(frog: FemaleFrogId): EliminateFrog {
    return {
        type: MoveType.EliminateFrog,
        playerId: frog.color,
        frogId: frog.id
    };
}

export function isEliminateFrog(move: Move): move is EliminateFrog {
    return move.type === MoveType.EliminateFrog
}

/**
 * Perform action when eliminating a frog
 *  - Remove the frog position
 * @param state THe game state
 * @param move The actual movement
 */
const eliminateFrog = (state: GameState | GameStateView, move: EliminateFrog) => {
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
            player.eliminated = eliminatedCount.length === 0 ? 1 : Math.max(...eliminatedCount) + 1;
        }

        // The eliminator win a servant birth if there is one available
        const eliminator = state.players.find(p => p.femaleFrogs.some(frog => FrogStatus.MOVED === frog.status));
        if (eliminator && eliminatedFrog.isQueen) {
            eliminator.birth = true;
        }
    }

    player.eliminationChoice = [];
}
export { eliminateFrog };