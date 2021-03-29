import { css, keyframes } from '@emotion/react';
import { GameState } from '@gamepark/croa/GameState';
import { isGameOver } from '@gamepark/croa/utils';
import { usePlayerId } from '@gamepark/react-client';
import { Letterbox } from '@gamepark/react-components';
import { Board } from './material/board/Board';
import { PlayerBoard } from './material/player/PlayerBoard';
import { PlayerBoardPlacement } from './material/player/PlayerBoardPlacement';
import { Ranking } from './ranking/Ranking';
import { playerWidth } from './utils/Styles';
import React from 'react';

type Props = {
  game: GameState
}

const GameDisplay: React.FC<Props> = ({game}: Props) => {
  const playerId = usePlayerId();
  const playerIndex = game.players.findIndex(player => player.color === playerId) === -1? 0: game.players.findIndex(player => player.color === playerId);
  const getPlayer = (index: number) => game.players.find((_, i) => PlayerBoardPlacement[game.players.length].getPlayerBoard(i, playerIndex) === index);

  return (
    <>
      <Letterbox css={letterBoxStyle}>
        { isGameOver(game.players) && <Ranking players={ game.players } css={ rankingBoard } /> }
        <div css={ gameBoard }>
          <Board pond={ game.pond } frogs={ game.players.flatMap(p => p.femaleFrogs.filter(frog => !!frog.position)) } activePlayer={ game.activePlayer } playerIndex={ playerIndex } playerCount={ game.players.length }/>
          <div css={[ playerBoards, leftPlayerBoards ]}>
            { getPlayer(0) && <PlayerBoard index={0} css={ css`bottom: 0%`} player={ getPlayer(0)! } activePlayer={ game.activePlayer } /> }
            { getPlayer(1) && <PlayerBoard index={1} css={ css`top: 0%`}  player={ getPlayer(1)! } activePlayer={ game.activePlayer } /> }
          
          </div>
          <div css={[ playerBoards, rightPlayerBoards ]}>
            { getPlayer(2) && <PlayerBoard index={2} css={ css`top: 0%`} player={ getPlayer(2)! } activePlayer={ game.activePlayer }  /> }
            { getPlayer(3) && <PlayerBoard index={3} css={ css`bottom: 0%`} player={ getPlayer(3)! } activePlayer={ game.activePlayer } /> }
          </div>
        </div>
      </Letterbox>
    </>
  )
}

const rankingBoard = css`
    position: absolute;
    z-index: 1;
`

const gameBoard = css`
  perspective: 100em;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const leftPlayerBoards = css`
  left: 3%
`;

const rightPlayerBoards = css`
  right: 3%
`;

const playerBoards = css`
  position: absolute;
  transform: rotateX(10deg);
  height: 90%;
  width: ${ playerWidth }%;
`

const fadeIn = keyframes`
  from, 50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`

export {
  GameDisplay
}