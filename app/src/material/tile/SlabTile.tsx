import { Slab } from '@gamepark/croa/pond';
import { isRevealSlab, moveFrogMove, RevealSlabView } from '@gamepark/croa/moves'
import { useAnimation, useAnimations, useDisplayState, usePlay, usePlayerId } from '@gamepark/react-client';
import { FunctionComponent } from 'react';
import './SlabTile.css';
import { DragObjectType, FrogFromBoard } from '../../drag-objects';
import { FemaleFrog, FrogStatus } from '@gamepark/croa/frog';
import { PlayerColor } from '@gamepark/croa/player';
import { Position } from '@gamepark/croa/common/Position';
import { useDrop } from 'react-dnd';
import { css, keyframes } from '@emotion/react';
import { isAllowedMove } from '@gamepark/croa/utils';
import { slabBackImages, slabFrontImages } from '../../utils/SlabImages';

type SlabTileProps = {
    slab: Slab;
    position: Position;
    visualPosition: Position;
    frogs: Array<FemaleFrog>;
    boardSize: number;
    activePlayer?: PlayerColor;
}

const SlabTile: FunctionComponent<SlabTileProps> = ({ slab, position, visualPosition, frogs, boardSize, activePlayer }) => {
    const [selectedFrogId,] = useDisplayState<number | undefined>(undefined);
    const play = usePlay();
    const playerId = usePlayerId<PlayerColor>();
    const animation = useAnimation<RevealSlabView>(animation => isRevealSlab(animation.move) && animation.move.slabPosition.x === position.x && animation.move.slabPosition.y === position.y)
    const animating = useAnimations().length > 0

    const selectedFrog = selectedFrogId && frogs.find(frog => frog.id === selectedFrogId && frog.color === playerId);

    const isValidSlab = () => !animating && selectedFrog && canBeDropped(selectedFrog.id, frogs) && playerId === activePlayer && FrogStatus.STUNG !== selectedFrog.status
    const isInvalidSlab = () => !animating && selectedFrog && isAdjacentSlab(selectedFrog) && !canBeDropped(selectedFrog.id, frogs) && playerId === activePlayer && FrogStatus.STUNG !== selectedFrog.status;

    /**
     * Does the current tile the previous tile if the from is a bouncing frog
     * @param frog Selected frog
     */
    const isBouncingFrogPreviousTile = (frog: FemaleFrog) => {
        return FrogStatus.BOUNCING === frog.status && frog.previousPosition && frog.previousPosition.x === position.x && frog.previousPosition.y === position.y
    }

    /**
     * Does the current tile an adjacent one to the given frog
     * @param frog The frog where tiles needs to be compared
     */
    const isAdjacentSlab = (frog: FemaleFrog) => {
        const deltaX = Math.abs(position.x - frog.position!.x);
        const deltaY = Math.abs(position.y - frog.position!.y);
        return (deltaY <= 1 && deltaX <= 1 && (deltaX !== 0 || deltaY !== 0))
    };

    const additionalTranslate = visualPosition.y === boardSize - 1? 'translateY(-60%)': visualPosition.y === 0? 'translateY(50%)': '';
    
    /**
     * Frog can be dropped only if the slab is not empty or a log is on the slab
     */
    const canBeDropped = (frogId: number, frogs: Array<FemaleFrog>): boolean => {
        const frog = frogs.find(frog => frog.id === frogId && frog.color === playerId);
        if (playerId === undefined || !frog || !frog.position) {
            return false;
        }
            
        let allowedMove = isAdjacentSlab(frog);
        if (FrogStatus.BOUNCING === frog.status) {
            allowedMove = allowedMove && !isBouncingFrogPreviousTile(frog)
        }

        return allowedMove && isAllowedMove(frogs, frog, { x: position.x - frog.position.x, y: position.y - frog.position.y }, slab, boardSize);
    };

    const [, ref] = useDrop({
        accept: DragObjectType.FROG_FROM_BOARD,
        canDrop: (item: FrogFromBoard) => canBeDropped(selectedFrogId || item.frog.id, frogs),
        drop: (item: FrogFromBoard) => moveFrogMove(item.frog.id, item.frog.color, position)
    });

    const onTileClick = () => {
        if (selectedFrogId && canBeDropped(selectedFrogId, frogs)) {
            return play(moveFrogMove(selectedFrogId, playerId!, position));
        }
    }
    
    return (
        <div ref={ ref } onClick={ onTileClick } className="slab" css={[animation && css`z-index: 2`]}>
            <div className={`slab-inner`} css={[!animation && slab.displayed && css`transform: rotateY(180deg);`, animation && slabAnimation(animation.duration, additionalTranslate)]} >
                <div css={[backAndFrontSlab, !slab.displayed && ((isValidSlab() && selectableSlab) || (isInvalidSlab() && unselectableSlab))]} style={{backgroundImage: `url(${slabBackImages.get(slab.back)})`}}/>
                { (slab.displayed || animation?.move.front !== undefined) && <div css={[backAndFrontSlab, slab.displayed && ((isValidSlab() && selectableSlab) || (isInvalidSlab() && unselectableSlab)) ]} style={{ backgroundImage: `url(${slabFrontImages.get(slab.front !== undefined? slab.front : animation?.move.front!)})` }} className={`slab-front`}>
                    
                </div> }
            </div>
        </div>
    )
}

const scale = (translate?: string) => keyframes`
  30% {
    transform: ${translate} scale(2.0);
  }
  65% {         
    transform: ${translate} rotateY(180deg) scale(2.0);
  }
  100% {          
    transform: rotateY(180deg) scale(1.0);
  }
`

const slabAnimation = (duration: number, translate: string) => css`
    animation: ${scale(translate)} ${duration}s ease-in-out forwards;
`

const backAndFrontSlab = css`
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background-size: 100% 100%;
    border-radius: 15%;
    image-rendering: -webkit-optimize-contrast;
    box-shadow: 0 0.5em 0.7em black;
`

const selectableSlab = css`
    box-shadow: 0 0.5em 0.7em black, 0 0 0.3em 0.4em gold inset;
`

const unselectableSlab = css`
    box-shadow: 0 0.5em 0.7em black, 0 0 0.3em 0.4em red inset;
`

export {
    SlabTile
};