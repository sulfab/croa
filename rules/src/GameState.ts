import { Player, PlayerColor } from "./player";
import { Slab } from "./pond";

export interface GameState {
  players: Array<Player>;
  activePlayer?: PlayerColor;
  pond: Slab[][];
  round: number;
}

export type GameStateView = Omit<GameState, 'pond'> & {
  pond: (Slab | Pick<Slab, 'back'>)[][];
}