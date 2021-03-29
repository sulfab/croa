import { css, keyframes } from '@emotion/react';
import { FemaleFrog, FrogStatus } from '@gamepark/croa/frog';
import { PlayerColor } from '@gamepark/croa/player';
import { useAnimation, useAnimations, useDisplayState, usePlay, usePlayerId } from '@gamepark/react-client';
import { Draggable } from '@gamepark/react-components';
import { FunctionComponent, useEffect } from 'react';
import { frogMiniContainer } from '../../utils/Styles';
import { frogFromBoard } from '../../drag-objects';
import { Position } from '@gamepark/croa/common/Position';
import { DraggableProps } from '@gamepark/react-components/dist/Draggable/Draggable';
import { EliminateFrog, eliminateFrogMove, isEliminateFrog, isMoveFrog, Move, MoveFrog } from '@gamepark/croa/moves';
import { FrogAnimation } from './FrogAnimation';


type FrogMiniProps = {
    frog: FemaleFrog;
    otherFrogs: Array<FemaleFrog>;
    targeted: boolean,
    activePlayer?: PlayerColor;
    visualPosition?: Position;
    preTransform?: string;
    horizontalOrientation: 'left'| 'right';
    verticalOrientation: 'top' | 'bottom';
} & Omit<DraggableProps<any, any, any>, 'item'>

const FrogMini: FunctionComponent<FrogMiniProps> = ({ frog, targeted, horizontalOrientation, verticalOrientation, otherFrogs, activePlayer, visualPosition, preTransform, ...props }) => {
    const [selectedFrog, setSelectedFrog] = useDisplayState<number | undefined>(undefined);
    const playerId = usePlayerId();
    const play = usePlay();
    const animatingMove = useAnimation<MoveFrog>(animation => isMoveFrog(animation.move) && animation.move.frogId === frog.id && animation.move.playerId === frog.color)
    const animatingElimination = useAnimation<EliminateFrog>(animation => isEliminateFrog(animation.move) && animation.move.frogId === frog.id && animation.move.playerId === frog.color)
    const animating = useAnimations().length > 0;
    const isCurrentPlayerFrog = playerId !== undefined && playerId === frog.color && playerId === activePlayer;
    const isSelected = selectedFrog && selectedFrog === frog.id && playerId === frog.color;    
    const canBeMoved = isCurrentPlayerFrog
        // If there is a queen and a servant on the same tile, only allow moving both
        && !otherFrogs.some(first => first.isQueen 
                && otherFrogs.some(second => first.id !== second.id && first.position!.x === second.position!.x  && first.position!.y === second.position!.y)
                && (frog.position!.x !== first.position!.x || frog.position!.y !== first.position!.y))       
        && ![FrogStatus.BOGGED, FrogStatus.STUNG, FrogStatus.MOVED].includes(frog.status) 
        && !otherFrogs.some(f => [FrogStatus.BOUNCING, FrogStatus.MOVED, FrogStatus.ELIMINATED].includes(f.status));

    // Detect change of frog between state and current frog
    // Unset the frog if it can't be moved
    useEffect(() => {
        if (isSelected && !canBeMoved) {
            setSelectedFrog(undefined);
        }
    }, [isSelected, canBeMoved, setSelectedFrog]);

    const onDropFrog = (move: Move) => {
        if (move) {
            play(move);
        }
    }

    const onDrag = () => { 
        setSelectedFrog(frog.id)
    };

    const onSelectFrog = () => {

        // In case the selected frog is a targeted one, trigger elimination
        if (targeted) {
            return play(eliminateFrogMove(frog));
        }

        if (!isCurrentPlayerFrog || !canBeMoved || animating) {
            return;
        }


        if (!selectedFrog || frog.id !== selectedFrog) {
            return setSelectedFrog(frog.id)
        }

        return setSelectedFrog(undefined);
    }

    const isMoveFrogAnimation = () => animatingMove && isMoveFrog(animatingMove.move)
    const isSelectable = canBeMoved && !isSelected && !isMoveFrogAnimation();
    const frogZIndex = ((visualPosition!.y + 1) * 10) + (visualPosition!.x + 1)
    const getAnimation = () => {
        if (isMoveFrogAnimation()) {
            return verticalOrientation === 'top' ? 'jumping_back': 'jumping_front';
        }

        return 'blinking';
    }
    
    
    return (
        <Draggable { ...props } 
                onClick={ onSelectFrog }         
                item={ frogFromBoard(frog) } 
                draggable={ playerId === frog.color } 
                canDrag={ () => activePlayer !== undefined && canBeMoved } 
                begin={ onDrag } 
                end={ onSelectFrog }
                drop={ onDropFrog } 
                preTransform={ `${preTransform}` } 
                css={[
                    frogMiniContainer(frog, frogZIndex),
                    isSelectable && selectableFrog,
                    frog.color !== playerId && !targeted && pointEvents,
                    FrogStatus.BOGGED === frog.status && boggedFrog(preTransform),
                    animatingElimination && frogDisappearance(animatingElimination.duration),
                    targeted && targetedFrog
                ]}>
            <FrogAnimation frog={ frog } animation="blinking" visible={ getAnimation() === "blinking" } duration={ 1 } delay={ Math.min(Math.abs(Math.tan(frog.color + frog.id * 2)), 3) } />
            <FrogAnimation frog={ frog } animation="jumping_front" visible={ getAnimation() === "jumping_front" } duration={ animatingMove && animatingMove.duration } css={ [css`transform: rotateY(${horizontalOrientation === 'left' ? 180: 0}deg)`] } />
            <FrogAnimation frog={ frog } animation="jumping_back" visible={ getAnimation() === "jumping_back" } duration={ animatingMove && animatingMove.duration } css={ [css`transform: rotateY(${horizontalOrientation  === 'left' ? 180: 0}deg)`] } />
        </Draggable>
    );
}

const pointEvents = css`
    pointer-events: none;
`;

const boggedFrog = (preTransform?: string) => css`
    transform: ${preTransform} translate(0, 0.7em) rotateZ(-130deg);
`;

const selectableFrogAnimation = keyframes`
    from {
        filter: drop-shadow(0 0 0.2em gold) drop-shadow(0 0 0.2em gold)
    }
    to {
        filter: drop-shadow(0 0 0.2em gold) drop-shadow(0 0 0.2em gold) drop-shadow(0 0 0.2em gold) drop-shadow(0 0 0.2em gold)
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
    animation: ${frogDisappearanceAnimation} ${duration}s ease-in-out;
`



export {
    FrogMini
};