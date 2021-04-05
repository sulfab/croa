import { skipTurnMove } from '@gamepark/croa/moves';
import { PlayerColor } from '@gamepark/croa/player';
import { usePlay } from '@gamepark/react-client';
import { FC, HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../utils/Button';

type SkipButtonProps = {
    color: PlayerColor
} & Omit<HTMLAttributes<HTMLSpanElement>, 'color'>

const SkipButton: FC<SkipButtonProps> = ({ color, ...props }) => {
    const play = usePlay();
    const { t } = useTranslation();

    return (
       <Button { ...props } color={ color } onClick={ () => play(skipTurnMove) }>{ t('Skip your turn')}</Button>
    )
}

export {
    SkipButton
}