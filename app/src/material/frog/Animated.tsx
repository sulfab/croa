import { css, keyframes } from '@emotion/react';
import { PlayerColor } from '@gamepark/croa/player';
import { FC, HTMLAttributes } from 'react'

type AnimatedProps = {
    animation: string;
    image: string;
    duration?: number;
    delay?: number;
    visible?: boolean;
    color?: PlayerColor;
    frame: number;
    loop?: boolean;
}  & Omit<HTMLAttributes<HTMLDivElement>, 'color'>


const Animated: FC<AnimatedProps> = ({ animation, image, frame, visible, duration, delay, loop, color, ...props }) => {

    const delayPercentage = (!delay || !duration)? 0: delay / (delay + duration) * 100;
    return (
        <div { ...props } css={ [container(frame, visible), duration && getAnimation(frame, duration, delay, delayPercentage, loop) ]} style={{ backgroundImage: `url(${image})` }} />
    );
};


const animationKeyFrame = (frame: number, delayPercentage?: number) => keyframes`
    0% { background-position: 0; }
    ${delayPercentage? `${delayPercentage}% { background-position: 0; }`: ''}
    100% { 
        background-position: -${frame * 100}%;
    }
`

const container = (frame: number, visible?: boolean) => css`
    position: absolute;
    bottom:  0;
    background-size: ${frame * 100}% 100%;
    ${ !visible? `height: 0% !important;`: '' };
    ${ !visible? `width: 0% !important;`: '' };
`

const getAnimation = (frames: number, duration?: number, delay?: number, delayPercentage?: number, loop?: boolean) => css`
    animation: ${animationKeyFrame(frames, delayPercentage)} ${ (delay || 0) + (duration || 0) }s steps(${frames}) ${loop ? 'infinite': 1};
`
export {
    Animated
};