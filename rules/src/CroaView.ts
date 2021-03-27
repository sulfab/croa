import { Game } from '@gamepark/rules-api';
import { getPredictableAutomaticMoves } from './Croa';
import { GameStateView } from './GameState';
import { eliminateFrog, acquireServant, moveFrog, MoveType, MoveView, playSlabEffect, revealSlabInView, skipTurn } from './moves';

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
                moveFrog(this.state, move);
                break;
            case MoveType.EliminateFrog:
                eliminateFrog(this.state, move);
                break;
            case MoveType.PlaySlabEffect:
                playSlabEffect(this.state, move);
                break;
            case MoveType.RevealSlab:
                revealSlabInView(this.state, move)
                break;
            case MoveType.AcquireServant:
                acquireServant(this.state, move);
                break;
            case MoveType.SkipTurn:
                skipTurn(this.state);
                break;
        }
    }
    
}