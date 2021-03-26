import { GameState, GameStateView } from "../GameState";
import { FrogBirth } from "../moves";
import { Player } from "../player";

/**
 * Action for new frog birth generation
 * @param state THe game state
 * @param move The actual movement
 */
const frogBirthAction = (state: GameState | GameStateView, move: FrogBirth) => {
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
            frog.position = { x: queen.position!.x, y: queen.position!.y };
            return true;
        }
    }

    return false;
}

export {
    frogBirthAction
};