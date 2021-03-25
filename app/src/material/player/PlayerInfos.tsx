import { css } from "@emotion/react";
import { Player, PlayerColor } from "@gamepark/croa/player";
import { FC, useState } from "react";
import { playerColors } from "../../utils/Styles";
import gamePointIcon from './visuals/game-point.svg'

type PlayerInfosProps = {
    player: Player
    playerInfo: any
    color?: PlayerColor
}

const PlayerInfos: FC<PlayerInfosProps> = ({ player, playerInfo, color }) => {
    const [gamePoints,] = useState(playerInfo?.gamePointsDelta)
    
    return (
        <h3 css={titleStyle(color || player.color)}>
            <span css={[nameStyle]}>{ playerInfo?.name || player.color }</span>
            {typeof gamePoints === 'number' &&
                <span css={css`flex-shrink: 0`}>
                    <img src={gamePointIcon} alt="Game point icon" css={gamePointIconStyle}/>
                    {gamePoints > 0 && '+'}{playerInfo?.gamePointsDelta}
                </span>
            }
        </h3>
    )

}

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

export {
    PlayerInfos
}