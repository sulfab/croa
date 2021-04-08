import { css } from '@emotion/react';
import { Player, PlayerColor } from '@gamepark/croa/player';
import React, { CSSProperties, useState } from 'react';
import { playerBoardMaleTokensHeight, playerColors, playerColorsDark } from '../../utils/Styles';
import gamePointIcon from './visuals/game-point.svg';
import { getPlayerName } from '@gamepark/croa/CroaOptions';
import { useTranslation } from 'react-i18next';
import { CroaAvatar } from './Avatar';
import { Player as PlayerInfo, PlayerTimer } from '@gamepark/react-client';

type PlayerInfosProps = {
    player: Player
    playerInfo: PlayerInfo
    color?: PlayerColor
}

const PlayerInfos: React.FC<PlayerInfosProps> = ({ player, playerInfo, color }) => {
    const {t} = useTranslation();
    const [gamePoints,] = useState(playerInfo?.gamePointsDelta);
    const realColor = color || player.color;
    
    return (
        <>
        <div css={ avatarContainer(realColor) }>
            <CroaAvatar player={ player } playerInfo={ playerInfo } customStyle={ avatarStyle } css={ avatarCss } color={ realColor } />
        </div>
        <div css={titleStyle(realColor)}>
            <span css={[nameStyle, playerInfo.quit && quit ]}>{ playerInfo?.name || getPlayerName(player.color, t) }</span>
            { typeof gamePoints === 'number' &&
                <span css={css`flex-shrink: 0`}>
                    <img src={gamePointIcon} alt="Game point icon" css={gamePointIconStyle}/>
                    {gamePoints > 0 && '+'}{ playerInfo?.gamePointsDelta }
                </span>
            }
            { playerInfo?.time?.playing && <PlayerTimer css={ gamePointsStyle } playerId={ player.color } /> }
        </div>
        </>
    )

}

const gamePointsStyle = css`
    position: absolute;
    right: 2%;
    display: flex;
    align-items: center;
`;

const quit = css`
    text-decoration: line-through;
`;

const avatarContainer = (playerColor: PlayerColor) => css`
    z-index: 2;
    position: absolute;
    height: 31%;
    width: 20%;
    left: -3%;
    border-radius: 4em;
    bottom: ${ 10 + playerBoardMaleTokensHeight }%;
    border: 0.4em solid rgb(${playerColorsDark.get(playerColor)!.rgb.r}, ${playerColorsDark.get(playerColor)!.rgb.g}, ${playerColorsDark.get(playerColor)!.rgb.b});
`;

const titleStyle = (playerColor: PlayerColor) => css`
    color: white;
    position: absolute;
    width: 93%;
    height: 21%;
    bottom: ${ 12 + playerBoardMaleTokensHeight }%;
    left: 8%;
    right: 3%;
    margin: 0;
    font-size: 2.8em;
    padding-top: 0.1em;
    font-weight: normal;
    display: flex;
    border-top-right-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    justify-content: space-between;
    border: 0.12em solid rgb(${playerColorsDark.get(playerColor)!.rgb.r}, ${playerColorsDark.get(playerColor)!.rgb.g}, ${playerColorsDark.get(playerColor)!.rgb.b});
    background-color: rgb(${playerColors.get(playerColor)!.rgb.r}, ${playerColors.get(playerColor)!.rgb.g}, ${playerColors.get(playerColor)!.rgb.b});
`;

const nameStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  position:absolute;
  letter-spacing: 0.03em;
  left: 10%;
`;

const avatarStyle: CSSProperties = {
    position: 'absolute',
    height: '118%',
    top: '-16%',
    left: '-12%',
    width: '123%'
};

const avatarCss = css`
    position: absolute;
    height: 130%;
    top: -26%;
    left: -5%;
    width: 108%;
`;

const gamePointIconStyle = css`
  height: 1em;
`;

export {
    PlayerInfos
}