import { GameStateView } from '../GameState';

export type SelectFrog = {
  type: 'SelectFrog',
  frogId?: number
}

export const selectFrogMove = (frogId?: number): SelectFrog => ({
  type: 'SelectFrog', frogId
})

export function selectFrog(state: GameStateView, move: SelectFrog) {
  state.selectedFrogId = move.frogId
}
