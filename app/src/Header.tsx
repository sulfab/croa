import { css } from '@emotion/react';
import { GameState } from '@gamepark/croa/GameState';
import { isGameOver } from '@gamepark/croa/utils';
import { Player, PlayerColor } from '@gamepark/croa/player';
import { Player as PlayerInfo, useAnimation, usePlayerId, usePlayers } from '@gamepark/react-client';
import { TFunction } from 'i18next';
import { Trans, useTranslation } from 'react-i18next';
import { FrogStatus } from '@gamepark/croa/frog';
import { getPlayerName } from '@gamepark/croa/CroaOptions';
import { AcquireServant, isAcquireServant, isMoveFrog, isRevealSlab, MoveFrog, RevealSlab } from '@gamepark/croa/moves';
import { SkipButton } from './material/player/SkipButton';
import { useEffect, useState } from 'react';

type Props = {
  loading: boolean
  game: GameState
}



enum HeaderState {
  START = 1,
  NEW_TURN,
  ELIMINATION_CHOICE,
  BOUNCING_FROG,
  REVEALING,
  FED_FROG,
  ACQUIRING_SERVANT,
  OVER
}

export default function Header({loading, game}: Props) {
  const {t} = useTranslation()
  const playerId = usePlayerId();
  const [lastState, setLastState] = useState<{ state: HeaderState, playerId?: PlayerColor }>({ state: HeaderState.START });
  const playersInfos = usePlayers<PlayerColor>();
  const animation = useAnimation<MoveFrog | RevealSlab | AcquireServant>(animation => isMoveFrog(animation.move) || isRevealSlab(animation.move) || isAcquireServant(animation.move))
  const activePlayer = (game?.players || []).find(player => game.activePlayer === player.color)!;
  const text = loading ? t('Game loading...') : getText(t, lastState, game, playersInfos, playerId, activePlayer);

  useEffect(() => {
    if (!game) {
      return
    }
    if (isGameOver(game.players)) {
      setLastState({ state: HeaderState.OVER })
    } else {
      if (activePlayer) {
        if (lastState.playerId !== activePlayer.color) {
          return setLastState({ state: HeaderState.NEW_TURN, playerId: activePlayer.color });
        }

        const frogs = game.players.flatMap(p => p.femaleFrogs);
        if (activePlayer.eliminationChoice && activePlayer.eliminationChoice.length > 1) {
          return setLastState({ state: HeaderState.ELIMINATION_CHOICE, playerId: activePlayer.color });
        }

        const bouncingFrog = frogs.find(frog => FrogStatus.Bouncing === frog.status);
        if (bouncingFrog) {
          return setLastState({ state: HeaderState.BOUNCING_FROG, playerId: bouncingFrog.color });
        }

        const fedFrog = frogs.find(frog => FrogStatus.Fed === frog.status);
        if (fedFrog) {
          return setLastState({ state: HeaderState.FED_FROG, playerId: fedFrog.color });
        }

        if (animation && isAcquireServant(animation.move)) {
          return setLastState({ state: HeaderState.ACQUIRING_SERVANT, playerId: animation.move.playerId });
        }
      }
    }
  // eslint-disable-next-line
  }, [game, activePlayer, animation && animation.move])


  return (
    <header css={style}>
      <h1 css={titleStyle}>{text}</h1>
    </header>
  )
}

const getText = (t: TFunction, state: { state: HeaderState, playerId?: PlayerColor }, game: GameState, playersInfos: PlayerInfo<PlayerColor>[], playerId?: PlayerColor, activePlayer?: Player) => {
  const getName = (color: PlayerColor) => playersInfos.find(p => p.id === color)?.name || getPlayerName(color, t);
  if (state && state.state) {

    if (isGameOver(game.players)) {
      const lastPlayer = game.players.find(player => !player.eliminated)!;
      return playerId === lastPlayer?.color ? t('Victory! You win the game') : t('{player} wins the game', {player: getName(lastPlayer.color)});
    }

    const isActivePlayer = state.playerId === playerId;
    switch (state.state) {
      case HeaderState.START:
        return isActivePlayer ? t('You must move a frog') : t('{player} must move a frog', {player: getName(activePlayer!.color)});
      case HeaderState.ACQUIRING_SERVANT:
        return isActivePlayer ? t('You acquire a new servant!') : t('{player} acquire a new servant!', {player: getName(state.playerId!)});
      case HeaderState.BOUNCING_FROG:
        return isActivePlayer ? t('Your frog is bouncing on a water lily, she must jump on another tile') : t('{player}’s frog is bouncing on a water lily. Waiting for the frog jump...', {player: getName(state.playerId!)});
      case HeaderState.FED_FROG:
        return isActivePlayer ?
          <Trans defaults="Mosquito! You can move another frog or <0/>"
                 components={[
                   <SkipButton key="skip-turn" css={skipButton} color={state.playerId!}/>
                 ]}/>
          : t('Mosquito! {player} can move another frog or pass its turn', {player: getName(state.playerId!)});
      case HeaderState.ELIMINATION_CHOICE:
        return isActivePlayer ? t('Which frog do you want to chase ?') : t('{player} must choose a frog to chase', {player: getName(activePlayer!.color)});
    }
  }

  return playerId && playerId === activePlayer!.color? t('You must move a frog'): t('{player} must move a frog', { player: getName(activePlayer!.color) } );
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
  letter-spacing: 0.03em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: normal;
  display: flex;
  justify-content: center;
`

const skipButton = css`
  height: 100%;
  bottom: 15%;
  margin-left: 1%;
  line-height: 1.5em;
  font-size: 0.25em;
  min-width: 11%;
`
