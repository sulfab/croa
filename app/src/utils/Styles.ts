import { css, keyframes } from "@emotion/react";
import { FemaleFrog } from "@gamepark/croa/frog";
import { PlayerColor } from "@gamepark/croa/player";
import { Images } from "../material/Resources";

export const screenRatio = 16 / 9;

export const boardGap = 1;
export const boardHeight = 90;
export const boardWidthReduction = 1.06;
export const boardWidth = 90 / screenRatio * boardWidthReduction;

export const playerWidth = (100 - 90 / screenRatio) / 2 - 5.5;

export const playerBoardWidth = playerWidth * 100 / boardWidth;
export const playerBoardHeight = 22 * 100 / boardHeight;

export const servantMiniRatio = 85 / 88;
export const servantHeight = 7;
export const servantWidth = servantHeight * servantMiniRatio / boardWidthReduction; 
export const servantJumpBlinkHeightRatio = 375 / 88;
export const servantJumpBlinkWidthRatio = 115 / 85;


export const queenMiniRatio = 140 / 150;
export const queenHeight = 10;
export const queenWidth = queenHeight * queenMiniRatio / boardWidthReduction;
export const queenJumpBlinkHeightRatio = 432 / 150;
export const queenJumpBlinkWidthRatio = 183 / 140;


export const playerBoardRatio = playerBoardWidth / playerBoardHeight;

export const playerBoardMaleTokensHeight = 5 * 100 / playerBoardHeight;
export const playerBoardMaleTokensWidth = playerBoardMaleTokensHeight / playerBoardRatio;

export const playerBoardQueenHeight = queenHeight * 100 / playerBoardHeight;
export const playerBoardQueenWidth = playerBoardQueenHeight / playerBoardRatio;

export const playerBoardServantHeight = servantHeight * 100 / playerBoardHeight;
export const playerBoardServantWidth = playerBoardServantHeight / playerBoardRatio;

export const playerBoardServantsAreaHeight = 40;
export const playerBoardServantsAreaWidth = 60;



export const getFrogLeft = (frog: FemaleFrog) => {
    const baseLeft = 4;

    if (frog.isQueen) {
        return baseLeft;
    }

    return baseLeft + 4 + (playerBoardQueenWidth / playerBoardRatio) + (playerBoardServantWidth / playerBoardRatio + baseLeft - 6) * (frog.id - 1);
} 

export const frogOffset = (frog: FemaleFrog, otherFrogs?: Array<FemaleFrog>) => {
    

    if (frog.isQueen) {
        return { top: -5, left: 0 };
    }

    if (!otherFrogs || !otherFrogs.length) {
        return { top: -2, left: 0 };
    }

    if (otherFrogs && otherFrogs.length) {
        switch(otherFrogs.length) {
            case 1:
                const otherFrog = otherFrogs[0];
                return otherFrog.id > frog.id? { top: -2, left: 0 }: { top: 4.5, left: 5.5 };
            case 2:
                const otherServant = otherFrogs.filter(f => !f.isQueen)[0];
                if (otherServant) {
                    return otherServant.id > frog.id? { top: 4.5, left: 5.5 } :  { top: 4.5, left: 3.5 }
                }

        }
        
    }

    return { top: 0, left: 0 };    
};
const frogBlinkingKeyframe = keyframes`
    from { background-position: 0%; }
    to { background-position: -1600%; }  /* <-- width of spritesheet*/
`;

const frogJumpingKeyframe = keyframes`
    from { background-position: 0%; }
    to { background-position: -1600%; }  /* <-- width of spritesheet*/
`;

export const frogMiniContainer = (frog: FemaleFrog) => css`
    height: ${(frog.isQueen? queenHeight : servantHeight)}%;
    width: ${frog.isQueen? queenWidth: servantWidth}%;
    position: absolute;
    z-index: 1;
`

export const getAnimationKeyFrame = (animationId?: string) => {
    return animationId !== 'blinking'? frogJumpingKeyframe: frogBlinkingKeyframe;
    
}

const computeAnimationHeight = (frog: FemaleFrog, animationId?: string) => {
    if (animationId && animationId !== 'blinking') {
        return 100 * (frog.isQueen? queenJumpBlinkHeightRatio: servantJumpBlinkHeightRatio)
    }

    return 100;
}

const computeAnimationWidth = (frog: FemaleFrog, animationId?: string) => {
    if (animationId && animationId !== 'blinking') {
        return 100 * (frog.isQueen? queenJumpBlinkWidthRatio: servantJumpBlinkWidthRatio)
    }

    return 100;
}

