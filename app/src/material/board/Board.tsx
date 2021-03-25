import { Slab } from "@gamepark/croa/pond";
import { SlabTile } from '../tile/SlabTile';
import { FunctionComponent, useEffect, useMemo, useState } from "react"
import { FemaleFrog, FrogStatus } from "@gamepark/croa/frog";
import { FrogMini } from "../frog/FrogMini";
import { PlayerColor, FrogPlacement } from "@gamepark/croa/player";
import { css } from "@emotion/react";
import { boardGap, getFrogXPositionOnBoard, getFrogYPositionOnBoard, frogOffset, servantHeight, servantWidth, queenHeight, queenWidth, boardWidth } from '../../utils/Styles';
import { Position } from "@gamepark/croa/common/Position";
import { FrogBirth, isFrogBirth, MoveFrog, isMoveFrog, RevealSlab, isRevealSlab } from "@gamepark/croa/moves";
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
    const animation = useAnimation<MoveFrog | FrogBirth | RevealSlab>(animation => isMoveFrog(animation.move) || isFrogBirth(animation.move) || isRevealSlab(animation.move));
    const [frogPositions, setFrogPositions] = useState<{ [key in PlayerColor]?: { [key: number]: { index: number, position: Position, eliminated?: boolean} }}>({});

    useEffect(() => {
        const newFrogPositions: { [key in PlayerColor]?: { [key: number]: { index: number, position: Position, eliminated?: boolean } }} = {};
        const frogToPlace: Array<FemaleFrog> = [];
        frogs.forEach(frog => {
            if (!newFrogPositions[frog.color]) {
                newFrogPositions[frog.color] = {};
            }

            const frogPosition = frogPositions && frogPositions[frog.color] && frogPositions[frog.color]![frog.id];
            const newFrogPosition = animation && isMoveFrog(animation.move) && animation.move.frogId === frog.id && animation.move.playerId === frog.color? animation.move.slabPosition: frog.position;
            if (newFrogPosition && frogPosition && newFrogPosition!.x === frogPosition.position.x && newFrogPosition!.y === frogPosition.position.y) {
                newFrogPositions[frog.color]![frog.id] = { index: frogPosition.index, position: newFrogPosition, eliminated: FrogStatus.ELIMINATED === frog.status };
            } else {
                frogToPlace.push(frog)
            }
        })

        frogToPlace.forEach(frog => {
            const newFrogPosition = animation && isMoveFrog(animation.move) && animation.move.frogId === frog.id && animation.move.playerId === frog.color? animation.move.slabPosition: frog.position;
            const positions = Object.values(newFrogPositions || {})
                    .flatMap(player => Object.values(player || []))
                    .filter(o => o.position.x === newFrogPosition!.x && o.position.y === newFrogPosition!.y && FrogStatus.ELIMINATED !== frog.status)
                    .map(o => o.index);
            
            newFrogPositions[frog.color]![frog.id] = { position: newFrogPosition!, index: [0, 1, 2].filter(i => !positions.includes(i))[0], eliminated: FrogStatus.ELIMINATED === frog.status };
        })

        setFrogPositions(newFrogPositions)
    // eslint-disable-next-line
    }, [frogs, animation && animation.move])
    
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

    const frogVerticalOrientation = (frog: FemaleFrog) => {
        if (animation && isFrogAnimation(frog) && isMoveFrog(animation!.move)) {
            const visualPosition = getVisualPosition(frog.position!);
            const newVisualPosition = getVisualPosition(animation.move.slabPosition!);
            const actualY = visualPosition?.y!;
            const newY = newVisualPosition?.y!;
            return newY < actualY ? 'top': 'bottom';
        }

        return 'bottom';
    }

    const frogHorizontalOrientation = (frog: FemaleFrog) => {
        if (animation && isFrogAnimation(frog) && isMoveFrog(animation!.move)) {
            const visualPosition = getVisualPosition(frog.position!);
            const newVisualPosition = getVisualPosition(animation.move.slabPosition!);
            const actualX = visualPosition?.x!;
            const newX = newVisualPosition?.x!;
            return newX < actualX ? 'left': 'right';
        }

        return 'right';
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
            const offset = frogOffset(frogPositions[frog.color]![frog.id].index, frog);
            return `translate(${ getFrogXPositionOnBoard(visualPosition?.x!, pond.length, offset!.left) * 100 / (frog.isQueen? queenWidth: servantWidth) }%, ${ getFrogYPositionOnBoard(visualPosition?.y!, pond.length, offset!.top) * 100 / (frog.isQueen? queenHeight: servantHeight)}%)`
        }

        return undefined;
    } 

    const renderFrog = (frog: FemaleFrog) => {
        const visualPosition = getVisualPosition(frog.position!);
        const frogIndex = frogPositions[frog.color] && frogPositions[frog.color]![frog.id];
        if (!visualPosition || frogIndex === undefined) {
            return null;
        }

        return <FrogMini key={ 'frog-' + frog.color + '-' + frog.id }
                         activePlayer={ activePlayer }
                         frog={ frog }
                         otherFrogs={ frogs.filter(f => f.color === activePlayer && f.id !== frog.id && !!f.position) }
                         visualPosition={ visualPosition }
                         horizontalOrientation={ frogHorizontalOrientation(frog) }
                         verticalOrientation={ frogVerticalOrientation(frog) }
                         css={[isFrogAnimation(frog) && translateFrogAnimation(animation!)]}
                         preTransform={ getFrogTranslation(frog) } />
    }

    return (
        <div css={boardStyle(pond.length)}>
            { frogs.filter(frog => !!frog.position).map(renderFrog) }
            { orientedSlabPositions.map((pondRow, x) => pondRow.map((slab, y) => 
                <SlabTile   key={ `slab-${x}-${y}` } 
                            slab={ pond[slab.x][slab.y] } 
                            frogs={ frogs } position={{x: slab.x, y: slab.y}} 
                            visualPosition={{x, y}} 
                            boardSize={ pond.length }
                            activePlayer={ activePlayer } /> ))}
        </div>
    );
}

const translateFrogAnimation = (animation: any) => css`
    transition-duration: ${animation!.duration}s;
`;

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
`;

export {
    Board
};