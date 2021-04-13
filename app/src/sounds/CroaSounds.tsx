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

type CroaSoundsProps = {
  pond: (Slab | Pick<Slab, 'back'>)[][]
}

const CroaSounds: FC<CroaSoundsProps> = ({ pond }) => {
  const [jump] = useSound(Sounds.jumpSound);
  const [croa] = useSound(Sounds.croaSound);
  const [mud] = useSound(Sounds.mudSound);
  const [mosquito] = useSound(Sounds.mosquitoSound);
  const [elimination] = useSound(Sounds.eliminationSound);
  const [ambiance] = useSound(Sounds.ambianceSound);
  const [pike] = useSound(Sounds.pikeSound);
  const [ambianceEnabled, setAmbianceEnabled] = useState(false);
  const [ambianceFail, setAmbianceFail] = useState(false);
  const moveAnimation = useAnimation<MoveFrog>(animation => isMoveFrog(animation.move));
  const acquireAnimation = useAnimation<AcquireServant | RevealSlab>(animation => isAcquireServant(animation.move));
  const revealAnimation = useAnimation<RevealSlab>(animation => isRevealSlab(animation.move));
  const playSlabAnimation = useAnimation<PlaySlabEffect>(animation => isPlaySlabEffect(animation.move));
  const eliminateAnimation = useAnimation<EliminateFrog>(animation => isEliminateFrog(animation.move));

  useEffect(() => {
    ambiance.loop = true;
    ambiance
      .play()
      .catch(() => setAmbianceFail(true))
  }, [ambiance])

  useEffect(() => {
    const enableAmbiance = () => {
      ambiance.loop = true;
      ambiance.play();
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
    if (!revealAnimation && !moveAnimation && !acquireAnimation && !playSlabAnimation && !eliminateAnimation) {
      return;
    }
    if (moveAnimation) {
      jump.volume = 0.1;
      jump.play();
    }

    if (acquireAnimation) {
      croa.volume = 0.1;
      croa.play();
    }

    if (eliminateAnimation) {
      elimination.volume = 0.1;
      elimination.play();
    }

    if (playSlabAnimation && isPlaySlabEffect(playSlabAnimation.move)) {
      const slab = pond[playSlabAnimation.move.slabPosition.x][playSlabAnimation.move.slabPosition.y];
      if (isKnownSlab(slab)) {
        switch(slab.front) {
          case SlabFrontType.Mud:
            mud.volume = 0.1;
            mud.play();
            break;
          case SlabFrontType.Mosquito:
            mosquito.volume = 0.1;
            mosquito.play();
            break;
          case SlabFrontType.Pike:
            pike.volume = 0.1;
            pike.play();
            break;
        }
      }
    }
    // eslint-disable-next-line
  }, [revealAnimation, moveAnimation, acquireAnimation, playSlabAnimation, eliminateAnimation])

  return null;
}

export {
  CroaSounds
}