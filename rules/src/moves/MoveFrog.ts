import { Position } from '../common/Position'
import { MoveType } from '.'
import { PlayerColor } from '../player'
import Move from './Move'
import { GameState, GameStateView } from '../GameState';
import { isKnownSlab, SlabFrontType } from '../pond';
import { FrogStatus } from '../frog';

export type MoveFrog = { 
    type: MoveType.MoveFrog 
    slabPosition: Position, 
    playerId: PlayerColor,
    frogId: number
}

export const moveFrogMove = (frogId: number, playerId: PlayerColor, position: Position): MoveFrog => ({
    type: MoveType.MoveFrog,
    slabPosition: position,
    playerId,
    frogId
})

export const isMoveFrog = (move: Move): move is MoveFrog => {
    return MoveType.MoveFrog === move.type;
}

/**
 * Perform action when moving the frog in order:
 *  - Mark frog on the targeted pond as eliminated
 *  - Change the frog position
 *
 * The effect on slab is handled by an automatic action
 * @param state THe game state
 * @param move The actual movement
 */
export const moveFrog = (state: GameState | GameStateView, move: MoveFrog): void => {
    const player = state.players.find(player => player.color === move.playerId)
    if (!player) {
        return;
    }

    const frog = player.femaleFrogs.find(frog => frog.color === player.color && frog.id === move.frogId);
    if (!frog) {
        return;
    }

    const slab = state.pond[move.slabPosition.x][move.slabPosition.y];

    if (isKnownSlab(slab) && SlabFrontType.LOG === slab.front) {
        const frogsOnSlab = state.players
            .flatMap(frog => frog.femaleFrogs)
            .filter(frog => !!frog.position && frog.position.x === move.slabPosition.x && frog.position.y === move.slabPosition.y);

        // Frog is not a queen
        if (!frog.isQueen) {

            // On slab there is a queen of other color : chase her
            if (frogsOnSlab.length === 1 && frogsOnSlab[0].color !== frog.color && frogsOnSlab[0].isQueen) {
                frogsOnSlab[0].status = FrogStatus.ELIMINATED;
            } else if (frogsOnSlab.length > 1) {
                // In case its a servant, we let the choice if the max size is overpassed
                player.eliminationChoice = [...frogsOnSlab];
            }
        } else if (!frogsOnSlab.some(frog => frog.color === player.color)) {
            // Direct elimination of frogs when the queen arrives
            frogsOnSlab.forEach(frog => frog.status = FrogStatus.ELIMINATED)
        }
    } else {
        // Mark frogs on new slab as eliminated
        state.players
            .filter(player => player.color !== move.playerId)
            .flatMap(player => player.femaleFrogs)
            .filter(frog => frog.position && frog.position.x === move.slabPosition.x && frog.position.y === move.slabPosition.y)
            .forEach(frog => frog.status = FrogStatus.ELIMINATED);
    }

    frog.previousPosition = frog.position;
    frog.position = move.slabPosition;
    frog.status = FrogStatus.MOVED;

    player.lastPlayedFrogId = frog.id;
    player!.femaleFrogs
        .filter(f => FrogStatus.STUNG === f.status)
        .forEach(f => f.status = FrogStatus.READY);

}