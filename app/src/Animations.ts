import { GameState } from '@gamepark/croa/GameState';
import { Move, MoveType, MoveView } from '@gamepark/croa/moves';
import { PlayerColor } from '@gamepark/croa/player';
import { Animations } from '@gamepark/react-client';

const CroaAnimation: Animations<GameState, MoveView, PlayerColor> = {
    getAnimationDuration(move: MoveView) {
        switch(move.type) {
            case MoveType.MoveFrog:
                return 0.6;
            case MoveType.EliminateFrog:
                return 0.5;
            case MoveType.RevealSlab:
                return 2;
            case MoveType.AcquireServant:
                return !move.male? 0.5: 1.5;
            case MoveType.SkipTurn:
                return 0;
            default:
                return 0.1;
        }
    },

    getUndoAnimationDuration(move: Move): number {
        switch(move.type) {
            case MoveType.MoveFrog:
                return 0.6;
            case MoveType.EliminateFrog:
                return 0;
            case MoveType.RevealSlab:
                return 2;
            case MoveType.AcquireServant:
                return 0;
            case MoveType.SkipTurn:
                return 0;
            default:
                return 0;
        }
    }
}

export {
    CroaAnimation
};