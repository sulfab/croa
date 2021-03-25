import { css, keyframes } from "@emotion/react";
import { MaleFrog } from "@gamepark/croa/frog";
import { isFrogBirth } from "@gamepark/croa/moves";
import { Player, PlayerColor } from "@gamepark/croa/player";
import { useAnimation } from "@gamepark/react-client";
import { FC } from "react";
import { playerBoardMaleTokensWidth } from "../../utils/Styles";
import { Images } from "../Resources";

type MaleTokensProps = {
    player: Player
    color?: PlayerColor
} & React.HTMLAttributes<HTMLDivElement>

export const MaleTokens: FC<MaleTokensProps> = ({ player, color, ...props }) => {
    const animation = useAnimation(animation => isFrogBirth(animation.move) && animation.move.playerId === player.color);
    const displayedColor = color || player.color;
    const playerMaleTokens = maleToken.get(displayedColor);   

    return (
        <div { ...props }>
            {
                Object.keys(MaleFrog).map((male, index) => { 
                    return (
                        <div key={ `${male}` }  css={ maleTokenContainer(index) }>
                            <div css={ [maleTokenInner(!player.maleFrogs.includes(MaleFrog[male])), (animation && animation.move.male === MaleFrog[male]) && maleFrogAnimation(animation.duration)] }>
                                <img css={[ maleTokenStyle ]} alt={`enabled ${male.toLowerCase()} male token`} src={playerMaleTokens!.get(MaleFrog[male])} />
                                <img css={[ maleTokenStyle, disabledMaleTokenStyle ]} alt={`disabled ${male.toLowerCase()} male token`} src={maleToken.get(PlayerColor.Green)!.get(MaleFrog[male])} />
                            </div>
                        </div>
                    )
                    
                })
            }
        </div>
    )
};


const maleTokenContainer = (index: number) => css`
    position: absolute;
    height: 100%;
    left: ${ playerBoardMaleTokensWidth * index + ((100 - playerBoardMaleTokensWidth * 6) / 7 * (index + 1)) }%;
    width: ${ playerBoardMaleTokensWidth }%;
`;

const maleTokenInner = (flipped: boolean) => css`
    position: absolute;
    height: 100%;
    width: 100%;
    ${flipped? 'transform: rotateY(180deg);': ''}
    transition: transform 0.8s; 
    transform-style: preserve-3d;
    
`;

const maleTokenStyle = css`
    position: absolute;
    height: 100%;
    width: 100%;
    filter: drop-shadow(0.1em 0.1em 0.3em black);
    backface-visibility: hidden;
    image-rendering: -webkit-optimize-contrast;
    background-size: contain;
`;

const disabledMaleTokenStyle = css`
    transform: rotateY(180deg);
    filter: drop-shadow(0.1em 0.1em 0.3em black) grayscale(100%);
`;

const maleFrogScale = keyframes`
  30% {        
    z-index: 2;
    transform: scale(2.0);
  }
  50% {        
    z-index: 2;
    transform: rotateY(180deg) scale(2.0);
  }
  100% {           
    z-index: 0;
    transform: rotateY(180deg) scale(1.0);
  }
`

const maleFrogAnimation = (duration: number) => css`
    animation: ${maleFrogScale} ${duration}s ease-in-out forwards;
`

const maleToken = new Map<PlayerColor, Map<MaleFrog, any>>();
maleToken.set(PlayerColor.Blue, new Map([
    [MaleFrog.Blue, Images.BlueMaleTokenBlue],
    [MaleFrog.Red, Images.RedMaleTokenBlue],
    [MaleFrog.Pink, Images.PinkMaleTokenBlue],
    [MaleFrog.Green, Images.GreenMaleTokenBlue],
    [MaleFrog.Yellow, Images.YellowMaleTokenBlue],
    [MaleFrog.Purple, Images.PurpleMaleTokenBlue]
]));

maleToken.set(PlayerColor.Green, new Map([
    [MaleFrog.Blue, Images.BlueMaleTokenGreen],
    [MaleFrog.Red, Images.RedMaleTokenGreen],
    [MaleFrog.Pink, Images.PinkMaleTokenGreen],
    [MaleFrog.Green, Images.GreenMaleTokenGreen],
    [MaleFrog.Yellow, Images.YellowMaleTokenGreen],
    [MaleFrog.Purple, Images.PurpleMaleTokenGreen]
]));


maleToken.set(PlayerColor.Pink, new Map([
    [MaleFrog.Blue, Images.BlueMaleTokenPink],
    [MaleFrog.Red, Images.RedMaleTokenPink],
    [MaleFrog.Pink, Images.PinkMaleTokenPink],
    [MaleFrog.Green, Images.GreenMaleTokenPink],
    [MaleFrog.Yellow, Images.YellowMaleTokenPink],
    [MaleFrog.Purple, Images.PurpleMaleTokenPink]
]));

maleToken.set(PlayerColor.Red, new Map([
    [MaleFrog.Blue, Images.BlueMaleTokenRed],
    [MaleFrog.Red, Images.RedMaleTokenRed],
    [MaleFrog.Pink, Images.PinkMaleTokenRed],
    [MaleFrog.Green, Images.GreenMaleTokenRed],
    [MaleFrog.Yellow, Images.YellowMaleTokenRed],
    [MaleFrog.Purple, Images.PurpleMaleTokenRed]
]));