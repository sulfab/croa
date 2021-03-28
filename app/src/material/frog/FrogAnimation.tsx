import { css } from '@emotion/react';
import { FemaleFrog } from '@gamepark/croa/frog';
import { PlayerColor } from '@gamepark/croa/player';
import { FC, HTMLAttributes } from 'react'
import { queenJumpBlinkHeightRatio, queenJumpBlinkWidthRatio, servantJumpBlinkHeightRatio, servantJumpBlinkWidthRatio } from '../../utils/Styles';
import { Images } from '../Resources';
import { Animated } from './Animated';

type AnimatedFrogProps = {
    frog: FemaleFrog,
    animation: string;
    duration?: number;
    delay?: number;
    visible?: boolean;
    color?: PlayerColor;
    loop?: boolean;
}  & Omit<HTMLAttributes<HTMLDivElement>, 'color'>


const FrogAnimation: FC<AnimatedFrogProps> = ({ frog, animation, visible, duration, delay, loop, color, ...props }) => {

    return (
        <Animated { ...props }  
            animation={ animation } 
            frame={ animation !== 'blinking'? 24: 16 } 
            css={ frogMiniImage(frog, animation) }
            visible={ visible } 
            image={ getAnimationBackground(frog.isQueen, color || frog.color, animation)! } 
            loop={ loop || animation  === 'blinking' } 
            duration={ duration } 
            delay={ delay || 0 } />
        /*{ /* <div { ...props } key={ frog.id } css={ [frogMiniImage(frog, animation, !!visible), duration && frogMiniAnimation(animation, duration, delay, loop) ]} style={{ backgroundImage: `url(${})`}} /> }*/
    );
};

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
        return -((computeAnimationWidth(frog, animationId) - 100) / 2);
    }

    return 0;
}

export const frogMiniImage = (frog: FemaleFrog, animationId: string = "blinking") => css`
    position: absolute;
    bottom:  0;
    left: ${computeAnimationLeft(frog, animationId)}%;
    height: ${computeAnimationHeight(frog, animationId)}%;
    width: ${computeAnimationWidth(frog, animationId)}%;
    transition-property: transform;
    margin: 0 auto;    
    image-rendering: -webkit-optimize-contrast;
    filter: drop-shadow(0em 0.2em 0.2em black);
`;

export const getAnimationBackground = (isQueen: boolean, color: PlayerColor, animationId: string) => (isQueen? queenFrogAnimations: servantFrogAnimations).get(color)!.get(animationId);

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

export {
    FrogAnimation
};