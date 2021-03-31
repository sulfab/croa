import { css } from '@emotion/react';
import { skipTurnMove } from '@gamepark/croa/moves';
import { PlayerColor } from '@gamepark/croa/player';
import { usePlay } from '@gamepark/react-client';
import { FC, HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { playerColors, playerColorsDark } from '../../utils/Styles';
import { Images } from '../Resources';

type SkipButtonProps = {
    color: PlayerColor
} & Omit<HTMLAttributes<HTMLSpanElement>, 'color'>

const SkipButton: FC<SkipButtonProps> = ({ color, ...props }) => {
    const play = usePlay();
    const { t } = useTranslation();

    return (
        <div { ...props }>
            <span css={ skipButton(color) } onClick={ () => play(skipTurnMove) }>{ t('Skip your turn')}</span>
        </div>
    )
}

const skipButton = (playerColor: PlayerColor) => css`
    width: 100%;
    height: 100%;
    color: white;
    background: url(${Images.CroaButton}), rgb(${playerColors.get(playerColor)!.rgb.r}, ${playerColors.get(playerColor)!.rgb.g}, ${playerColors.get(playerColor)!.rgb.b});
    border: 0.05em solid rgb(${playerColorsDark.get(playerColor)!.rgb.r},${playerColorsDark.get(playerColor)!.rgb.g},${playerColorsDark.get(playerColor)!.rgb.b});
    background-size: 100% 100%;
    text-align: center;
    text-transform: uppercase;
    padding-top: 0.15em;    
    padding-right: 0.6em;
    padding-left: 0.6em;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    letter-spacing: 0.03em;
    border-radius: 0.7em;
    &:not(:active) {
        box-shadow: 0 0 0.1em white inset, 0.1em 0.1em 0.1em black; 
    };
    &:active {
        box-shadow: 0 0 0.1em white inset; 
        margin-top: 0.1em;
        margin-left: 0.1em;
    };
    font-size: 2.4em;
`;

export {
    SkipButton
}