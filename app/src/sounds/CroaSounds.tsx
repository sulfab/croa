import { isKnownSlab, Slab, SlabFrontType } from '@gamepark/croa/pond';
import { FC, useEffect, useState } from 'react';
import { useAnimation, useSound } from '@gamepark/react-client';
import { Sounds } from '../material/Resources';
import {
  AcquireServant,
  EliminateFrog,
  isAcquireServant,
  isEliminateFrog,
  isMoveFrog,
  isPlaySlabEffect,
  isRevealSlab,
  MoveFrog,
  PlaySlabEffect,
  RevealSlab
} from '@gamepark/croa/moves';
import { AudioLoader } from '../utils/AudioLoader';
import { useSelector } from 'react-redux';
import GamePageState from '@gamepark/react-client/dist/Types/GamePageState';

type CroaSoundsProps = {
  pond: (Slab | Pick<Slab, 'back'>)[][],
  audioLoader: AudioLoader
}

const CroaSounds: FC<CroaSoundsProps> = ({  audioLoader, pond }) => {
  // Creating this sound only to show the button in the menu
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useSound(Sounds.ambianceSound);
  const jump = Sounds.jumpSound;
  const croa = Sounds.croaSound;
  const mud = Sounds.mudSound;
  const mosquito = Sounds.mosquitoSound;
  const elimination = Sounds.eliminationSound;
  const ambiance = Sounds.ambianceSound;
  const pike = Sounds.pikeSound;
  const reveal = Sounds.revealSound;
  const [ambianceEnabled, setAmbianceEnabled] = useState(false);
  const [ambianceFail, setAmbianceFail] = useState(false);
  const moveAnimation = useAnimation<MoveFrog>(animation => isMoveFrog(animation.move));
  const acquireAnimation = useAnimation<AcquireServant>(animation => isAcquireServant(animation.move));
  const revealAnimation = useAnimation<RevealSlab>(animation => isRevealSlab(animation.move));
  const playSlabAnimation = useAnimation<PlaySlabEffect>(animation => isPlaySlabEffect(animation.move));
  const eliminateAnimation = useAnimation<EliminateFrog>(animation => isEliminateFrog(animation.move));
  const muted = useSelector((state: GamePageState) => state.soundsMuted)

  useEffect(() => {
    if (!muted) {
      audioLoader.unmute()
    } else {
      audioLoader.mute();
    }
  // eslint-disable-next-line
  }, [muted])

  useEffect(() => {
    // If the user hasn't click on the page before the audio context is loaded, the ambiance sound won't be run.
    // Then we add an event on the document to enable the ambiance only if it has failed.
    if (audioLoader.status() === 'suspended') {
      setAmbianceFail(true)
    } else {
      audioLoader.loop(ambiance);
    }
  // eslint-disable-next-line
  }, [ambiance])

  useEffect(() => {
    const enableAmbiance = () => {
      audioLoader.loop(ambiance);
      setAmbianceEnabled(true);
    }

    if (ambianceFail && !ambianceEnabled) {
        document.addEventListener('click', enableAmbiance)
    }

    return () => {
      document.removeEventListener('click', enableAmbiance)
    }
  // eslint-disable-next-line
  }, [ambianceFail, ambianceEnabled])

  useEffect(() => {
    if (revealAnimation) {
      audioLoader.play(reveal, false, 0.1);
    }
  // eslint-disable-next-line
  }, [revealAnimation?.move]);

  useEffect(() => {
    if (moveAnimation?.move) {
      audioLoader.play(jump, false, 0.1);
    }
  // eslint-disable-next-line
  }, [moveAnimation?.move]);

  useEffect(() => {
    if (eliminateAnimation) {
      audioLoader.play(elimination, false, 0.1);
    }
  // eslint-disable-next-line
  }, [eliminateAnimation?.move]);

  useEffect(() => {
    if (acquireAnimation) {
      audioLoader.play(croa, false, 0.1);
    }
  // eslint-disable-next-line
  }, [acquireAnimation?.move]);

  useEffect(() => {

    if (playSlabAnimation && isPlaySlabEffect(playSlabAnimation.move)) {
      const slab = pond[playSlabAnimation.move.slabPosition.x][playSlabAnimation.move.slabPosition.y];
      if (isKnownSlab(slab)) {
        switch(slab.front) {
          case SlabFrontType.Mud:
            audioLoader.play(mud, false, 0.1);
            break;
          case SlabFrontType.Mosquito:
            audioLoader.play(mosquito, false, 0.1);
            break;
          case SlabFrontType.Pike:
            audioLoader.play(pike, false, 0.1);
            break;
        }
      }
    }
    // eslint-disable-next-line
  }, [playSlabAnimation?.move])


  return null;
}

export {
  CroaSounds
}