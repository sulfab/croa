import { GameState, GameStateView } from "../GameState";
import { FrogBirth } from "../moves";

class FrogBirthAction {
    /**
     * Action for new frog birth generation
     * @param state THe game state
     * @param move The actual movement
     */
    static apply(state: GameState | GameStateView, move: FrogBirth): void {
        const player = state.players.find(player => player.color === move.playerId)
        if (!player) {
            return;
        }

        const male = move.male;
        if (player.maleFrogs.find(token => token === male) && player.femaleFrogs.some(frog => !frog.position)) {
            const queen = player.femaleFrogs.find(frog => frog.isQueen);
            if (queen) {
                const frog = player.femaleFrogs.find(frog => !frog.position)!;
                frog.position = { x: queen.position!.x, y: queen.position!.y };
                player.maleFrogs = player.maleFrogs.filter(maleToken => maleToken !== male);
                player.frogBirth = undefined;
            }
        }
    }
}

export {
    FrogBirthAction
};