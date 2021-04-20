import { css, keyframes } from '@emotion/react';
import { FemaleFrog, FrogStatus } from '@gamepark/croa/frog';
import { PlayerColor } from '@gamepark/croa/player';
import { useAnimation, useAnimations, usePlay, usePlayerId } from '@gamepark/react-client';
import { Draggable } from '@gamepark/react-components';
import { FunctionComponent, useEffect } from 'react';
import { frogMiniContainer } from '../../utils/Styles';
import { frogFromBoard } from '../../drag-objects';
import { Position } from '@gamepark/croa/common/Position';
import { DraggableProps } from '@gamepark/react-components/dist/Draggable/Draggable';
import { EliminateFrog, eliminateFrogMove, isEliminateFrog, isMoveFrog, Move, MoveFrog, selectFrogMove } from '@gamepark/croa/moves';
import { FrogAnimation } from './FrogAnimation';

type FrogMiniProps = {
  frog: FemaleFrog;
  movable: boolean;
  targeted: boolean,
  activePlayer?: PlayerColor;
  selectedFrogId?: number;
  visualPosition?: Position;
  preTransform?: string;
  horizontalOrientation: 'left' | 'right';
  verticalOrientation: 'top' | 'bottom';
} & Omit<DraggableProps<any, any>, 'type' | 'item'>

const FrogMini: FunctionComponent<FrogMiniProps> = ({
                                                      frog,
                                                      targeted,
                                                      movable,
                                                      selectedFrogId,
                                                      horizontalOrientation,
                                                      verticalOrientation,
                                                      activePlayer,
                                                      visualPosition,
                                                      preTransform,
                                                      ...props
                                                    }) => {
  const playerId = usePlayerId();
  const play = usePlay();
  const animatingMove = useAnimation<MoveFrog>(animation => isMoveFrog(animation.move) && animation.move.frogId === frog.id && animation.move.playerId === frog.color);
  const animatingElimination = useAnimation<EliminateFrog>(animation => isEliminateFrog(animation.move) && animation.move.frogId === frog.id && animation.move.playerId === frog.color);
  const animating = useAnimations().length > 0;
  const isCurrentPlayerFrog = playerId !== undefined && playerId === frog.color && playerId === activePlayer;
  const isSelected = selectedFrogId && selectedFrogId === frog.id && playerId === frog.color;
  const canBeMoved = isCurrentPlayerFrog && movable && !animating;


  // Detect change of frog between state and current frog
  // Unset the frog if it can't be moved
  useEffect(() => {
    if (isSelected && !canBeMoved) {
      play(selectFrogMove(), { local: true })
    }

    if (!isSelected && canBeMoved && frog.status === FrogStatus.Bouncing) {
      play(selectFrogMove(frog.id), { local: true })
    }

    // eslint-disable-next-line
  }, [isSelected, canBeMoved, frog]);

  const onDropFrog = (move: Move) => {
    if (move) {
      play(move);
    }
  };

  const onDrag = () => {
    play(selectFrogMove(frog.id), { local: true })
    return frogFromBoard(frog);
  };

  const onSelectFrog = () => {

    // In case the selected frog is a targeted one, trigger elimination
    if (targeted) {
      return play(eliminateFrogMove(frog));
    }

    if (!isCurrentPlayerFrog || !canBeMoved || animating) {
      return;
    }

    const selectedFrog = selectedFrogId;
    if (!selectedFrog || frog.id !== selectedFrog) {
      return play(selectFrogMove(frog.id), { local: true });
    }

    if (FrogStatus.Bouncing !== frog.status) {
      return play(selectFrogMove(), { local: true });
    }
  };

  const isMoveFrogAnimation = () => animatingMove && isMoveFrog(animatingMove.move);
  const isSelectable = canBeMoved && !isSelected && !isMoveFrogAnimation();
  const frogZIndex = ((visualPosition!.y + 1) * 10) + (visualPosition!.x + 1);
  const getAnimation = () => {
    if (isMoveFrogAnimation()) {
      return verticalOrientation === 'top' ? 'jumping_back' : 'jumping_front';
    }

    return 'blinking';
  };

  const boggedTransformation = FrogStatus.Bogged === frog.status ? `translate(1em, 1em) rotateZ(${horizontalOrientation === 'left' ? 140 : -140}deg);` : '';

  return (
    <Draggable {...props}
               onClick={onSelectFrog}
               type={frogFromBoard(frog).type}
               draggable={playerId === frog.color}
               canDrag={ activePlayer !== undefined && canBeMoved }
               item={onDrag}
               end={onSelectFrog}
               drop={onDropFrog}
               preTransform={preTransform}
               postTransform={boggedTransformation}
               css={[
                 frogMiniContainer(frog, frogZIndex),
                 isSelectable && selectableFrog,
                 frog.color !== playerId && !targeted && pointEvents,
                 animatingElimination && frogDisappearance(animatingElimination.duration),
                 targeted && targetedFrog
               ]}>
      <FrogAnimation frog={frog} animation="blinking" visible={getAnimation() === 'blinking'} duration={1}
                     delay={Math.min(Math.abs(Math.tan(frog.color + frog.id * 2)), 3)}
                     css={css`transform: rotateY(${horizontalOrientation === 'left' ? 180 : 0}deg)`}/>
      <FrogAnimation frog={frog} animation="jumping_front" visible={getAnimation() === 'jumping_front'}
                     duration={animatingMove && animatingMove.duration}
                     css={[css`transform: rotateY(${horizontalOrientation === 'left' ? 180 : 0}deg)`]}/>
      <FrogAnimation frog={frog} animation="jumping_back" visible={getAnimation() === 'jumping_back'}
                     duration={animatingMove && animatingMove.duration}
                     css={[css`transform: rotateY(${horizontalOrientation === 'left' ? 180 : 0}deg)`]}/>
    </Draggable>
  );
};

const pointEvents = css`
  pointer-events: none;
`;

const selectableFrogAnimation = keyframes`
  from {
    filter: drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold)
  }
  to {
    filter: drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold)
  }
`;

const selectableFrog = css`
  animation: ${selectableFrogAnimation} 1s ease-in-out infinite alternate;
`;

const targetedFrog = css`
  z-index: 3;
  filter: drop-shadow(0 0 0.2em red) drop-shadow(0 0 0.2em red) drop-shadow(0 0 0.2em red) drop-shadow(0 0 0.2em red)
`;


const frogDisappearanceAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const frogDisappearance = (duration: number) => css`
  animation: ${frogDisappearanceAnimation} ${duration}s ease-in-out forwards;
`;


export {
  FrogMini
};