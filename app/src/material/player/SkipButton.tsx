import { css, keyframes } from '@emotion/react';
import { skipTurnMove } from '@gamepark/croa/moves';
import { PlayerColor } from '@gamepark/croa/player';
import { usePlay } from '@gamepark/react-client';
import { FC, HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { playerColors } from '../../utils/Styles';

type SkipButtonProps = {
    color: PlayerColor
} & Omit<HTMLAttributes<HTMLSpanElement>, 'color'>

const SkipButton: FC<SkipButtonProps> = ({ color, ...props }) => {
    const play = usePlay();
    const { t } = useTranslation();

    return (
        <span { ...props } css={ skipButton(color) } onClick={ () => play(skipTurnMove) }>{ t('Skip my turn') }</span>
    )
}

const skipButton = (playerColor: PlayerColor) => css`
    border: 0.05em solid black;
    color: black;
    background-color: rgb(${playerColors.get(playerColor)!.rgb.r}, ${playerColors.get(playerColor)!.rgb.g}, ${playerColors.get(playerColor)!.rgb.b});
    text-align: center;
    border-radius: 0.1em;
    animation: ${skipButtonAnimation} 1s ease-in infinite alternate;
`;

const skipButtonAnimation = keyframes`
    from {
        box-shadow: 0 0 0.2em 0 black, 0 0 0.2em 0.1em silver inset;
    }
    to {
        box-shadow: 0 0 0.2em 0 black, 0 0 0.2em 0.1em gray inset;
    }
`

export {
    SkipButton
}