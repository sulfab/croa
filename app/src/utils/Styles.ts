import { css } from '@emotion/react';
import { FemaleFrog } from '@gamepark/croa/frog';
import { PlayerColor } from '@gamepark/croa/player';

export const screenRatio = 16 / 9;

export const platformUri = process.env.REACT_APP_PLATFORM_URI ?? 'https://game-park.com'
export const discordUri = 'https://discord.gg/nMSDRag'

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

export const podiumRatio = screenRatio * rankingAreaWidth / rankingAreaHeight;
export const rankingRatio = podiumRatio * 22 / 125;


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
    -webkit-tap-highlight-color: transparent;
`

export const playerColors = new Map([
    [PlayerColor.Red, { rgb: { r: 228, g: 3, b: 48 }, hsl: { h: 348, s: 97.4, l: 45.3 }}],
    [PlayerColor.Blue, { rgb: { r: 0, g: 139, b: 210 }, hsl: { h: 200, s: 100, l: 41.2 }}],
    [PlayerColor.Green, { rgb: { r: 117, g: 181, b: 88 }, hsl: { h: 101, s: 38.6, l: 52.7 }}],
    [PlayerColor.Pink, { rgb: { r: 237, g: 111,b: 167 }, hsl: { h: 333, s: 77.8, l: 68.2 }}]
]);

export const playerColorsDark = new Map([
    [PlayerColor.Red, { rgb: { r: 148, g: 7, b: 35 }}],
    [PlayerColor.Blue, { rgb: { r: 7, g: 94, b: 138 }}],
    [PlayerColor.Green, { rgb: { r: 53, g: 118, b: 26 }}],
    [PlayerColor.Pink, { rgb: { r: 181, g: 48, b: 107 }}]
])

export const popupBackgroundStyle = css`
  position: fixed;
  top: -100%;
  bottom: -100%;
  left: -100%;
  right: -100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`

export const popupFixedBackgroundStyle = css`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`

export const popupOverlayStyle = css`
  position: absolute;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  transition: all .5s ease;
`
export const showPopupOverlayStyle = css`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`
export const hidePopupOverlayStyle = (boxTop: number, boxLeft: number) => css`
  top: ${boxTop}%;
  left: ${boxLeft}%;
  width: 0;
  height: 0;
  overflow: hidden;
`

export const popupStyle = css`
  position: absolute;
  text-align: center;
  max-height: 70%;
  z-index: 102;
  border-radius: 1em;
  box-sizing: border-box;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  outline: none;
  box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
  border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;

  &:hover {
    box-shadow: 2em 4em 5em -3em hsla(0, 0%, 0%, .5);
  }

  & > h2 {
    font-size: 5em;
    margin: 0;
    letter-spacing: 0.04em;
  }

  & > p {
    font-size: 4em;
    margin: 2% 0;
  }

  & > button {
    font-size: 4em;
  }
`

export const popupPosition = css`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const popupLightStyle = css`
  background-color: #e9e9e9;
  color: #082b2b;
  border: solid 1em #082b2b;
`

export const popupDarkStyle = css`
  background-color: #082b2b;
  color: #d4f7f7;
  border: solid 1em #d4f7f7;
`
export const closePopupStyle = css`
  position: relative;
  float: right;
  text-align: center;
  margin-top: -2%;
  margin-right: -0%;
  font-size: 4em;

  &:hover {
    cursor: pointer;
    color: #26d9d9;
  }
`

export const getFrogXPositionOnBoard = (frogX: number, boardSize: number, offset?: number) => (100 / boardSize * frogX) + (1 / boardSize * frogX) + (offset || 0);
export const getFrogYPositionOnBoard = (frogY: number, boardSize: number, offset?: number) => (100 / boardSize * frogY) + (1 / boardSize * frogY) + (offset || 0);
