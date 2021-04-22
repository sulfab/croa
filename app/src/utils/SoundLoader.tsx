import React, { useEffect, useRef } from 'react';

type SoundLoaderProps = {
  sounds: string[]
  onSoundLoad?: () => void
}

const SoundLoader: React.FunctionComponent<SoundLoaderProps> = ({sounds, onSoundLoad}) => {
  const loadCount = useRef(0);
  const totalLoadCount = sounds.length;

  useEffect(() => {
    sounds.forEach(sound => {
      let audio = new Audio();
      audio.addEventListener('canplaythrough', onLoad, false);
      audio.src = sound;
      audio.load();
    })
  // eslint-disable-next-line
  }, []);

  const onLoad = () => {
    loadCount.current++;
    if (onSoundLoad && loadCount.current === totalLoadCount) {
      onSoundLoad();
    }
  }

  return null;
}

export {
  SoundLoader
};
