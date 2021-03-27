import { FemaleFrogId } from '../frog';
import { PlayerColor } from '../player';
import { MoveType } from './';
import Move from './Move';


export type EliminateFrog = {
    type: MoveType.EliminateFrog,
    frogId: number,
    playerId: PlayerColor
}

/**
 * Move to get back frogs
 * @param frog 
 */
export function eliminateFrog(frog: FemaleFrogId): EliminateFrog {
    return {
        type: MoveType.EliminateFrog,
        playerId: frog.color,
        frogId: frog.id
    };
}

export function isEliminateFrog(move: Move): move is EliminateFrog {
    return move.type === MoveType.EliminateFrog
}