import { GameStateView } from '../GameState';
import { SlabFrontType } from '../pond';

export type HighlightTile = {
  type: 'HighlightTile',
  tileId: SlabFrontType
}

export const highlightTileMove = (tileId: SlabFrontType): HighlightTile => ({
  type: 'HighlightTile', tileId
})

export function highlightTile(state: GameStateView, move: HighlightTile) {
  state.highlightedTile = move.tileId
}
