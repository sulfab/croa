import { OptionsSpec } from '@gamepark/rules-api';
import { TFunction } from 'i18next'
import { GameState } from './GameState'
import { PlayerColor, playerColors } from './player';

export type CroaPlayerOptions = { id: PlayerColor }

export type CroaOptions = {
    players: CroaPlayerOptions[]
}

export function isGameOptions(arg: GameState | CroaOptions): arg is CroaOptions {
    return (arg as GameState).pond === undefined;
}

export const CroaOptionsSpec: OptionsSpec<CroaOptions> = {
    players: {
        id: {
            label: (t: TFunction) => t('Color'),
            values: playerColors,
            valueSpec: color => ({label: t => getPlayerName(color, t)})
        }
    }
}

export function getPlayerName(playerId: PlayerColor, t: TFunction) {
    switch (playerId) {
        case PlayerColor.Blue:
            return t('Blue')
        case PlayerColor.Green:
            return t('Green')
        case PlayerColor.Red:
            return t('Red')
        case PlayerColor.Pink:
            return t('Pink')
    }
}