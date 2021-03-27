import { MaleFrog } from '../frog';
import { Player, PlayerColor } from '../player';
import Move from './Move';
import { MoveType } from './MoveType';
import { GameState, GameStateView } from '../GameState';

export type AcquireServant = {
    type: MoveType.AcquireServant,
    male?: MaleFrog,
    playerId: PlayerColor
}

/**
 * Move to generate a new frog
 */
export function acquireServantMove(playerId: PlayerColor, male?: MaleFrog): AcquireServant {
    return {
        type: MoveType.AcquireServant,
        playerId,
        male
    }
}

/**
 * Is acquire servant move
 */
export function isAcquireServant(move: Move): move is AcquireServant {
    return move.type === MoveType.AcquireServant;
}

/**
 * Action for acquiring a new servant
 * @param state THe game state
 * @param move The actual movement
 */
export const acquireServant = (state: GameState | GameStateView, move: AcquireServant) => {
    const player = state.players.find(player => player.color === move.playerId)
    if (!player) {
        return;
    }

    const male = move.male;

    // Case where player win a servant after killing a queen
    if (!male) {
        popNewServant(player);

        // Case where player win a servant after moving on a male slab
    } else if (player.maleFrogs.find(token => token === male) && player.femaleFrogs.some(frog => !frog.position)) {
        if (popNewServant(player)) {
            player.maleFrogs = player.maleFrogs.filter(maleToken => maleToken !== male);
        }
    }

    player.birth = false;
    delete player.birthMale;
}

const popNewServant = (player: Player): boolean => {
    const queen = player.femaleFrogs.find(frog => frog.isQueen);
    if (queen) {
        const frog = player.femaleFrogs.find(frog => !frog.position)!;

        if (frog) {
            frog.position = {x: queen.position!.x, y: queen.position!.y};
            return true;
        }
    }

    return false;
}