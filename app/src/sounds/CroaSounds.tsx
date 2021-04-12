import { Slab } from '@gamepark/croa/pond';
import { FC, useEffect } from 'react';
import { useAnimation, useSound } from '@gamepark/react-client';
import { Sounds } from '../material/Resources';
import {
  AcquireServant,
  isAcquireServant,
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

const CroaSounds: FC<CroaSoundsProps> = () => {
  const [jump] = useSound(Sounds.jumpSound);
  const [croa] = useSound(Sounds.croaSound)
  const moveAnimation = useAnimation<MoveFrog>(animation => isMoveFrog(animation.move));
  const acquireAnimation = useAnimation<AcquireServant | RevealSlab>(animation => isAcquireServant(animation.move));
  const revealAnimation = useAnimation<RevealSlab>(animation => isRevealSlab(animation.move));
  const playSlabAnimation = useAnimation<PlaySlabEffect>(animation => isPlaySlabEffect(animation.move));
  useEffect(() => {
    if (!revealAnimation && !moveAnimation && !acquireAnimation && !playSlabAnimation) {
      return;
    }
    if (moveAnimation) {
      jump.play();
    }

    if (acquireAnimation) {
      croa.play();
    }
    // eslint-disable-next-line
  }, [revealAnimation && revealAnimation.move, moveAnimation && moveAnimation.move, acquireAnimation && acquireAnimation.move])

  return null;
}

export {
  CroaSounds
}