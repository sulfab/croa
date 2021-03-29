import { css } from '@emotion/react';
import { Player } from "@gamepark/croa/player";
import React, { HTMLAttributes, useState } from "react"
import { useTranslation } from 'react-i18next';
import { playerBoardHeight, rankingAreaHeight, rankingAreaWidth } from '../utils/Styles';
import { Rank } from './Rank';


type RankingProps = {
    players: Array<Player>
} & HTMLAttributes<HTMLDivElement> 

const Ranking: React.FC<RankingProps> = ({ players, ...props }) => {
    const [ displayRanking, setDisplayRanking] = useState(true);
    const { t } = useTranslation();

    const getRankingTranslate = () => {

        if (!displayRanking) {
        
            const translateX = 0;
            const translateY = (100 - playerBoardHeight) * 100 / rankingAreaHeight - rankingTitleHeight;
            return `transform: translate(${translateX}%, ${translateY}%)`
            
        }
        
        return `transform: translate(${50 * 100 / rankingAreaWidth - 50}%, ${50 * 100 / rankingAreaHeight - 50}%)`
    }

    return (
        <>
            <div css={ [rankingOverlay, !displayRanking && disappearAnimation] } onClick={ () => setDisplayRanking(false)} />
            <div { ...props } css={[rankingContainer(getRankingTranslate()), !displayRanking && rankingContainerDisabled]}>            
                <div css={ [rankingTitle, !displayRanking && rankingTitleReduced] } onClick={ () => setDisplayRanking(!displayRanking)}>
                    { t('Podium') }
                </div>
                <div css={ [rankingRanks, !displayRanking && reduceRankingAnimation] }>
                    <Rank rank={ 2 } css={ [rank, !displayRanking && reduceRankingAnimation] } player={ players.find(player => player.eliminated === players.length - 1)! }/>
                    <Rank rank={ 1 } css={ [rank, !displayRanking && reduceRankingAnimation] } player={ players.find(player => !player.eliminated)! }/>
                    <Rank rank={ 3 } css={ [rank, !displayRanking && reduceRankingAnimation] } player={ players.find(player => player.eliminated === players.length - 2) } />
                </div>
            </div>
        </>
    )
}

const rankingTitleHeight = 12;

const rankingOverlay = css`
    z-index: 1;
    position: absolute;
    height: 100%;
    width: 200%;
    left: -50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(103, 128, 159, 0.5);
    transition: opacity 0.5s linear;
`;

const rankingTitle = css`
    position: absolute;
    font-size: 3em;
    color: black;
    background-color: gold;
    top: -11%;
    left: 5%;
    height: ${rankingTitleHeight}%;
    text-align: center;
    width: 90%;
    border-top-left-radius: 1.2em;
    border-top-right-radius: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition-property: top, left, width, border-radius, border, box-shadow;
    transition-duration: 1s;
`;

const rankingRanks = css`
    display: flex;
    height: 100%;
    width: 100%;
    background-color: white;
    border-radius: 2em;
    border: 0.7em solid gold;
    box-shadow: 0 0 0.3em 0.3em grey, 0 0 0.5em 0.3em grey inset;
    transition-property: transition, height, border, box-shadow, background-color;
    transition-duration: 1s, 1s, 0.5s, 0.5s, 0.5s;
`;

const reduceRankingAnimation = css`
    height: 0;
    border: 0;
    box-shadow: unset;
    background-color: transparent;
`;

const rankingTitleReduced = css`
    top: -37%;
    left: 16%;
    width: 70%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow: 0 0 0.3em 0em black;
    border: 0.1em solid black;
`; 

const rankingContainer = (translate: string) => css`
    z-index: 1;
    position: absolute;
    width: ${ rankingAreaWidth }%;
    height: ${ rankingAreaHeight }%;
    ${translate};
    transition-property: transform, left, width;
    transition-duration: 1s;
`

const rankingContainerDisabled = css`
    width: 25%;
    left: -1.5%;
`;

const disappearAnimation = css`
    opacity: 0;
`

const rank = css`
    position: relative;
    pointer-events: none;
    top: -35%;
    height: 125%;
    width: 22%;
    left: 17%;
    transition-property: height, border, box-shadow;
    transition-duration: 1s;
`

export {
    Ranking
}