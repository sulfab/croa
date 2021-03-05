import { Slab } from "@gamepark/croa/pond";
import { SlabTile } from '../tile/SlabTile';
import { FunctionComponent, useMemo } from "react"
import { FemaleFrog } from "@gamepark/croa/frog";
import { FrogMini } from "../frog/FrogMini";
import { PlayerColor, FrogPlacement } from "@gamepark/croa/player";
import { css } from "@emotion/react";
import { boardGap, getFrogXPositionOnBoard, getFrogYPositionOnBoard, frogOffset, servantHeight, servantWidth, queenHeight, queenWidth, boardWidth } from '../../utils/Styles';
import { Position } from "@gamepark/croa/common/Position";
import { FrogBirth, isFrogBirth, MoveFrog, isMoveFrog } from "@gamepark/croa/moves";
import { useAnimation } from "@gamepark/react-client";

type BoardProps = {
    pond: Slab[][];
    frogs: Array<FemaleFrog>;
    activePlayer?: PlayerColor;
    playerIndex: number;
    playerCount: number;
}

const toPositions = (pond: Slab[][]): Position[][] => pond.map((row, x) => row.map((_, y) => ({ x, y })));
const rotate = (matrix: Position[][], times: number): Position[][]   => { 
    for(let count = 0; count < times; count++) {
        const n = matrix.length;
        const x = Math.floor(n/ 2);
        const y = n - 1;
        for (let i = 0; i < x; i++) {
           for (let j = i; j < y - i; j++) {
              let k = matrix[i][j];
              matrix[i][j] = matrix[y - j][i];
              matrix[y - j][i] = matrix[y - i][y - j];
              matrix[y - i][y - j] = matrix[j][y - i]
              matrix[j][y - i] = k
           }
        }
    }
    return matrix;
  }

const Board: FunctionComponent<BoardProps> = ({ playerIndex, playerCount, pond, frogs, activePlayer }) => { 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const orientedSlabPositions = useMemo(() => rotate(toPositions(pond), FrogPlacement[playerCount][playerIndex].currentPlayerRotation), [playerCount, playerIndex]); 
    const animation = useAnimation<MoveFrog | FrogBirth>(animation => isMoveFrog(animation.move) || isFrogBirth(animation.move));
    const otherFrogsOnSlab = (position: Position, frogId?: number) => frogs.filter(f => f.position && f.position.x === position?.x && f.position.y === position?.y && (!frogId || frogId !== f.id))

    
    const getVisualPosition = (position: Position): Position | undefined => {
        let visualPosition;
        orientedSlabPositions.forEach((row, rowIndex) => 
            row.forEach((slab, columnIndex) => {
                if (slab.x === position!.x && slab.y === position!.y) {
                    visualPosition = { x: rowIndex, y: columnIndex}
                }
            })
        );

        return visualPosition;
    }

    const isFrogAnimation = (frog: FemaleFrog) => animation && isMoveFrog(animation.move) && animation.move.playerId === frog.color && animation.move.frogId === frog.id;
    const getFrogTranslation = (frog: FemaleFrog) => {
        if (isFrogAnimation(frog) && isMoveFrog(animation!.move)) {
            return translateFrog(frog, animation!.move.slabPosition!);
        }

        return translateFrog(frog, frog.position!)
    }

    const translateFrog = (frog: FemaleFrog, position: Position) => {
        if (position) {
            const visualPosition = getVisualPosition(position);
            const otherFrogOnTarget =  otherFrogsOnSlab(position, frog.id);
            const offset = frogOffset(frog, otherFrogOnTarget);
            return `translate(${ getFrogXPositionOnBoard(visualPosition?.x!, pond.length, offset.left) * 100 / (frog.isQueen? queenWidth: servantWidth) }%, ${ getFrogYPositionOnBoard(visualPosition?.y!, pond.length, offset.top) * 100 / (frog.isQueen? queenHeight: servantHeight)}%)`
        }

        return undefined;
    } 

    const renderFrog = (frog: FemaleFrog) => {
        const visualPosition = getVisualPosition(frog.position!);
        if (!visualPosition) {
            return null;
        }

        return <FrogMini key={ 'frog-' + frog.color + '-' + frog.id }
                         activePlayer={ activePlayer }
                         frog={ frog }
                         otherFrogs={ frogs.filter(f => f.color === activePlayer && f.id !== frog.id && !!f.position) }
                         visualPosition={ visualPosition }
                         css={ animation && isFrogAnimation(frog) && css`transition-duration: ${animation.duration * 0.4}s; transition-delay: ${animation.duration * 0.2}s`}
                         preTransform={ getFrogTranslation(frog) } />
    }

    return (
        <div css={boardStyle(pond.length)}>
            { frogs.filter(frog => !!frog.position).map(renderFrog) }
            { orientedSlabPositions.map((pondRow, x) => pondRow.map((slab, y) => 
                <SlabTile key={ `slab-${x}-${y}` } slab={ pond[slab.x][slab.y] } frogs={ frogs } position={{x: slab.x, y: slab.y}} visualPosition={{x, y}} boardSize={ pond.length } /> ))}
        </div>
    );
}

const boardStyle = (columns: number) => css`
    z-index: 1;
    transform: rotateX(10deg);
    position: relative;
    display: grid;
    height: 90%;
    width: ${ boardWidth }%;
    grid-template-columns: repeat(${ columns }, 1fr); 
    grid-template-rows: repeat(${ columns }, 1fr);
    grid-auto-flow: column;
    gap: ${ boardGap }%;
`
export {
    Board
};