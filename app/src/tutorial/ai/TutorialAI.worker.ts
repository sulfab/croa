import TutorialAI from './TutorialAI'
import { GameState } from '@gamepark/croa/GameState';
import { PlayerColor } from '@gamepark/croa/player';

export async function ai(game: GameState, playerId: PlayerColor) {
  return new TutorialAI(playerId).play(game)
}
