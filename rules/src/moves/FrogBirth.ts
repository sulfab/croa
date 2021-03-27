import { MaleFrog } from '../frog';
import { PlayerColor } from '../player';
import Move from './Move';
import { MoveType } from './MoveType';

export type FrogBirth = {
    type: MoveType.FrogBirth,
    male?: MaleFrog,
    playerId: PlayerColor
}

/**
 * Is frog birth move
 */
export function isFrogBirth(move: Move): move is FrogBirth {
    return move.type === MoveType.FrogBirth;
}

/**
 * Move to generate a new frog
 */
export function frogBirth(playerId: PlayerColor, male?: MaleFrog): FrogBirth {
    return {
        type: MoveType.FrogBirth,
        playerId,
        male
    }
}