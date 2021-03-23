import { Position } from '../common/Position'
import { MoveType } from '.'
import { PlayerColor } from '../player'
import Move from './Move'

export type MoveFrog = { 
    type: MoveType.MoveFrog 
    slabPosition: Position, 
    playerId: PlayerColor,
    frogId: number
}

function moveFrog(frogId: number, playerId: PlayerColor, position: Position): MoveFrog {
    return {
        type: MoveType.MoveFrog,
        slabPosition: position,
        playerId,
        frogId
    }
}

export function isMoveFrog(move: Move): move is MoveFrog {
    return MoveType.MoveFrog === move.type;
}

export {
    moveFrog
}