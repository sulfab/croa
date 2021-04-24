import { Action, Game, Undo } from '@gamepark/rules-api';
import { getPredictableAutomaticMoves } from './Croa';
import { GameStateView } from './GameState';
import {
    acquireServant,
    eliminateFrog,
    highlightTile,
    HighlightTile,
    moveFrog,
    MoveType,
    MoveView,
    playSlabEffect,
    revealSlabInView,
    selectFrog,
    SelectFrog,
    skipTurn
} from './moves';
import { PlayerColor } from './player';

type LocalMove = MoveView | SelectFrog | HighlightTile;
export default class CroaView implements
    Game<GameStateView, LocalMove>,
    Undo<GameStateView, MoveView, PlayerColor> {

    state: GameStateView;

    constructor(state: GameStateView) {
        this.state = state;
    }

    canUndo(action: Action<MoveView, PlayerColor>, consecutiveActions: Action<MoveView, PlayerColor>[]): boolean {
      return !action.consequences.some(move => [MoveType.SkipTurn, MoveType.RevealSlab].includes(move.type))
        && action.consequences.some(move => move.type === MoveType.PlaySlabEffect)
        && consecutiveActions.length === 0;
    }

    getAutomaticMove() {
        // If the tile is not known, reveal the tile, instead play the tile
        const activePlayer = this.state.players.find(player => player.color === this.state.activePlayer);

        if (!activePlayer) {
          return;
        }

        return getPredictableAutomaticMoves(this.state, activePlayer)
    }

    play(move: LocalMove): void {
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
            case 'SelectFrog':
                selectFrog(this.state, move);
                break;
            case 'HighlightTile':
                highlightTile(this.state, move);
                break;
        }
    }

}