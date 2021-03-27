import {css} from '@emotion/react'
import { GameState } from '@gamepark/croa/GameState'
import { isGameOver } from '@gamepark/croa/utils'
import { PlayerColor } from '@gamepark/croa/player'
import { usePlayerId, usePlayers, Player as PlayerInfo } from '@gamepark/react-client'
import { TFunction } from 'i18next'
import {useTranslation} from 'react-i18next'
import { FrogStatus } from '@gamepark/croa/frog'

type Props = {
  loading: boolean
  game: GameState
}

export default function Header({loading, game}: Props) {
  const {t} = useTranslation()
  const playerId = usePlayerId();
  const playersInfos = usePlayers<PlayerColor>();
  const text = loading ? t('Game loading…') : getText(t, game, playerId, playersInfos)
  return (
    <header css={style}>
      <h1 css={titleStyle}>{text}</h1>
    </header>
  )
}

const getText = (t: TFunction, game: GameState, playerId: PlayerColor, playersInfos: Array<PlayerInfo<PlayerColor>>) => {
  const getName = (color: PlayerColor) => playersInfos.find(p => p.id === color)?.name || t(color);
  if (isGameOver(game.players)) {
    const lastPlayer = game.players.find(player => !player.eliminated)!;
    return playerId === lastPlayer?.color? t('Victory! You win the game'): t('{player} wins the game', { player: getName(lastPlayer.color)});
  } else {
    const activePlayer = game.players.find(player => game.activePlayer === player.color);
    if (activePlayer) {
      const isActivePlayer = activePlayer.color === playerId;
      if (activePlayer.eliminationChoice && activePlayer.eliminationChoice.length > 1) {
        return isActivePlayer? t('You must choose which frog you want to eliminate'): t('{player} must choose a frog to eliminate', { player: getName(activePlayer.color) })
      }
      
      const boucingFrog = game.players.flatMap(p => p.femaleFrogs.filter(frog => !!frog.position)).find(frog => FrogStatus.BOUNCING === frog.status);
      if (boucingFrog) {
        return boucingFrog.color === playerId? t('Your frog is boucing on a nenuphar, she must jump on another slab'): t('{player}\'s frog is boucing on a nenuphar. Waiting for the frog jump...', { player: getName(activePlayer.color) })
      }
      
      const stungFrog = game.players.flatMap(p => p.femaleFrogs.filter(frog => !!frog.position)).find(frog => FrogStatus.STUNG === frog.status);
      if (stungFrog) {
        return stungFrog.color === playerId? t('Your frog got stung by a moskito, you must move another frog or skip your turn'): t('{player}\'s frog was stung by a moskito. Waiting for another frog to jump...', { player: getName(activePlayer.color) })
      }

      return isActivePlayer? t('It\'s your turn to play a frog'): t('It\'s {player}\'s turn to play a frog', { player: getName(activePlayer.color) } );
    }
  }

  return;
}

const style = css`
  position: absolute;
  display: flex;
  width: 100%;
  height: 7em;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  transition: background-color 1s ease-in;
`

const titleStyle = css`
  flex-grow: 1;
  flex-shrink: 0;
  transition: color 1s ease-in;
  padding: 0.25em;
  margin: 0;
  line-height: 1.25;
  font-size: 4em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: normal;
`