import { Position } from '../common/Position';
import { MoveType } from './MoveType';
import { Player } from '../player';
import { FemaleFrog, FrogStatus, MaleFrog } from '../frog';
import { GameState, GameStateView } from '../GameState';
import { isKnownSlab, SlabFrontType } from '../pond';
import { isGameOver } from '../utils';

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
        state.lastSlab = slab.front;
        const frog = state.players
            .flatMap(player => player.femaleFrogs.filter(frog => !!frog.position && player.lastFrogId === frog.id))
            .find(frog => frog.position?.x === move.slabPosition.x && frog.position?.y === move.slabPosition.y);

        if (frog) {
            const player = state.players.find(player => player.color === frog.color)!;
            switch (slab.front) {
                case SlabFrontType.Pike:
                    frog.status = FrogStatus.Eliminated;
                    player.done = true;
                    break;
                // Nothing to do
                case SlabFrontType.Reed:
                case SlabFrontType.Log:
                    player.done = true;
                    break;
                // Can move another frog
                case SlabFrontType.Mosquito:
                    frog.status = FrogStatus.Fed;
                    player.done = isGameOver(state.players) || player.femaleFrogs.filter(f => !!f.position).every(f => [FrogStatus.Bogged, FrogStatus.Fed].includes(f.status));
                    break;
                // Must move on another slab
                case SlabFrontType.WaterLily:
                    frog.status = FrogStatus.Bouncing;
                    break;
                // Locked for one turn
                case SlabFrontType.Mud:
                    frog.status = FrogStatus.Bogged;
                    player.done = true;
                    break;
                // Will create a new frog on the tile if its a queen
                case SlabFrontType.RedMale:
                    mayProduceFrogBirth(player, MaleFrog.Red, frog)
                    break;
                case SlabFrontType.BlueMale:
                    mayProduceFrogBirth(player, MaleFrog.Blue, frog)
                    break;
                case SlabFrontType.YellowMale:
                    mayProduceFrogBirth(player, MaleFrog.Yellow, frog)
                    break;
                case SlabFrontType.GreenMale:
                    mayProduceFrogBirth(player, MaleFrog.Green, frog)
                    break;
                case SlabFrontType.PurpleMale:
                    mayProduceFrogBirth(player, MaleFrog.Purple, frog)
                    break;
                case SlabFrontType.PinkMale:
                    mayProduceFrogBirth(player, MaleFrog.Pink, frog)
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

    player.done = true;
    if (!frog.isQueen) {
        return;
    }

    if (player.maleFrogs.find(token => token === male) !== undefined && player.femaleFrogs.some(frog => !frog.position)) {
        player.birth = true;
        player.birthMale = male;
    }
}
export { playSlabEffect };