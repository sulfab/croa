import { css } from '@emotion/react';
import { Player } from '@gamepark/croa/player';
import React, { HTMLAttributes } from 'react';
import { useSelector } from 'react-redux';
import { CroaAvatar } from '../material/player/Avatar';
import { FrogAnimation } from '../material/frog/FrogAnimation';

type RankProps = {
    rank: number;
    player: Player;
} & HTMLAttributes<HTMLDivElement> 

const Rank: React.FC<RankProps> = ({ rank, player, ...props }) => {
    const playerInfo = useSelector((state: any) => state.players.find((p: any) => p.id === player.color));
    return (
        <div { ...props } css={ rankContainer }>
            <div css={ getFrog(rank) }>
                <FrogAnimation visible={ true } duration={ rank === 1? 0.6: 1 } delay={ rank * 0.7 } frog={ player.femaleFrogs.find(frog => frog.isQueen)! } loop={ true } animation={ rank === 1? 'jumping_front': 'blinking' } css={ css`position: relative;` }  />
            </div>
            <div css={ getRank(rank) }>
                <CroaAvatar css={ css`height: 7em; width: 6em; filter: drop-shadow(0 0.2em 0.2em black); top: unset; left: unset;`} player={ player } playerInfo={ playerInfo } />
            </div>
        </div>
    );
}

const rankContainer = css`
    display: flex;
    justify-content: center;
`;

const getRank = (rank: number) => css`
    position: absolute;
    bottom: 0;
    height: ${22 + (10 * (3 - rank))}%;
    display: flex;
    align-items: flex-end;
    padding-bottom: 1em;
    z-index: ${3 - rank};
    justify-content: center;
    width: 100%;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    box-shadow: 0 0.3em 0.5em black;
    background-color: ${getRankColor(rank)}
`;

const getFrog = (rank: number) => css`
    z-index: ${4 - rank};
    position: absolute;
    height: 26%;
    width: 65%;
    bottom: ${(22 + (10 * (3 - rank)) - 5) + (rank === 1? 41: 0)}%;
    
`

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