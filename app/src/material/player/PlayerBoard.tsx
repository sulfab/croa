import { css } from '@emotion/react';
import { Player, PlayerColor } from '@gamepark/croa/player';
import { FC, HTMLAttributes } from 'react';
import {
    playerBoardHeight,
    playerBoardMaleTokensHeight,
    playerBoardQueenWidth,
    playerBoardServantsAreaHeight,
    playerBoardServantsAreaWidth,
    playerBoardWidth,
    queenHeight,
    queenWidth
} from '../../utils/Styles';
import { MaleTokens } from './MaleTokens';
import { FrogAnimation } from '../frog/FrogAnimation';
import { ServantFrogs } from './ServantFrogs';
import { useSelector } from 'react-redux';
import { PlayerInfos } from './PlayerInfos';
import { FrogStatus } from '@gamepark/croa/frog';
import { usePlayerId } from '@gamepark/react-client';
import { SkipButton } from './SkipButton';
import { SpeechBubbleDirection } from '@gamepark/react-client/dist/Avatar';

type PlayerBoardProps = {
    player: Player
    index: number
    activePlayer?: PlayerColor
    speechBubbleDirection?: SpeechBubbleDirection
} & HTMLAttributes<HTMLDivElement>

const PlayerBoard: FC<PlayerBoardProps> = ({ player, index, activePlayer, speechBubbleDirection, ...props }) => {
    const playerId = usePlayerId<PlayerColor>();
    const playerInfo = useSelector((state: any) => state.players.find((p: any) => p.id === player.color));
    const displayedColor = player.eliminated? PlayerColor.Green: player.color;
    const fedFrog = player.femaleFrogs.find(frog => FrogStatus.Fed === frog.status);

    return (
        <div { ...props } css={ playerBoard }>
            { activePlayer && player.color === playerId && fedFrog && <SkipButton color={ playerId } css={ skipButton }  />  }
            <div css={[playerBoardContent, player.eliminated && eliminatedPlayer]}>
                <div css={activePlayer === player.color && playerBoardActive} />
                <PlayerInfos player={ player } playerInfo={ playerInfo } color={ displayedColor } speechBubbleDirection={ speechBubbleDirection }/>
                <div css={ queenFrogContainer }>
                    { player.femaleFrogs.filter(frog => frog.isQueen && !frog.position).map(frog => <FrogAnimation key={ frog.id } visible={ true } frog={ frog } color={ displayedColor } animation="blinking" css={ [css`position: relative;`,  index > 1 && leftOrientation] }  />) }
                </div>
                <ServantFrogs css={ servantFrogContainer } frogs={ player.femaleFrogs.filter(frog => !frog.isQueen && !frog.position) } color={ displayedColor } horizontalOrientation={ index > 1 ? 'left': 'right'} />
                <MaleTokens css={ [maleTokensStyle, css`bottom: 5%;`]}  player={ player } color={ displayedColor } />
            </div>
        </div>
    );
}

const playerBoardActive = css`
    position: absolute;
    bottom: 0;
    background-color: gold;
    height: 51%;
    width: 101%;
    left: -0.5%;
    border-radius: 3em;
`;

const leftOrientation = css`
    transform: rotateY(180deg)
`;

const playerBoard = css`
    position: absolute;
    width: 100%;
    height: ${ playerBoardHeight }%;
    display: flex;
    justify-content: center;
`;

const skipButton = css`
    top: -40%;
    height: 22%;
    position: absolute;
    min-width: 70%;
`

const playerBoardContent = css`
    z-index: -1;
    border-radius: 5%;
    position: absolute;
    width: 100%;
    height: 100%;
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
    bottom: ${ 40 + playerBoardMaleTokensHeight }%;  
    left: 5%;
    height: ${ queenFrogHeight }%;
    width: ${ queenFrogWidth }%;
    position: absolute;
    z-index: 1;
`;

const servantFrogContainer = css`
    height: ${ playerBoardServantsAreaHeight }%;
    width: ${ playerBoardServantsAreaWidth }%;
    bottom: ${ 45 + playerBoardMaleTokensHeight }%;  
    left: ${ 7 + playerBoardQueenWidth }%;
    position: absolute;
`;


export {
    PlayerBoard
};