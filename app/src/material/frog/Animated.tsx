import { css, keyframes } from '@emotion/react';
import { PlayerColor } from '@gamepark/croa/player';
import { FC, HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';

type AnimatedProps = {
    animation: string;
    image: string;
    duration?: number;
    delay?: number;
    visible?: boolean;
    color?: PlayerColor;
    frame: number;
    loop?: boolean;
    innerCss?: any
}  & Omit<HTMLAttributes<HTMLDivElement>, 'color'>


const Animated: FC<AnimatedProps> = ({ animation,innerCss, image, frame, visible, duration, delay, loop, color, ...props }) => {
    const [innerWidth, setWidth] = useState<number>()

    let width: number | undefined = undefined;
    let ref = undefined;
    if (window.ResizeObserver) {
        //eslint-disable-next-line
        const onResize = useCallback((width) => {
            if (width !== innerWidth) {
                setWidth(Math.round(width))
            }
        }, [innerWidth])

        //eslint-disable-next-line
        const detector = useResizeDetector({ onResize })
        width = detector.width;
        ref = detector.ref;
    } else {
    }

    useEffect(() => {
        if (width && (!innerWidth || innerWidth !== width)) {
            setWidth(Math.round(width))
        }
    // eslint-disable-next-line
    }, [width])

    const delayPercentage = (!delay || !duration)? 0: delay / (delay + duration) * 100;
    return (
      <div ref={ window.ResizeObserver && ref } {...props } css={ [!visible && invisible] }>
          <div css={ [innerCss, container(frame), css`height: 100%; width: ${innerWidth? innerWidth + 'px': '100%'}`, duration && getAnimation(frame, duration, delay, delayPercentage, loop) ] } style={{ backgroundImage: `url(${image})` }} />
      </div>
    );
};


const animationKeyFrame = (frame: number, delayPercentage?: number) => keyframes`
    0% { background-position: 0; }
    ${delayPercentage? `${delayPercentage}% { background-position: 0; }`: ''}
    100% { 
        background-position: -${frame * 100}%;
    }
`

const container = (frame: number) => css`
    position: absolute;
    bottom:  0;
    background-size: ${frame * 100}% 100%;
    image-rendering: -webkit-optimize-contrast;
`

const invisible = css`
    pointer-events: none;
    opacity: 0.001;
`

const getAnimation = (frames: number, duration?: number, delay?: number, delayPercentage?: number, loop?: boolean) => css`
    animation: ${animationKeyFrame(frames, delayPercentage)} ${ (delay || 0) + (duration || 0) }s steps(${frames}) ${loop ? 'infinite': 1};
`
export {
    Animated
};