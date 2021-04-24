import React, { useEffect } from 'react';
import { AudioLoader } from './AudioLoader';

type SoundLoaderProps = {
  sounds: string[]
  onSoundsLoad?: () => void
  onSoundsPrepared?: (audioLoader: AudioLoader) => void
}

const SoundLoader: React.FunctionComponent<SoundLoaderProps> = ({sounds, onSoundsLoad, onSoundsPrepared}) => {
  useEffect(() => {
    const audioLoader = new AudioLoader(sounds.map(sound => ({ id: sound, url: sound })));
    audioLoader.load(() => {

      if (onSoundsPrepared) {
        onSoundsPrepared(audioLoader);
      }

      if (onSoundsLoad) {
        onSoundsLoad();
      }
    })
  // eslint-disable-next-line
  }, []);

  return null;
}

export {
  SoundLoader
};
