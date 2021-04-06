import { css } from '@emotion/react';
import { Player } from '@gamepark/croa/player';
import React, { CSSProperties, HTMLAttributes, useState } from 'react';
import { useSelector } from 'react-redux';
import { CroaAvatar } from '../material/player/Avatar';
import { FrogAnimation } from '../material/frog/FrogAnimation';
import gamePointIcon from '../material/player/visuals/game-point.svg';

type RankProps = {
    rank: number;
    player?: Player;
    reduced?: boolean;
} & HTMLAttributes<HTMLDivElement> 

const Rank: React.FC<RankProps> = ({ rank, player, reduced, ...props }) => {
    const playerInfo = useSelector((state: any) => state.players.find((p: any) => p.id === player?.color));
    const [gamePoints,] = useState(playerInfo?.gamePointsDelta);
    return (
        <div { ...props } css={ rankContainer }>
            <div css={ [getFrog(rank), reduced && hideFrog ] }>
                { player && <FrogAnimation visible={ true } duration={ rank === 1? 0.6: 1 } delay={ rank * 0.7 } frog={ player.femaleFrogs.find(frog => frog.isQueen)! } loop={ true } animation={ rank === 1? 'jumping_front': 'blinking' } css={ css`position: relative;` }  /> }
            </div>
            <div css={ [getRank(rank), reduced && rankDisabled] }>
                { player && <CroaAvatar customStyle={ avatarStyle } css={ avatarCss } player={ player} playerInfo={ playerInfo } /> }
                { gamePoints !== undefined &&
                    <span css={ [gamePointsStyle, reduced && hideGamePoints] }>
                        <img src={gamePointIcon} alt="Game point icon" css={gamePointIconStyle}/>
                        {gamePoints > 0 && '+'}{playerInfo?.gamePointsDelta}
                    </span>
                }
            </div>
        </div>
    );
}

const gamePointsStyle = css`
    height: 1.2em;
    font-size: 3em;
    width: 100%;
    display: flex;
    justify-content: center;
    color: black;
    transition: opacity 0.2s linear, height 0.2s linear 0.2s;
`;

const hideGamePoints = css`
    opacity: 0;
    height: 0;
`

const avatarCss = css`
    position: relative;
    height: 7em;
    width: 6em;
    filter: drop-shadow(0 0.2em 0.2em black);
    top: unset;
    left: unset;
    margin-bottom: 0.4em;
`;

const avatarStyle: CSSProperties = {
    position: 'relative',
    height: '7em',
    width: '6em',
    filter: 'drop-shadow(0 0.2em 0.2em black)',
    top: 'unset',
    left: 'unset',
    marginBottom: '0.4em'
};

const rankContainer = css`
    display: flex;
    justify-content: center;
`;

const gamePointIconStyle = css`
    height: 1em;
`;

const getRank = (rank: number) => css`
    position: absolute;
    bottom: 0;
    height: ${30 + (5 * (4 - rank))}%;
    display: flex;
    align-items: center;
    flex-direction: column; 
    padding-bottom: 0.5em;
    z-index: ${4 - rank};
    justify-content: flex-end;
    width: 100%;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    box-shadow: 0 0.3em 0.5em black;
    background-color: ${getRankColor(rank)};
`;

const rankDisabled = css`
    height: 1em;
`

const getFrog = (rank: number) => css`
    z-index: ${5 - rank};
    position: absolute;
    height: 26%;
    width: 65%;
    bottom: ${(30 + (5 * (4 - rank)) - 5) + (rank === 1? 41: 0)}%;
`

const hideFrog = css`
  opacity: 0;
`;

const getRankColor = (rank: number) => {
    switch(rank) {
        case 1:
            return 'gold';
        case 2:
            return 'silver';
        case 3:
            return '#cd7f32';
        default:
            return 'gray';
    }
}

export {
    Rank
}