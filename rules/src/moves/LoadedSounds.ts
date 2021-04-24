import { GameStateView } from '../GameState';

export type LoadedSounds = {
  type: 'LoadedSounds',
  sound: string,
  audio: any
}

export const loadedSoundsMove = (sound: string, audio: any): LoadedSounds => ({
  type: 'LoadedSounds', sound, audio
})

export function loadedSounds(state: GameStateView, move: LoadedSounds) {
  if (!state.sounds) {
    state.sounds = {};
  }

  console.log(move.sound, move.audio);

  state.sounds[move.sound] = move.audio;
}
