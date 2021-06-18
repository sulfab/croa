import { css, keyframes } from '@emotion/react';
import { GameStateView } from '@gamepark/croa/GameState';
import { usePlayerId, useTutorial } from '@gamepark/react-client';
import { Letterbox } from '@gamepark/react-components';
import { Board } from './material/board/Board';
import { PlayerBoard } from './material/player/PlayerBoard';
import { PlayerBoardPlacement } from './material/player/PlayerBoardPlacement';
import { Ranking } from './ranking/Ranking';
import { playerBoardHeight, playerWidth } from './utils/Styles';
import React, { useState } from 'react';
import { SlabDescription } from './material/tile/description/SlabDescription';
import { SlabDescriptionVisual } from './material/tile/description/SlabDescriptionVisual';
import WelcomePopup from './popup/WelcomePopup';
import { CroaSounds } from './sounds/CroaSounds';
import TutorialPopup from './tutorial/TutorialPopup';
import { isKnownSlab } from '@gamepark/croa/pond';
import { AudioLoader } from './utils/AudioLoader';
import { SpeechBubbleDirection } from '@gamepark/react-client/dist/Avatar';

type Props = {
  game: GameStateView,
  audioLoader: AudioLoader
}

const GameDisplay: React.FC<Props> = ({ game, audioLoader }: Props) => {
  const playerId = usePlayerId();
  const playerIndex = game.players.findIndex(player => player.color === playerId) === -1? 0: game.players.findIndex(player => player.color === playerId);
  const getPlayer = (index: number) => game.players.find((_, i) => PlayerBoardPlacement[game.players.length].getPlayerBoard(i, playerIndex) === index);
  const player = game.players.find(p => p.color === playerId);
  const [welcomePopupClosed, setWelcomePopupClosed] = useState(game.pond.some(s => s.some(s2 => isKnownSlab(s2))))
  const tutorial = useTutorial()
  const displayWelcome = !tutorial && !welcomePopupClosed
  return (
    <>
      <Letterbox css={letterBoxStyle}>
        { !game.activePlayer && <Ranking players={ game.players } css={ rankingBoard } /> }
        <div css={ gameBoard }>
          <Board pond={ game.pond }
                 playerColors={ game.players.map(p => p.color )}
                 frogs={ game.players.flatMap(p => p.femaleFrogs.filter(frog => !!frog.position)) }
                 activePlayer={ game.players.find(player => player.color === game.activePlayer) }
                 playerIndex={ playerIndex } playerCount={ game.players.length }
                 selectedFrogId={ game.selectedFrogId }
          />
          <div css={[ playerBoards, leftPlayerBoards ]}>
            { getPlayer(0) && <PlayerBoard index={0} css={ css`bottom: 0`} player={ getPlayer(0)! } activePlayer={ game.activePlayer }
                                           speechBubbleDirection={ SpeechBubbleDirection.TOP_RIGHT } /> }
            <SlabDescriptionVisual css={ lastSlabImage } highlightedTile={ game.highlightedTile } />
            { getPlayer(1) && <PlayerBoard index={1} css={ css`top: 0`} player={ getPlayer(1)! } activePlayer={ game.activePlayer }
                                           speechBubbleDirection={ SpeechBubbleDirection.BOTTOM_RIGHT } /> }
          
          </div>
          <div css={[ playerBoards, rightPlayerBoards ]}>
            { getPlayer(2) && <PlayerBoard index={2} css={ css`top: 0`} player={ getPlayer(2)! } activePlayer={ game.activePlayer }
                                           speechBubbleDirection={ SpeechBubbleDirection.TOP_LEFT } /> }
            <SlabDescription css={ lastFrontSlabDescription } highlightedTile={ game.highlightedTile } />
            { getPlayer(3) && <PlayerBoard index={3} css={ css`bottom: 0`} player={ getPlayer(3)! } activePlayer={ game.activePlayer }
                                           speechBubbleDirection={ SpeechBubbleDirection.BOTTOM_LEFT } /> }
          </div>
        </div>
        {tutorial && <TutorialPopup game={game} tutorial={tutorial}/>}
        { displayWelcome && player && <WelcomePopup player={player} close={() => setWelcomePopupClosed(true)}/>}
        <CroaSounds pond={ game.pond } audioLoader={ audioLoader } />
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
  max-height: 100%;
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

const lastSlabImage = css`
  position: absolute;
  right: 0;
  height: 25%; 
  top: ${ (100 - playerBoardHeight - 20) / 2 }%;
`;

const lastFrontSlabDescription = css`
  position: absolute;
  width: 100%;
  max-height: ${ playerBoardHeight + 20 }%;
  top: ${ (100 - playerBoardHeight - 20) / 2 }%;
`

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`

export {
  GameDisplay
}