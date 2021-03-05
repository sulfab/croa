import { css, keyframes } from "@emotion/react";
import Move from "@gamepark/croa/dist/moves/Move";
import { FemaleFrog } from "@gamepark/croa/frog";
import { PlayerColor } from "@gamepark/croa/player";
import { useAnimation, useDisplayState, usePlay, usePlayerId } from "@gamepark/react-client";
import { Draggable } from "@gamepark/react-components";
import { FunctionComponent, useCallback } from "react";
import { DragLayerMonitor, useDragLayer } from "react-dnd";
import { frogMiniAnimation, frogMiniContainer, frogMiniImage, queenFrogAnimations, servantFrogAnimations } from "../../utils/Styles";
import { DragObjectType, frogFromBoard } from "../../drag-objects";
import { Position } from "@gamepark/croa/common/Position";
import { DraggableProps } from "@gamepark/react-components/dist/Draggable/Draggable";
import { isMoveFrog, MoveFrog } from "@gamepark/croa/moves";


type FrogMiniProps = {
    frog: FemaleFrog;
    otherFrogs: Array<FemaleFrog>;
    activePlayer?: PlayerColor;
    visualPosition?: Position;
    preTransform?: string;
} & Omit<DraggableProps<any, any, any>, 'item'>

const FrogMini: FunctionComponent<FrogMiniProps> = ({ frog, otherFrogs, activePlayer, visualPosition, preTransform, ...props }) => {
    const [selectedFrog, setSelectedFrog] = useDisplayState<FemaleFrog | undefined>(undefined);
    const playerId = usePlayerId();
    const play = usePlay();
    const animation = useAnimation<MoveFrog>(animation => isMoveFrog(animation.move) && animation.move.frogId === frog.id && animation.move.playerId === frog.color);

    
    const isPlayerFrog = playerId && playerId === frog.color && playerId === activePlayer;
    const isOtherFrogDragging = useDragLayer(useCallback((monitor: DragLayerMonitor) => monitor.isDragging() && monitor.getItem().type === DragObjectType.FROG_FROM_BOARD 
        && (monitor.getItem().frog.id !== frog.id || monitor.getItem().frog.color !== frog.color), [frog.id, frog.color]));
    
    const canBeDragged = isPlayerFrog
        // If there is a queen and a servant on the same tile, only allow moving both
        && !otherFrogs.some(first => first.isQueen 
                && otherFrogs.some(second => first.id !== second.id && first.position!.x === second.position!.x  && first.position!.y === second.position!.y)
                && (frog.position!.x !== first.position!.x || frog.position!.y !== first.position!.y))       
        && !frog.hasMoved && !frog.mudded && !frog.stung && !otherFrogs.some(f => f.bouncing)
        && !otherFrogs.some(frog => frog.hasMoved);

    const onDropFrog = (move: Move) => {
        if (move) {
            play(move);
        }

        setSelectedFrog(undefined)
    }

    const onDrag = () => { 
        setSelectedFrog(frog)
    };

    const onSelectFrog = () => {
        if (!isPlayerFrog || !canBeDragged) {
            return;
        }


        if (!selectedFrog || frog.id !== selectedFrog.id) {
            return setSelectedFrog(frog)
        }

        return setSelectedFrog(undefined);
    }

    const getAnimation = () => {
        if (animation) {
            return 'jumping_front';
        }

        return 'blinking';
    }

    const getAnimationBackground = (animationId: string) => (frog.isQueen? queenFrogAnimations: servantFrogAnimations).get(frog.color)!.get(animationId);
    
    return (
        <Draggable { ...props } preTransform={ preTransform } draggable={ playerId === frog.color } onClick={ onSelectFrog } begin={ onDrag } canDrag={ () => activePlayer && canBeDragged } css={[frogMiniContainer(frog), canBeDragged && selectableFrog, (isOtherFrogDragging || activePlayer !== playerId) && pointEvents, frog.mudded && muddedFrog(preTransform), ]} item={ frogFromBoard(frog) } drop={ onDropFrog } end={ () => setSelectedFrog(undefined) }>
            <div css={[frogMiniImage(frog, getAnimation(), "blinking", ), frogMiniAnimation("blinking", 1)]} style={{ backgroundImage: `url(${getAnimationBackground('blinking')})`}} />
            <div css={[frogMiniImage(frog, getAnimation(), "jumping_front"), animation && frogMiniAnimation("jumping_front", 1)]} style={{ backgroundImage: `url(${getAnimationBackground('jumping_front')})`}}  />
            <div css={[frogMiniImage(frog, getAnimation(), "jumping_back"), animation && frogMiniAnimation("jumping_back", 1)]} style={{ backgroundImage: `url(${getAnimationBackground('jumping_back')})`}}  />
        </Draggable>
    );
}

const pointEvents = css`
    pointer-events: none;
`

const muddedFrog = (preTransform?: string) => css`
    transform: ${preTransform} translate(0, 0.7em) rotateZ(-130deg);
`

const selectableFrogAnimation = keyframes`
    from {
        filter: drop-shadow(0em 0.2em 0.2em black) drop-shadow(0 0 0.1em gold)
    }
    to {
        filter: drop-shadow(0em 0.2em 0.2em black) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold) drop-shadow(0 0 0.1em gold)
    }
`

const selectableFrog = css`
    animation: ${selectableFrogAnimation} 1s ease-in-out infinite alternate;
`



/*const frogDisparitionAnimation = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`;*/

/*const frogDisparition = (duration: number) => css`
    animation: ${frogDisparitionAnimation} ${duration}s ease-in-out;
`*/



export {
    FrogMini
};