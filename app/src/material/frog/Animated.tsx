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

    return (
        <div { ...props } css={ [container(frame, visible), duration && getAnimation(frame, duration, delay, loop) ]} style={{ backgroundImage: `url(${image})` }} />
    );
};

const animationKeyFrame = (frames: number) => keyframes`
    from { 
        background-position: 0;
    }
    to { 
        background-position: -${frames * 100}%;
    }
`

const container = (frame: number, visible?: boolean) => css`
    position: absolute;
    bottom:  0;
    background-size: ${frame * 100}% 100%;
    ${ !visible? `height: 0% !important;`: '' };
    ${ !visible? `width: 0% !important;`: '' };
`

const getAnimation = (frames: number, duration?: number, delay?: number, loop?: boolean) => css`
    animation: ${animationKeyFrame(frames)} ${ duration }s steps(${frames}) ${delay || 0}s ${loop ? 'infinite': 1};
`
export {
    Animated
};