import { css, keyframes } from "@emotion/react";
import { FemaleFrog } from "@gamepark/croa/frog";
import { PlayerColor } from "@gamepark/croa/player";
import { useAnimation, useAnimations, useDisplayState, usePlay, usePlayerId } from "@gamepark/react-client";
import { Draggable } from "@gamepark/react-components";
import { FunctionComponent, useEffect } from "react";
import { frogMiniAnimation, frogMiniContainer, getAnimationBackground } from "../../utils/Styles";
import { frogFromBoard } from "../../drag-objects";
import { Position } from "@gamepark/croa/common/Position";
import { DraggableProps } from "@gamepark/react-components/dist/Draggable/Draggable";
import { EliminateFrog, isEliminateFrog, isMoveFrog, Move, MoveFrog } from "@gamepark/croa/moves";
import { FrogAnimation } from "./FrogAnimation";


type FrogMiniProps = {
    frog: FemaleFrog;
    otherFrogs: Array<FemaleFrog>;
    activePlayer?: PlayerColor;
    visualPosition?: Position;
    preTransform?: string;
} & Omit<DraggableProps<any, any, any>, 'item'>

const FrogMini: FunctionComponent<FrogMiniProps> = ({ frog, otherFrogs, activePlayer, visualPosition, preTransform, ...props }) => {
    const [selectedFrog, setSelectedFrog] = useDisplayState<number | undefined>(undefined);
    const playerId = usePlayerId();
    const play = usePlay();
    const animatingMove = useAnimation<MoveFrog>(animation => isMoveFrog(animation.move) && animation.move.frogId === frog.id && animation.move.playerId === frog.color)
    const animatingElimination = useAnimation<EliminateFrog>(animation => isEliminateFrog(animation.move) && animation.move.frogId === frog.id && animation.move.playerId === frog.color)
    const animating = useAnimations().length > 0;

    
    const isCurrentPlayerFrog = playerId && playerId === frog.color && playerId === activePlayer;
    const isSelected = selectedFrog && selectedFrog === frog.id && playerId === frog.color;    
    const canBeMoved = isCurrentPlayerFrog
        // If there is a queen and a servant on the same tile, only allow moving both
        && !otherFrogs.some(first => first.isQueen 
                && otherFrogs.some(second => first.id !== second.id && first.position!.x === second.position!.x  && first.position!.y === second.position!.y)
                && (frog.position!.x !== first.position!.x || frog.position!.y !== first.position!.y))       
        && !frog.mudded && !frog.stung && !otherFrogs.some(f => f.bouncing)
        && !otherFrogs.some(frog => frog.hasMoved);

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
        if (!isSelectable || !isCurrentPlayerFrog || !canBeMoved || animating) {
            return;
        }


        if (!selectedFrog || frog.id !== selectedFrog) {
            return setSelectedFrog(frog.id)
        }

        return setSelectedFrog(undefined);
    }

    const isMoveFrogAnimation = () => animatingMove && isMoveFrog(animatingMove.move)
    const isSelectable = canBeMoved && !isSelected && !isMoveFrogAnimation();
    const getAnimation = () => {
        if (isMoveFrogAnimation()) {
            return 'jumping_front';
        }

        return 'blinking';
    }

    const getAnimationImage = (animationId: string) => getAnimationBackground(frog.isQueen, frog.color, animationId);
    
    return (
        <Draggable { ...props } preTransform={ preTransform } draggable={ playerId === frog.color } onClick={ onSelectFrog } begin={ onDrag } canDrag={ () => activePlayer && canBeMoved } css={[frogMiniContainer(frog), isSelectable && selectableFrog, (activePlayer !== playerId) && pointEvents, frog.mudded && muddedFrog(preTransform), animatingElimination && frogDisparition(animatingElimination.duration)]} item={ frogFromBoard(frog) } drop={ onDropFrog } end={ onSelectFrog }>
            <FrogAnimation frog={ frog } animation="blinking" isActive={ getAnimation() === "blinking" } css={ frogMiniAnimation("blinking", 1)} style={{ backgroundImage: `url(${getAnimationImage('blinking')})`}} />
            <FrogAnimation frog={ frog } animation="jumping_front" isActive={ getAnimation() === "jumping_front" } css={ isMoveFrogAnimation() && frogMiniAnimation("jumping_front", 1) } style={{ backgroundImage: `url(${getAnimationImage('blinking')})`}} />
            { /* <div css={[frogMiniImage(frog, getAnimation() === "jumping_back", "jumping_back"), isMoveFrogAnimation() && frogMiniAnimation("jumping_back", 1)]} style={{ backgroundImage: `url(${getAnimationImage('jumping_back')})`}}  /> */}
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
        filter: drop-shadow(0 0 0.2em gold) drop-shadow(0 0 0.2em gold)
    }
    to {
        filter: drop-shadow(0 0 0.2em gold) drop-shadow(0 0 0.2em gold) drop-shadow(0 0 0.2em gold) drop-shadow(0 0 0.2em gold)
    }
`

const selectableFrog = css`
    animation: ${selectableFrogAnimation} 1s ease-in-out infinite alternate;
`



const frogDisparitionAnimation = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`;

const frogDisparition = (duration: number) => css`
    animation: ${frogDisparitionAnimation} ${duration}s ease-in-out;
`



export {
    FrogMini
};