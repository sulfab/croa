import { css } from "@emotion/react";
import { Player, PlayerColor } from "@gamepark/croa/player";
import Avatar from 'avataaars'
import { FC, useState } from "react"
import { Images } from "../Resources";
import gamePointIcon from './visuals/game-point.svg'
import { useSelector } from "react-redux";
import { 
    playerBoardHeight, 
    playerColors, 
    playerBoardMaleTokensHeight, 
    playerBoardQueenWidth,
    playerBoardServantsAreaHeight,
    playerBoardServantsAreaWidth,
    queenWidth,
    queenHeight,
    playerBoardWidth
} from "../../utils/Styles";
import { MaleTokens } from "./MaleTokens";
import { FrogAnimation } from "../frog/FrogAnimation";
import { ServantFrogs } from "./ServantFrogs";

type PlayerBoardProps = {
    player: Player
    index: number
    activePlayer?: PlayerColor
} & React.HTMLAttributes<HTMLDivElement>

const PlayerBoard: FC<PlayerBoardProps> = ({ player, index, activePlayer, ...props }) => {
    const playerInfo = useSelector((state: any) => state.players.find((p: any) => p.id === player.color));
    const [gamePoints,] = useState(playerInfo?.gamePointsDelta)
    const displayedColor = player.eliminated? PlayerColor.Green: player.color;

    return (
        <div { ...props } css={[playerBoard(displayedColor), player.eliminated && eliminatedPlayer, activePlayer === player.color && playerBoardActive ]}>
            {playerInfo?.avatar ?
                <Avatar style={avatarStyle} avatarStyle="Circle" {...playerInfo?.avatar}/> :
                <img alt={'Player board'} src={playerDefaultImages.get(displayedColor)} css={[avatarStyle, defaultAvatarStyle]} draggable="false"/>
            }
            <h3 css={titleStyle(displayedColor)}>
                <span css={[nameStyle]}>{ playerInfo?.name || player.color }</span>
                {typeof gamePoints === 'number' &&
                    <span css={css`flex-shrink: 0`}>
                        <img src={gamePointIcon} alt="Game point icon" css={gamePointIconStyle}/>
                        {gamePoints > 0 && '+'}{playerInfo?.gamePointsDelta}
                    </span>
                }
            </h3>
            <div css={ queenFrogContainer }>
                { player.femaleFrogs.filter(frog => frog.isQueen && !frog.position).map(frog => <FrogAnimation key={ frog.id } isActive={ true } frog={ frog } color={ displayedColor } animation="blinking" css={ css`position: relative;` }  />) }
            </div>
            <ServantFrogs css={ servantFrogContainer } frogs={ player.femaleFrogs.filter(frog => !frog.isQueen && !frog.position) } color={ displayedColor } />
            { /*
                player.femaleFrogs.filter(frog => !frog.position).map(frog => 
                    <div key={ frog.id } css={ servantFrog(frog)}>
                        <img css={ [frogMiniImage(frog)] } alt={`${ frog.color } ${ frog.isQueen? 'queen': 'servant' }`} src={ frog.isQueen? fromMiniImages.get(frog.color)?.queen: fromMiniImages.get(frog.color)?.servant } />
                    </div>
                ) */
            }
            <MaleTokens player={ player } color={ displayedColor } css={ css`bottom: 5%;`} />
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
    background-color: hsla(${playerColors.get(playerColor)!.hsl.h} ,${playerColors.get(playerColor)!.hsl.s}%, 90%, 0.7);
`;

const eliminatedPlayer = css`
    filter: grayscale(1)
`;

const titleStyle = (playerColor: PlayerColor) => css`
    color: rgb(${playerColors.get(playerColor)!.rgb.r}, ${playerColors.get(playerColor)!.rgb.g}, ${playerColors.get(playerColor)!.rgb.b});
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

const queenFrogHeight = queenHeight * 100 / playerBoardHeight;
const queenFrogWidth = queenWidth * 100 / playerBoardWidth;
const queenFrogContainer = css`
    bottom: ${ 15 + playerBoardMaleTokensHeight }%;  
    left: 5%;
    height: ${ queenFrogHeight }%;
    width: ${ queenFrogWidth }%;
    position: absolute;
    z-index: 1;
`;

const servantFrogContainer = css`
    height: ${ playerBoardServantsAreaHeight }%;
    width: ${ playerBoardServantsAreaWidth }%;
    bottom: ${ 20 + playerBoardMaleTokensHeight }%;  
    left: ${ 7 + playerBoardQueenWidth }%;
    position: absolute;
`;

const playerDefaultImages = new Map<PlayerColor, any>();
playerDefaultImages.set(PlayerColor.Blue, Images.DefaultBlueAvatar);
playerDefaultImages.set(PlayerColor.Green, Images.DefaultGreenAvatar);
playerDefaultImages.set(PlayerColor.Red, Images.DefaultRedAvatar);
playerDefaultImages.set(PlayerColor.Pink, Images.DefaultPinkAvatar);


export {
    PlayerBoard
};