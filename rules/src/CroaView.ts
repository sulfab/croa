import { Game } from "@gamepark/rules-api";
import { eliminateFrogAction, frogBirthAction, moveFrogAction, playSlabEffectAction, revealSlabInView, skipTurnAction } from "./action";
import { getPredictableAutomaticMoves } from "./Croa";
import { GameStateView } from "./GameState";
import { MoveType, MoveView } from "./moves";

export default class CroaView implements Game<GameStateView, MoveView> {

    state: GameStateView;

    constructor(state: GameStateView) {
        this.state = state;
    }

    getAutomaticMove() {
        // If the tile is not known, reveal the tile, instead play the tile
        const activePlayer = this.state.players.find(player => player.color === this.state.activePlayer);
    
        if (!activePlayer) {
          return;
        }
        
        return getPredictableAutomaticMoves(this.state, activePlayer)
    }

    play(move: MoveView): void {
        switch(move.type) {
            case MoveType.MoveFrog:
                moveFrogAction(this.state, move);
                break;
            case MoveType.EliminateFrog:
                eliminateFrogAction(this.state, move);
                break;
            case MoveType.PlaySlabEffect:
                playSlabEffectAction(this.state, move);
                break;
            case MoveType.RevealSlab:
                revealSlabInView(this.state, move)
                break;
            case MoveType.FrogBirth:
                frogBirthAction(this.state, move);
                break;
            case MoveType.SkipTurn:
                skipTurnAction(this.state);
                break;
        }
    }
    
}