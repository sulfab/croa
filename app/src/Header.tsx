import { css } from '@emotion/react'
import { GameState } from '@gamepark/croa/GameState'
import { isGameOver } from '@gamepark/croa/utils'
import { PlayerColor } from '@gamepark/croa/player'
import { Animation, Player as PlayerInfo, useAnimation, usePlayerId, usePlayers } from '@gamepark/react-client'
import { TFunction } from 'i18next'
import { Trans, useTranslation } from 'react-i18next'
import { FrogStatus } from '@gamepark/croa/frog'
import { getPlayerName } from '@gamepark/croa/CroaOptions';
import { Move } from '@gamepark/croa/moves'
import { SkipButton } from './material/player/SkipButton'

type Props = {
  loading: boolean
  game: GameState
}

export default function Header({loading, game}: Props) {
  const {t} = useTranslation()
  const playerId = usePlayerId();
  const playersInfos = usePlayers<PlayerColor>();
  const animation = useAnimation<Move>()
  const text = loading ? t('Game loading…') : getText(t, game, playerId, playersInfos, animation)
  return (
    <header css={style}>
      <h1 css={titleStyle}>{text}</h1>
    </header>
  )
}

const getText = (t: TFunction, game: GameState, playerId: PlayerColor, playersInfos: Array<PlayerInfo<PlayerColor>>, animation?: Animation<Move>) => {
  const getName = (color: PlayerColor) => playersInfos.find(p => p.id === color)?.name || getPlayerName(color, t);
  if (isGameOver(game.players)) {
    const lastPlayer = game.players.find(player => !player.eliminated)!;
    return playerId === lastPlayer?.color? t('Victory! You win the game'): t('{player} wins the game', { player: getName(lastPlayer.color)});
  } else {
    const activePlayer = game.players.find(player => game.activePlayer === player.color);
    if (activePlayer) {

      const frogs = game.players.flatMap(p => p.femaleFrogs);

      const isActivePlayer = activePlayer.color === playerId;
      if (activePlayer.eliminationChoice && activePlayer.eliminationChoice.length > 1) {
        return isActivePlayer? t('Which frog do you want to eliminate ?'): t('{player} must choose a frog to eliminate', { player: getName(activePlayer.color) })
      }
      
      const bouncingFrog = frogs.find(frog => FrogStatus.Bouncing === frog.status);
      if (bouncingFrog) {
        return bouncingFrog.color === playerId? t('Your frog is bouncing on a water lily, she must jump on another tile'): t('{player}’s frog is bouncing on a water lily. Waiting for the frog jump...', { player: getName(activePlayer.color) })
      }
      
      const fedFrog = frogs.find(frog => FrogStatus.Fed === frog.status);
      if (fedFrog) {
        return fedFrog.color === playerId? 
          <Trans  defaults="Your frog has eaten a mosquito, you can move another frog or <0/>"
                  components={[
                    <SkipButton key="skip-turn" css={ skipButton } color={ activePlayer.color } />
                  ]}/>
        : t('{player}’s frog has eaten a mosquito. Waiting for another frog to jump...', { player: getName(activePlayer.color) })
      }

      if (!animation && frogs.some(frog => FrogStatus.Moved === frog.status) && !game.players.some(player => player.eliminationChoice.length > 0)) {
        return t('Croooooaak...');
      }

      return isActivePlayer? t('It’s your turn to move a frog'): t('It’s {player}’s turn to move a frog', { player: getName(activePlayer.color) } );
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

const skipButton = css`
  position: absolute;
  height: 67%;
  bottom: 15%;
  width: 10%;
  margin-left: 1%;
  line-height: 1.5em;
  font-size: 0.7em;
`