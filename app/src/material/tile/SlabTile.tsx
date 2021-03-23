import { Slab } from "@gamepark/croa/pond";
import { moveFrog } from "@gamepark/croa/moves/MoveFrog"
import { useAnimation, useDisplayState, usePlay, usePlayerId } from "@gamepark/react-client";
import { FunctionComponent } from "react";
import './SlabTile.css';
import { FrogFromBoard, DragObjectType } from "../../drag-objects";
import { FemaleFrog } from "@gamepark/croa/frog";
import { PlayerColor } from "@gamepark/croa/player";
import { SlabFrontType } from "@gamepark/croa/pond/SlabFrontType";
import { Position } from "@gamepark/croa/common/Position";
import { useDrop } from "react-dnd";
import { Images } from "../Resources";
import { css, keyframes } from "@emotion/react";
import { SlabBackType } from "@gamepark/croa/pond/SlabBackType";
import { isRevealSlab, RevealSlabView } from "@gamepark/croa/moves/RevealSlab";
import { isAllowedMove } from "@gamepark/croa/utils/FrogUtils";

type SlabTileProps = {
    slab: Slab;
    position: Position;
    visualPosition: Position;
    frogs: Array<FemaleFrog>;
    boardSize: number;
}

const SlabTile: FunctionComponent<SlabTileProps> = ({ slab, position, visualPosition, frogs, boardSize }) => {
    const [selectedFrog, setSelectedFrog] = useDisplayState<FemaleFrog | undefined>(undefined);
    const play = usePlay();
    const playerId = usePlayerId<PlayerColor>();
    const animation = useAnimation<RevealSlabView>(animation => 
        isRevealSlab(animation.move) && animation.move.slabPosition.x === position.x && animation.move.slabPosition.y === position.y
    )

    const isValidSlab = () => {
        return selectedFrog && canBeDropped(selectedFrog, frogs);
    }

    const isInvalidSlab = () => {
        return selectedFrog && isAdjcentSlab(selectedFrog) && !canBeDropped(selectedFrog, frogs);
    }

    /**
     * Does the current tile the previous tile if the from is a boucing frog
     * @param frog Selected frog
     */
    const isBouncingFrogPreviousTile = (frog: FemaleFrog) => {
        return frog.bouncing && frog.previousPosition && frog.previousPosition.x === position.x && frog.previousPosition.y === position.y
    }

    /**
     * Does the current tile an adjacent one to the given frog
     * @param frog The frog where tiles needs to be compared
     */
    const isAdjcentSlab = (frog: FemaleFrog) => {
        const deltaX = Math.abs(position.x - frog.position!.x);
        const deltaY = Math.abs(position.y - frog.position!.y);
        return (deltaY <= 1 && deltaX <= 1 && (deltaX !== 0 || deltaY !== 0))
    };

    const getAdditionnalTranslate = () => visualPosition.y === boardSize - 1? 'translateY(-60%)': visualPosition.y === 0? 'translateY(50%)': '';
    
    /**
     * Frog can be dropped only if the slab is not empty or a log is on the slab
     * @param slab The target slab
     */
    const canBeDropped = (frog: FemaleFrog, frogs: Array<FemaleFrog>): boolean => {
        if (!playerId || !frog.position) {
            return false;
        }
            
        let allowedMove = isAdjcentSlab(frog);;
        if (frog.bouncing) {
            allowedMove = allowedMove && !isBouncingFrogPreviousTile(frog)
        }

        return allowedMove && isAllowedMove(frogs, frog, { x: position.x - frog.position.x, y: position.y - frog.position.y }, slab, boardSize);
    };

    const [, ref] = useDrop({
        accept: DragObjectType.FROG_FROM_BOARD,
        canDrop: (item: FrogFromBoard) => canBeDropped(selectedFrog || item.frog, frogs),
        drop: (item: FrogFromBoard) => moveFrog(item.frog, position)
    });

    const onTileClick = () => {
        if (selectedFrog && canBeDropped(selectedFrog, frogs)) {
            setSelectedFrog(undefined)
            return play(moveFrog(selectedFrog, position));
        }
    }
    
    return (
        <div ref={ ref } onClick={ onTileClick } className="slab" css={[animation && css`z-index: 2`]}>
            <div className={`slab-inner ${!animation && slab.displayed && 'slab-flipped' }`} css={animation && slabAnimation(animation.duration, getAdditionnalTranslate())} >
                <div css={[backAndFrontSlab, !slab.displayed && ((isValidSlab() && selectableSlab) || (isInvalidSlab() && unselectableSlab)) ]} style={{backgroundImage: `url(${backImages.get(slab.back)})`}}></div>
                { (slab.displayed || animation?.move.front) && <div css={[backAndFrontSlab, slab.displayed && ((isValidSlab() && selectableSlab) || (isInvalidSlab() && unselectableSlab)) ]} style={{ backgroundImage: `url(${frontImages.get(slab.front || animation?.move.front)})` }} className={`slab-front`}>
                    
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
    animation: ${scale(translate)} ${duration}s ease-in-out;
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
    box-shadow: 0 0.5em 0.7em black, 0px 0px 0.3em 0.4em gold inset;
`

const unselectableSlab = css`
    box-shadow: 0 0.5em 0.7em black, 0px 0px 0.3em 0.4em red inset;
`

const frontImages = new Map<SlabFrontType, any>();

frontImages.set(SlabFrontType.BLUE_MALE, Images.BlueMale);
frontImages.set(SlabFrontType.RED_MALE, Images.RedMale);
frontImages.set(SlabFrontType.YELLOW_MALE, Images.YellowMale);
frontImages.set(SlabFrontType.PINK_MALE, Images.PinkMale);
frontImages.set(SlabFrontType.PURPLE_MALE, Images.PurlpleMale);
frontImages.set(SlabFrontType.GREEN_MALE, Images.GreenMale);
frontImages.set(SlabFrontType.NENUPHAR, Images.Nenuphar);
frontImages.set(SlabFrontType.MOSKITO, Images.Moskito);
frontImages.set(SlabFrontType.MUD, Images.Mud);
frontImages.set(SlabFrontType.REED, Images.Reed);
frontImages.set(SlabFrontType.PIKE, Images.Pike);
frontImages.set(SlabFrontType.LOG, Images.Log);

const backImages = new Map<SlabBackType, any>();
backImages.set(SlabBackType.SHALLOW, Images.Shallow);
backImages.set(SlabBackType.DEEP, Images.Deep);

export {
    SlabTile
};