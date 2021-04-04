import { css } from '@emotion/react';
import { PlayerColor } from '@gamepark/croa/player';
import { FC, HTMLAttributes } from 'react';
import { playerColors, playerColorsDark } from './Styles';

type ButtonProps = {
    color?: PlayerColor
} & Omit<HTMLAttributes<HTMLSpanElement>, 'color'>

const Button: FC<ButtonProps> = ({ color, children, ...props }) => {

    return (
        <div { ...props }>
            <span css={ button(color || PlayerColor.Green) }><span css={ bordered }>{ children }</span></span>
        </div>
    )
}

const bordered = css`
    margin: 0% 0.4em;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.4em;
    border-top: 0.2em solid rgba(255, 255, 255, 0.9);
`


const button = (playerColor: PlayerColor) => css`
    width: 100%;
    height: 100%;
    color: white;
    background: rgb(${playerColors.get(playerColor)!.rgb.r}, ${playerColors.get(playerColor)!.rgb.g}, ${playerColors.get(playerColor)!.rgb.b});
    border: 0.05em solid rgb(${playerColorsDark.get(playerColor)!.rgb.r},${playerColorsDark.get(playerColor)!.rgb.g},${playerColorsDark.get(playerColor)!.rgb.b});
    background-size: 100% 100%;
    text-align: center;
    text-transform: uppercase;
    padding-top: 0.15em;    
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
    Button
}