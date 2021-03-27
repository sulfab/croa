import { css } from '@emotion/react';
import { Player, PlayerColor } from '@gamepark/croa/player';
import { FC, HTMLAttributes } from 'react'
import { playerBoardHeight, playerBoardMaleTokensHeight, playerBoardQueenWidth, playerBoardServantsAreaHeight, playerBoardServantsAreaWidth, playerBoardWidth, playerColors, queenHeight, queenWidth } from '../../utils/Styles';
import { MaleTokens } from './MaleTokens';
import { FrogAnimation } from '../frog/FrogAnimation';
import { ServantFrogs } from './ServantFrogs';
import { CroaAvatar } from './Avatar';
import { useSelector } from 'react-redux';
import { PlayerInfos } from './PlayerInfos';

type PlayerBoardProps = {
    player: Player
    index: number
    activePlayer?: PlayerColor
} & HTMLAttributes<HTMLDivElement>

const PlayerBoard: FC<PlayerBoardProps> = ({ player, index, activePlayer, ...props }) => {
    const playerInfo = useSelector((state: any) => state.players.find((p: any) => p.id === player.color));
    const displayedColor = player.eliminated? PlayerColor.Green: player.color;

    return (
        <div { ...props } css={ playerBoard }>
            <CroaAvatar player={ player } playerInfo={ playerInfo } />
            <div css={[playerBoardContent(displayedColor), player.eliminated && eliminatedPlayer, activePlayer === player.color && playerBoardActive ]}>
                <PlayerInfos player={ player } playerInfo={ playerInfo }/>
                <div css={ queenFrogContainer }>
                    { player.femaleFrogs.filter(frog => frog.isQueen && !frog.position).map(frog => <FrogAnimation key={ frog.id } visible={ true } frog={ frog } color={ displayedColor } animation="blinking" css={ css`position: relative;` }  />) }
                </div>
                <ServantFrogs css={ servantFrogContainer } frogs={ player.femaleFrogs.filter(frog => !frog.isQueen && !frog.position) } color={ displayedColor } />
                <MaleTokens css={ [maleTokensStyle, css`bottom: 5%;`]}  player={ player } color={ displayedColor } />
            </div>
        </div>
    );
}

const playerBoardActive = css`
    box-shadow: 0 0.1em 0.5em 0.5em gold
`;

const playerBoard = css`
    position: absolute;
    width: 100%;
    height: ${ playerBoardHeight }%;
`;

const playerBoardContent = (playerColor: PlayerColor) => css`
    z-index: -1;
    border: 0.3em solid rgb(${playerColors.get(playerColor)!.rgb.r}, ${playerColors.get(playerColor)!.rgb.g}, ${playerColors.get(playerColor)!.rgb.b});
    border-radius: 5%;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: hsla(${playerColors.get(playerColor)!.hsl.h} ,${playerColors.get(playerColor)!.hsl.s}%, 90%, 0.7);
`;

const eliminatedPlayer = css`
    &:not(.always-enabled) {
        filter: grayscale(1)
    }
`;


const maleTokensStyle = css`
    position: absolute;
    height: ${ playerBoardMaleTokensHeight }%;
    display: flex;
    flex: 1;
    justify-content: space-between;
    width: 100%;
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


export {
    PlayerBoard
};