const computeAnimationLeft = (frog: FemaleFrog, animationId?: string) => {
    if (animationId && animationId !== 'blinking') {
        return -((computeAnimationWidth(frog, animationId) - 100) / 2 + 1);
    }

    return 0;
}

export const frogMiniImage = (frog: FemaleFrog, animationId: string = "blinking", isActive?: boolean) => css`
    position: absolute;
    bottom:  0%;
    left: ${computeAnimationLeft(frog, animationId)}%;
    height: ${isActive? computeAnimationHeight(frog, animationId): 0}%;
    width: ${isActive? computeAnimationWidth(frog, animationId): 0}%;
    background-size: 1600% 100%;
    transition-property: transform;
    margin: 0 auto;    
    image-rendering: -webkit-optimize-contrast;
    filter: drop-shadow(0em 0.2em 0.2em black);
`;

export const getAnimationBackground = (isQueen: boolean, color: PlayerColor, animationId: string) => (isQueen? queenFrogAnimations: servantFrogAnimations).get(color)!.get(animationId);

export const frogMiniAnimation = (animationId?: string, animationDuration?: number, animationDelay?: number) => css`
    animation: ${getAnimationKeyFrame(animationId)} ${(animationDuration && animationDuration) || 1}s steps(16) ${animationDelay || 0}s ${animationId === 'blinking'? 'infinite': 1};
`

export const queenFrogAnimations = new Map([
    [PlayerColor.Red, new Map([
        ['blinking', Images.RedQueenBlinking],
        ['jumping_front', Images.RedQueenJumpingFront],
        ['jumping_back', Images.RedQueenJumpingBack],
    ])],
    [PlayerColor.Blue, new Map([
        ['blinking', Images.BlueQueenBlinking],
        ['jumping_front', Images.BlueQueenJumpingFront],
        ['jumping_back', Images.BlueQueenJumpingBack],
    ])],
    [PlayerColor.Green, new Map([
        ['blinking', Images.GreenQueenBlinking],
        ['jumping_front', Images.GreenQueenJumpingFront],
        ['jumping_back', Images.GreenQueenJumpingBack],
    ])],
    [PlayerColor.Pink, new Map([
        ['blinking', Images.PinkQueenBlinking],
        ['jumping_front', Images.PinkQueenJumpingFront],
        ['jumping_back', Images.PinkQueenJumpingBack],
    ])],
])

export const servantFrogAnimations = new Map([
    [PlayerColor.Red, new Map([
        ['blinking', Images.RedServantBlinking],
        ['jumping_front', Images.RedServantJumpingFront],
        ['jumping_back', Images.RedServantJumpingBack],
    ])],
    [PlayerColor.Blue, new Map([
        ['blinking', Images.BlueServantBlinking],
        ['jumping_front', Images.BlueServantJumpingFront],
        ['jumping_back', Images.BlueServantJumpingBack],
    ])],
    [PlayerColor.Green, new Map([
        ['blinking', Images.GreenServantBlinking],
        ['jumping_front', Images.GreenServantJumpingFront],
        ['jumping_back', Images.GreenServantJumpingBack],
    ])],
    [PlayerColor.Pink, new Map([
        ['blinking', Images.PinkServantBlinking],
        ['jumping_front', Images.PinkServantJumpingFront],
        ['jumping_back', Images.PinkServantJumpingBack],
    ])],
])

export const playerColors = new Map([
    [PlayerColor.Red, { rgb: { r: 228, g: 3, b: 48 }, hsl: { h: 348, s: 97.4, l: 45.3 }}],
    [PlayerColor.Blue, { rgb: { r: 0, g: 139, b: 210 }, hsl: { h: 200, s: 100, l: 41.2 }}],
    [PlayerColor.Green, { rgb: { r: 117, g: 181, b: 88 }, hsl: { h: 101, s: 38.6, l: 52.7 }}],
    [PlayerColor.Pink, { rgb: { r: 237, g: 111,b: 167 }, hsl: { h: 333, s: 77.8, l: 68.2 }}]
]);

export const getFrogXPositionOnBoard = (frogX: number, boardSize: number, offset: number) => (100 / boardSize * frogX) + (1 / boardSize * frogX) + offset;
export const getFrogYPositionOnBoard = (frogY: number, boardSize: number, offset: number) => (100 / boardSize * frogY) + (1 / boardSize * frogY) + offset;
