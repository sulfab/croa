import { GameState, GameStateView } from "../GameState";
import { PlaySlabEffect } from "../moves/PlaySlabEffect";
import { SlabFrontType } from "../pond/SlabFrontType";
import { isKnownSlab } from "../pond";
import { FemaleFrog, MaleFrog } from "../frog";
import { Player } from "../player";
/**
 * Execute the slab by:
 *  - displaying it if necessary
 *  - executing the effect
 *  - if no specific action, end player turn
 * 
 * @param state The game state
 * @param move The play slab move
 */
const playSlabEffectAction = (state: GameState | GameStateView, move: PlaySlabEffect): void => {

    const slab = state.pond[move.slabPosition.x][move.slabPosition.y];
    
    if (slab && isKnownSlab(slab)) {
        const frog = state.players
            .flatMap(player => player.femaleFrogs)
            .find(frog => !!frog.position && frog.hasMoved 
                            && frog.position?.x === move.slabPosition.x 
                            && frog.position?.y === move.slabPosition.y);
        
        if (frog) {
            const player = state.players.find(player => player.color === frog.color);

            switch (slab.front) {
                case SlabFrontType.PIKE:
                    frog.eliminated = true;
                    break;
                // Nothing to do
                case SlabFrontType.REED:
                case SlabFrontType.LOG:
                    break;
                // Can move another frog
                case SlabFrontType.MOSKITO:
                    frog.stung = true;
                    break;
                // Must move on another slab
                case SlabFrontType.NENUPHAR:
                    frog.bouncing = true;
                    break;
                // Locked for one turn
                case SlabFrontType.MUD:
                    frog.mudded = true;
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

            frog.hasMoved = false;

            // Boucing again act as non-end of the turn
            if (!frog.bouncing && !frog.stung) {

                // Remove mud on all frogs of the player except the current because it means that it was just mudded
                player!.femaleFrogs
                    .filter(f => f.id !== frog.id)
                    .forEach(f => f.mudded = false )

                const playerNotEliminated = state.players.filter(player => !player.eliminated)
                const activePlayerIndex = playerNotEliminated.findIndex(player => player.color === state.activePlayer)
                const nextPlayerIndex = (activePlayerIndex + 1) % playerNotEliminated.length
                state.activePlayer = playerNotEliminated.length > 1? playerNotEliminated[nextPlayerIndex].color: undefined
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
    
    if (!frog.isQueen) {
        return;
    }

    if (player.maleFrogs.find(token => token === male) && player.femaleFrogs.some(frog => !frog.position)) {
        player.birth = true;
        player.birthMale = male;
    }
}

export {
    playSlabEffectAction
};