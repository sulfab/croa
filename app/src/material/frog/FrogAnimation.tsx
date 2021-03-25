import { FemaleFrog } from "@gamepark/croa/frog";
import { PlayerColor } from "@gamepark/croa/player";
import { FC } from "react";
import { frogMiniAnimation, frogMiniImage, getAnimationBackground } from "../../utils/Styles";

type AnimatedFrogProps = {
    frog: FemaleFrog,
    animation: string;
    duration?: number;
    visible?: boolean;
    color?: PlayerColor;
}  & React.HTMLAttributes<HTMLDivElement>


const FrogAnimation: FC<AnimatedFrogProps> = ({ frog, animation, visible, duration, color, ...props }) => {

    return (
        <div { ...props } key={ frog.id } css={ [frogMiniImage(frog, animation, !!visible), duration && frogMiniAnimation(animation, duration) ]} style={{ backgroundImage: `url(${getAnimationBackground(frog.isQueen, color || frog.color, animation)})`}} />
    );
}

export {
    FrogAnimation
};