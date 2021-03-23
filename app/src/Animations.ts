import { GameState } from "@gamepark/croa/GameState";
import { MoveType, MoveView } from "@gamepark/croa/moves";
import { PlayerColor } from "@gamepark/croa/player";
import { Animations } from "@gamepark/react-client";

const CroaAnimation: Animations<GameState, MoveView, PlayerColor, PlayerColor> = {
    getAnimationDuration(move: MoveView) {
        switch(move.type) {
            case MoveType.MoveFrog:
                return 0.7;
            case MoveType.EliminateFrog:
                return 0.5;
            case MoveType.PlaySlabEffect:
                return 0.5;
            case MoveType.RevealSlab:
                return 2;
            case MoveType.FrogBirth:
                return 2;
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