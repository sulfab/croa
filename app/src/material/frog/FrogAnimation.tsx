import { FemaleFrog } from "@gamepark/croa/frog";
import { PlayerColor } from "@gamepark/croa/player";
import { FC } from "react";
import { frogMiniImage, getAnimationBackground } from "../../utils/Styles";

type AnimatedFrogProps = {
    frog: FemaleFrog,
    animation: string;
    isActive?: boolean;
    color?: PlayerColor;
}  & React.HTMLAttributes<HTMLDivElement>


const FrogAnimation: FC<AnimatedFrogProps> = ({ frog, animation, isActive, color, ...props }) => {

    return (
        <div { ...props } key={ frog.id } css={ [frogMiniImage(frog, animation, isActive) ]} style={{ backgroundImage: `url(${getAnimationBackground(frog.isQueen, color || frog.color, animation)})`}} />
    );
}

export {
    FrogAnimation
};