import { Position } from '../common/Position';
import { MoveType } from './MoveType';
import { Player } from '../player';
import { FemaleFrog, FrogStatus, MaleFrog } from '../frog';
import { GameState, GameStateView } from '../GameState';
import { isKnownSlab, SlabFrontType } from '../pond';

export type PlaySlabEffect = {
    type: MoveType.PlaySlabEffect,
    slabPosition: Position
}

/**
 * Execute the slab effect
 * @param position The position of the slab which effect must be applied
 */
export const playSlabEffectMove = (position: Position): PlaySlabEffect => ({
    type: MoveType.PlaySlabEffect,
    slabPosition: position
});

/**
 * Execute the slab by:
 *  - displaying it if necessary
 *  - executing the effect
 *  - if no specific action, end player turn
 *
 * @param state The game state
 * @param move The play slab move
 */
const playSlabEffect = (state: GameState | GameStateView, move: PlaySlabEffect): void => {

    const slab = state.pond[move.slabPosition.x][move.slabPosition.y];

    if (slab && isKnownSlab(slab)) {
        const frog = state.players
            .flatMap(player => player.femaleFrogs.filter(frog => !!frog.position && player.lastPlayedFrogId === frog.id))
            .find(frog => frog.position?.x === move.slabPosition.x && frog.position?.y === move.slabPosition.y);

        if (frog) {
            const player = state.players.find(player => player.color === frog.color)!;
            switch (slab.front) {
                case SlabFrontType.PIKE:
                    frog.status = FrogStatus.ELIMINATED;
                    player.done = true;
                    break;
                // Nothing to do
                case SlabFrontType.REED:
                case SlabFrontType.LOG:
                    player.done = true;
                    break;
                // Can move another frog
                case SlabFrontType.MOSQUITO:
                    frog.status = FrogStatus.STUNG;
                    player.done = player.femaleFrogs.filter(f => !!f.position).every(f => [FrogStatus.BOGGED, FrogStatus.STUNG].includes(f.status));
                    break;
                // Must move on another slab
                case SlabFrontType.WATER_LILY:
                    frog.status = FrogStatus.BOUNCING;
                    break;
                // Locked for one turn
                case SlabFrontType.MUD:
                    frog.status = FrogStatus.BOGGED;
                    player.done = true;
                    break;
                // Will create a new frog on the tile if its a queen
                case SlabFrontType.RED_MALE:
                    mayProduceFrogBirth(player!, MaleFrog.Red, frog)
                    break;
                case SlabFrontType.BLUE_MALE:
                    mayProduceFrogBirth(player!, MaleFrog.Blue, frog)
                    break;
                case SlabFrontType.YELLOW_MALE:
                    mayProduceFrogBirth(player!, MaleFrog.Yellow, frog)
                    break;
                case SlabFrontType.GREEN_MALE:
                    mayProduceFrogBirth(player!, MaleFrog.Green, frog)
                    break;
                case SlabFrontType.PURPLE_MALE:
                    mayProduceFrogBirth(player!, MaleFrog.Purple, frog)
                    break;
                case SlabFrontType.PINK_MALE:
                    mayProduceFrogBirth(player!, MaleFrog.Pink, frog)
                    break;
            }
        }
    }
}
/**
 * Indicate to the state that a new frog must birth
 * @param player The player of the frog
 * @param male The male token
 * @param frog The frog that trigger the slab
 */
const mayProduceFrogBirth = (player: Player, male: MaleFrog, frog: FemaleFrog) => {

    player!.done = true;
    if (!frog.isQueen) {
        return;
    }

    if (player.maleFrogs.find(token => token === male) && player.femaleFrogs.some(frog => !frog.position)) {
        player.birth = true;
        player.birthMale = male;
    }
}
export { playSlabEffect };