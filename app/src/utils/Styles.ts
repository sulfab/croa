import { css } from '@emotion/react';
import { FemaleFrog } from '@gamepark/croa/frog';
import { PlayerColor } from '@gamepark/croa/player';

export const screenRatio = 16 / 9;

export const boardGap = 1;
export const boardHeight = 90;
export const boardWidthReduction = 1.06;
export const boardWidth = boardHeight / screenRatio * boardWidthReduction;

export const playerWidth = (100 - 90 / screenRatio) / 2 - 5.5;

export const playerBoardWidth = playerWidth * 100 / boardWidth;
export const playerBoardHeight = 22 * 100 / boardHeight;

export const servantMiniRatio = 90 / 100;
export const servantHeight = 7;
export const servantWidth = servantHeight * servantMiniRatio / boardWidthReduction; 
export const servantJumpBlinkHeightRatio = 390 / 100;
export const servantJumpBlinkWidthRatio = 120 / 90;


export const queenMiniRatio = 150 / 175;
export const queenHeight = 10;
export const queenWidth = queenHeight * queenMiniRatio / boardWidthReduction;
export const queenJumpBlinkHeightRatio = 450 / 175;
export const queenJumpBlinkWidthRatio = 190 / 150;


export const playerBoardRatio = playerBoardWidth / playerBoardHeight;

export const playerBoardMaleTokensHeight = 5 * 100 / playerBoardHeight;
export const playerBoardMaleTokensWidth = playerBoardMaleTokensHeight / playerBoardRatio;

export const playerBoardQueenHeight = queenHeight * 100 / playerBoardHeight;
export const playerBoardQueenWidth = playerBoardQueenHeight / playerBoardRatio;

export const playerBoardServantHeight = servantHeight * 100 / playerBoardHeight;
export const playerBoardServantWidth = playerBoardServantHeight / playerBoardRatio;

export const playerBoardServantsAreaHeight = 40;
export const playerBoardServantsAreaWidth = 60;

export const rankingAreaHeight = 35;
export const rankingAreaWidth = 35;
export const frogOffset = (frogIndex: number, frog: FemaleFrog) => {
    
    switch(frogIndex) {
        case 0:
            return frog.isQueen? { top: -5, left: -0.5}: { top: -2.5, left: 0 };
        case 1:
            return frog.isQueen? { top: 2.5, left: 4.5 } : { top: 5, left: 6 };
        case 2:
            return frog.isQueen? { top: 2.5, left: 3.5 } : { top: 5, left: 3.5 };
        default:
            return;
    }  
};

export const frogMiniContainer = (frog: FemaleFrog, zIndex: number) => css`
    height: ${(frog.isQueen? queenHeight : servantHeight)}%;
    width: ${frog.isQueen? queenWidth: servantWidth}%;
    position: absolute;
    z-index: ${zIndex}; 
`

export const playerColors = new Map([
    [PlayerColor.Red, { rgb: { r: 228, g: 3, b: 48 }, hsl: { h: 348, s: 97.4, l: 45.3 }}],
    [PlayerColor.Blue, { rgb: { r: 0, g: 139, b: 210 }, hsl: { h: 200, s: 100, l: 41.2 }}],
    [PlayerColor.Green, { rgb: { r: 117, g: 181, b: 88 }, hsl: { h: 101, s: 38.6, l: 52.7 }}],
    [PlayerColor.Pink, { rgb: { r: 237, g: 111,b: 167 }, hsl: { h: 333, s: 77.8, l: 68.2 }}]
]);

export const getFrogXPositionOnBoard = (frogX: number, boardSize: number, offset: number) => (100 / boardSize * frogX) + (1 / boardSize * frogX) + offset;
export const getFrogYPositionOnBoard = (frogY: number, boardSize: number, offset: number) => (100 / boardSize * frogY) + (1 / boardSize * frogY) + offset;
