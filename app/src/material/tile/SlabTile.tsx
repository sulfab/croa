import { isKnownSlab, Slab } from '@gamepark/croa/pond';
import { isRevealSlab, moveFrogMove, RevealSlabView } from '@gamepark/croa/moves';
import { useAnimation, useAnimations, usePlay, usePlayerId } from '@gamepark/react-client';
import { FunctionComponent, useRef } from 'react';
import { DragObjectType, FrogFromBoard } from '../../drag-objects';
import { FemaleFrog, FrogStatus } from '@gamepark/croa/frog';
import { PlayerColor } from '@gamepark/croa/player';
import { Position } from '@gamepark/croa/common/Position';
import { useDrop } from 'react-dnd';
import { css, keyframes } from '@emotion/react';
import { isAllowedMove } from '@gamepark/croa/utils';
import { slabBackImages, slabFrontImages } from '../../utils/SlabImages';
import { useLongPress } from '../../utils/useLongPress';
import { highlightTileMove } from '@gamepark/croa/moves/HighlighTile';

type SlabTileProps = {
    slab: Slab | Pick<Slab, 'back'>;
    position: Position;
    visualPosition: Position;
    frogs: Array<FemaleFrog>;
    boardSize: number;
    activePlayer?: PlayerColor;
    selectedFrogId?: number;
    highlightedTile?: number;
}

const SlabTile: FunctionComponent<SlabTileProps> = ({ slab, position, visualPosition, frogs, boardSize, activePlayer, selectedFrogId, highlightedTile }) => {
    const play = usePlay();
    const playerId = usePlayerId<PlayerColor>();
    const animation = useAnimation<RevealSlabView>(animation => isRevealSlab(animation.move) && animation.move.slabPosition.x === position.x && animation.move.slabPosition.y === position.y)
    const animating = useAnimations().length > 0;
    const hoverEvent = useRef<NodeJS.Timeout>();

    const selectedFrog = selectedFrogId && frogs.find(frog => frog.id === selectedFrogId && frog.color === playerId);

    const isValidSlab = () => !animating && selectedFrog && canBeDropped(selectedFrog.id, frogs) && playerId === activePlayer && FrogStatus.Fed !== selectedFrog.status
    const isInvalidSlab = () => !animating && selectedFrog && isAdjacentSlab(selectedFrog) && !canBeDropped(selectedFrog.id, frogs) && playerId === activePlayer && FrogStatus.Fed !== selectedFrog.status;

    /**
     * Does the current tile the previous tile if the from is a bouncing frog
     * @param frog Selected frog
     */
    const isBouncingFrogPreviousTile = (frog: FemaleFrog) => {
        return FrogStatus.Bouncing === frog.status && frog.previousPosition && frog.previousPosition.x === position.x && frog.previousPosition.y === position.y
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
        if (FrogStatus.Bouncing === frog.status) {
            allowedMove = allowedMove && !isBouncingFrogPreviousTile(frog)
        }

        return allowedMove && isAllowedMove(frogs, frog, { x: position.x - frog.position.x, y: position.y - frog.position.y }, slab, boardSize);
    };

    const [{ isOver }, ref] = useDrop({
        accept: DragObjectType.FrogFromBoard,
        canDrop: (item: FrogFromBoard) => canBeDropped(selectedFrogId || item.frog.id, frogs),
        drop: (item: FrogFromBoard) => moveFrogMove(item.frog.id, item.frog.color, position),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    const onTileClick = () => {
        if (!animating && selectedFrogId && canBeDropped(selectedFrogId, frogs)) {
            return play(moveFrogMove(selectedFrogId, playerId!, position));
        }
    }

    const highlightSlab = () => {
        if (isKnownSlab(slab) && slab.front && highlightedTile !== slab.front) {
            hoverEvent.current = setTimeout(() => {
                play(highlightTileMove(slab.front), { local: true });
            }, 200);
        }
    }

    const onLeaveTile = () => {
        if (hoverEvent.current) {
            clearTimeout(hoverEvent.current);
        }
    }
    const longPress = useLongPress({
        onClick: onTileClick,
        onLongPress: () => {
            if (isKnownSlab(slab)) {
                play(highlightTileMove(slab.front), { local: true });

                if (window.navigator.vibrate) {
                    window.navigator.vibrate(200)
                }
            }
        },
        onMouseLeave: onLeaveTile
    })
    
    return (
        <div ref={ ref } onMouseEnter={ highlightSlab } css={[slabStyle, animation && css`z-index: 2` ]} { ...longPress }>
            <div css={[slabStyle, !animation && isKnownSlab(slab) && css`transform: rotateY(180deg);`, animation && slabAnimation(animation.duration, additionalTranslate)]} >
                <div css={[backAndFrontSlab, !isKnownSlab(slab) && ((isValidSlab() && selectableSlab) || (isInvalidSlab() && unselectableSlab)), isOver && isValidSlab() && overSlab]} style={{backgroundImage: `url(${slabBackImages.get(slab.back)})`}}/>
                { (isKnownSlab(slab) || animation?.move.front !== undefined) && <div css={[slabFront, backAndFrontSlab, isKnownSlab(slab) && ((isValidSlab() && selectableSlab) || (isInvalidSlab() && unselectableSlab)), isOver && isValidSlab() && overSlab]} style={{ backgroundImage: `url(${slabFrontImages.get(isKnownSlab(slab)? slab.front : animation?.move.front!)})` }}>
                    
                </div> }
            </div>
        </div>
    )
}

const slabStyle = css`
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
`;

const slabFront = css`
    transform: rotateY(180deg);
`;

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

const overSlab = css`
    box-shadow: 0 0.5em 0.7em black, 0 0 0.3em 0.6em green inset;
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
    cursor: pointer;
    box-shadow: 0 0.5em 0.7em black, 0 0 0.3em 0.4em gold inset;
    &:hover {
        box-shadow: 0 0.5em 0.7em black, 0 0 0.3em 0.6em green inset;
    }
    
`

const unselectableSlab = css`
    box-shadow: 0 0.5em 0.7em black, 0 0 0.3em 0.4em red inset;
`

export {
    SlabTile
};