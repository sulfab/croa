import { css, keyframes } from "@emotion/react";
import { Player, PlayerColor } from "@gamepark/croa/player";
import { useAnimation } from "@gamepark/react-client";
import Avatar from 'avataaars'
import { FC, useState } from "react"
import { Images } from "../Resources";
import gamePointIcon from './visuals/game-point.svg'
import { FemaleFrog, MaleFrog } from "@gamepark/croa/frog";
import { isFrogBirth } from "@gamepark/croa/moves";
import { useSelector } from "react-redux";
import { 
    playerBoardHeight, 
    playerBoardRatio,
    playerBoardServantHeight, 
    playerBoardMaleTokensWidth, 
    playerColors, 
    playerBoardMaleTokensHeight, 
    playerBoardQueenHeight, 
    getFrogLeft, 
    frogMiniImage
} from "../../utils/Styles";
import { fromMiniImages } from "../frog/FrogMiniImages";
type PlayerBoardProps = {
    player: Player
    index: number
    activePlayer?: PlayerColor
} & React.HTMLAttributes<HTMLDivElement>

const PlayerBoard: FC<PlayerBoardProps> = ({ player, index, activePlayer, ...props }) => {
    const playerInfo = useSelector((state: any) => state.players.find((p: any) => p.id === player.color));
    const animation = useAnimation(animation => isFrogBirth(animation.move) && animation.move.playerId === player.color);
    const [gamePoints,] = useState(playerInfo?.gamePointsDelta)

    const playerMaleTokens = maleToken.get(player.color);   
    return (
        <div { ...props } css={[playerBoard(player.color), player.eliminated && eliminatedPlayer, activePlayer === player.color && playerBoardActive ]}>
            {playerInfo?.avatar ?
                <Avatar style={avatarStyle} avatarStyle="Circle" {...playerInfo?.avatar}/> :
                <img alt={'Player board'} src={playerDefaultImages.get(player.color)} css={[avatarStyle, defaultAvatarStyle]} draggable="false"/>
            }
            <h3 css={titleStyle}>
                <span css={[nameStyle]}>{ playerInfo?.name || player.color }</span>
                {typeof gamePoints === 'number' &&
                    <span css={css`flex-shrink: 0`}>
                        <img src={gamePointIcon} alt="Game point icon" css={gamePointIconStyle}/>
                        {gamePoints > 0 && '+'}{playerInfo?.gamePointsDelta}
                    </span>
                }
            </h3>
            <div css={ servantFrogsStyle }>
                { 
                    player.femaleFrogs.filter(frog => !frog.position).map(frog => 
                        <div key={ frog.id } css={ servantFrog(frog)}>
                            <img css={ [frogMiniImage(frog)] } alt={`${ frog.color } ${ frog.isQueen? 'queen': 'servant' }`} src={ frog.isQueen? fromMiniImages.get(frog.color)?.queen: fromMiniImages.get(frog.color)?.servant } />
                        </div>
                    )
                }
            </div>
            <div css={ maleTokensStyle }>
                {
                    Object.keys(MaleFrog).map((male, index) => { 
                        return (
                            <div key={ `${male}` }  css={ maleTokenContainer(index) }>
                                <div css={ [maleTokenInner(!player.maleFrogs.includes(MaleFrog[male])), (animation && animation.move.male === MaleFrog[male]) && maleFrogAnimation(animation.duration)] }>
                                    <img css={[ maleTokenStyle ]} alt={`enabled ${male.toLowerCase()} male token`} src={playerMaleTokens!.get(MaleFrog[male])} />
                                    <img css={[ maleTokenStyle, disabledMaleTokenStyle ]} alt={`disabled ${male.toLowerCase()} male token`} src={playerMaleTokens!.get(MaleFrog[male])} />
                                </div>
                            </div>
                            )
                        
                    })
                }
            </div>
        </div>
    );
}

const playerBoardActive = css`
    box-shadow: 0em 0.1em 0.5em 0.5em gold
`;

const playerBoard = (playerColor: PlayerColor) => css`
    z-index: -1;
    border: 0.3em solid rgb(${playerColors.get(playerColor)!.rgb.r}, ${playerColors.get(playerColor)!.rgb.g}, ${playerColors.get(playerColor)!.rgb.b});
    border-radius: 5%;
    position: absolute;
    width: 100%;
    height: ${ playerBoardHeight }%;
    background-color: hsla(${playerColors.get(playerColor)!.hsl.h} ,${playerColors.get(playerColor)!.hsl.s}%, 90%, 0.6);
    color: black;
    box-shadow: 0 0.5em 0.7em black;
`;

const eliminatedPlayer = css`
    filter: grayscale(1)
`;

const titleStyle = css`
  color: #333333;
  position: absolute;
  top: 2%;
  left: 10%;
  right: 3%;
  margin: 0;
  font-size: 2.9em;
  font-weight: normal;
  display: flex;
  justify-content: space-between;
`;

const avatarStyle = css`
  position: absolute;
  height: 20%;
  top: 7%;
  left: 5%;
  border-radius: 100%;
`;

const defaultAvatarStyle = css`
    height: 29%;
    width: 18.5%;
    top: -10%;
    left: -4%;
`

const nameStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  position:absolute;
  left: 10%;
`;

const gamePointIconStyle = css`
  height: 1em;
`;


const servantFrogsStyle = css`
    position: absolute;
    height: ${ playerBoardQueenHeight }%;
    display: flex;
    flex: 1;
    justify-content: space-between;
    bottom: ${15 + playerBoardMaleTokensHeight }%;
    width: 100%;
`;

const relativeFrogHeight = (frog: FemaleFrog) => (frog.isQueen? playerBoardQueenHeight: playerBoardServantHeight) * 100 / playerBoardQueenHeight
const servantFrog = (frog: FemaleFrog) => css`
    position: absolute;
    color: white;
    bottom: 0%;
    left: ${ getFrogLeft(frog) }%;
    height: ${ relativeFrogHeight(frog) }%;
    width: ${ (frog.isQueen? playerBoardQueenHeight: playerBoardServantHeight) / playerBoardRatio }%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
`;

const maleTokensStyle = css`
    position: absolute;
    height: ${ playerBoardMaleTokensHeight }%;
    display: flex;
    flex: 1;
    justify-content: space-between;
    bottom: 5%;
    width: 100%;
`;


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
    animation: ${maleFrogScale} ${duration}s ease-in-out;
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

const playerDefaultImages = new Map<PlayerColor, any>();
playerDefaultImages.set(PlayerColor.Blue, Images.DefaultBlueAvatar);
playerDefaultImages.set(PlayerColor.Green, Images.DefaultGreenAvatar);
playerDefaultImages.set(PlayerColor.Red, Images.DefaultRedAvatar);
playerDefaultImages.set(PlayerColor.Pink, Images.DefaultPinkAvatar);


export {
    PlayerBoard
};