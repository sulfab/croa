import { css } from '@emotion/react';
import { FemaleFrog } from '@gamepark/croa/frog';
import { PlayerColor } from '@gamepark/croa/player';
import { FC, HTMLAttributes } from 'react';
import { playerBoardHeight, playerBoardServantsAreaHeight, playerBoardServantsAreaWidth, playerBoardWidth, servantHeight, servantWidth } from '../../utils/Styles';
import { FrogAnimation } from '../frog/FrogAnimation';

type ServantFrogsProps = {
    frogs: Array<FemaleFrog>,
    color?: PlayerColor,
    horizontalOrientation?: 'left'|'right'
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'>

const ServantFrogs: FC<ServantFrogsProps> = ({ frogs, color, horizontalOrientation, ...props }) => {
    return (
        <div { ...props }>
            { frogs.map((frog, index) => <FrogAnimation key={ index } visible={ true } frog={ frog } color={ color || frog.color } animation="blinking" css={ [frogPosition(index + 2) ] } innerCss={[horizontalOrientation === 'left' && leftOrientation]}  />) }
        </div>
    )
}

const height = servantHeight * 100 / playerBoardServantsAreaHeight * 100 / playerBoardHeight;
const width = servantWidth * 100 / playerBoardServantsAreaWidth * 100 / playerBoardWidth;
const frogPosition = (frogId: number) => css`
    position: absolute;
    left: ${Math.floor((frogId - 1) / 2) * 28 - (frogId % 2 !== 0? 12: 0) }%;
    top: ${frogId % 2 === 0? 0: 50}%;
    height: ${ height }%;
    width: ${ width }%;
    z-index: ${ frogId % 2 };
`;

const leftOrientation = css`
    transform: rotateY(180deg)
`;

export {
    ServantFrogs
}