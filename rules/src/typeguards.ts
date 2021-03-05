import { GameState, GameStateView } from "./GameState";

export function isGameState(game: GameState | GameStateView): game is GameState {
    return (game as GameState).pond.flat().some(t => t.front === undefined);
}