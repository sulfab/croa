import { Position } from '../common/Position'
import { FemaleFrog } from '../frog'
import { MoveType } from '.'
import { PlayerColor } from '../player'
import Move from './Move'

export type MoveFrog = { 
    type: MoveType.MoveFrog 
    slabPosition: Position, 
    playerId: PlayerColor,
    frogId: number
}

function moveFrog(frog: FemaleFrog, position: Position): MoveFrog {
    return {
        type: MoveType.MoveFrog,
        slabPosition: position,
        playerId: frog.color,
        frogId: frog.id
    }
}

export function isMoveFrog(move: Move): move is MoveFrog {
    return MoveType.MoveFrog === move.type;
}

export {
    moveFrog
}