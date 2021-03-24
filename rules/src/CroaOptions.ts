import { GameOptions, OptionsDescription, OptionType } from '@gamepark/rules-api'
import { TFunction } from 'i18next'
import { GameState } from './GameState'
import { PlayerColor } from './player/PlayerColor';

export type CroaPlayerOptions = { id: PlayerColor }

export type CroaOptions = GameOptions<{}, CroaPlayerOptions>

export function isGameOptions(arg: GameState | CroaOptions): arg is CroaOptions {
  return (arg as GameState).pond === undefined;
}

export const CroaOptionsDescription: OptionsDescription<{}, CroaPlayerOptions> = {
  players: {
    id: {
      type: OptionType.LIST,
      getLabel: (t: TFunction) => t('Color'),
      values: Object.values(PlayerColor),
      getValueLabel: getPlayerName
    }
  }
}

export function getPlayerName(playerId: PlayerColor, t: TFunction) {
  switch (playerId) {
    case PlayerColor.Blue:
      return t('Blue Player')
    case PlayerColor.Green:
      return t('Green Player')
    case PlayerColor.Red:
      return t('Red Player')
    case PlayerColor.Pink:
      return t('Pink Player')
  }
}