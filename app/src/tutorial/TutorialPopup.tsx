import { css } from '@emotion/react'
import {faMinusSquare, faPlusSquare, faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { GameStateView } from '@gamepark/croa/GameState'
import { isMoveFrog, isRevealSlab, Move } from '@gamepark/croa/moves'
import { PlayerColor } from '@gamepark/croa/player'
import { isGameOver } from '@gamepark/croa/utils'
import {useActions, useAnimation, useDisplayState, useFailures, usePlayerId} from '@gamepark/react-client'
import {TFunction} from 'i18next'
import React, { useEffect, useRef, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import { isTouchDevice } from '../utils/IsTouchDevice'
import { Button } from '../utils/Button'
import {
  closePopupStyle, discordUri, hidePopupOverlayStyle, platformUri, popupLightStyle, popupOverlayStyle, popupStyle, showPopupOverlayStyle
} from '../utils/Styles';
import tutorialArrowLight from '../utils/tutorial-arrow-light.png'
import { CroaState } from 'src/state/CroaState'
import { SlabFrontType } from '@gamepark/croa/pond'

const TutorialPopup: React.FC<{ game: GameStateView }> = ({game}) => {
  const [croaState, setCroaState] = useDisplayState<CroaState | undefined>(undefined);
  const {t} = useTranslation()
  const [failures] = useFailures()
  const playerId = usePlayerId<PlayerColor>()
  const actions = useActions<Move, PlayerColor>()
  const animation = useAnimation<Move>(animation => isMoveFrog(animation.move) || isRevealSlab(animation.move))
  const actionsNumber = (actions !== undefined ? actions.filter(action => action.playerId === playerId && !action.pending).length : 0);
  const tutorialStep = actionsNumber + (actionsNumber > 0? 1: (croaState?.selectedFrog? 1: 0));
  const previousActionNumber = useRef(actionsNumber)
  const [tutorialIndex, setTutorialIndex] = useState(0)
  const [tutorialEnd, setTutorialEnd] = useState(false)
  const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > tutorialStep);
  const toggleTutorialEnd = () => {
    setTutorialEnd(!tutorialEnd)
  }
  const moveTutorial = (deltaMessage: number) => {
    setTutorialIndex(tutorialIndex + deltaMessage)
    setTutorialDisplay(true)
  }
  const resetTutorialDisplay = () => {
    setTutorialIndex(0)
    setTutorialDisplay(true)
  }
  const tutorialMessage = (index: number) => {
    let currentStep = tutorialStep
    while (!tutorialDescription[currentStep]) {
      currentStep--
    }
    return tutorialDescription[currentStep][index]
  }
  useEffect(() => {
    if (previousActionNumber.current > tutorialStep) {
      setTutorialDisplay(false)
    } else if (tutorialDescription[tutorialStep]) {
      resetTutorialDisplay()
    }
    previousActionNumber.current = tutorialStep
  }, [tutorialStep])

  useEffect(() => {
    if (croaState?.selectedFrog && !tutorialStep) {
      resetTutorialDisplay()
    }
  }, [tutorialStep, croaState?.selectedFrog])

  useEffect(() => {
    if (failures.length && tutorialDescription[tutorialStep]) {
      setTutorialIndex(tutorialDescription[tutorialStep].length - 1)
      setTutorialDisplay(true)
    }
  }, [tutorialStep, failures]);

  useEffect(() => {
    if (!tutorialStep) {
      if (tutorialIndex === 5 || (tutorialIndex === 6 && !croaState?.highlightedSlab)) {
        setCroaState({
          ...croaState,
          highlightedSlab: SlabFrontType.Log
        })
      }

      if (tutorialIndex === 7 || (tutorialIndex === 4 && !!croaState?.highlightedSlab)) {
        setCroaState({
          ...croaState,
          highlightedSlab: undefined
        })
      }
    }
  // eslint-disable-next-line
  }, [tutorialStep, tutorialIndex])

  const currentMessage = tutorialMessage(tutorialIndex)
  const displayPopup = tutorialDisplay && !animation && currentMessage && !failures.length
  return (
    <>
      <div css={[popupOverlayStyle, displayPopup ? showPopupOverlayStyle : hidePopupOverlayStyle(85, 90), style]} onClick={() => setTutorialDisplay(false)}>

        <div css={[popupStyle, popupLightStyle, displayPopup ? popupPosition(currentMessage) : hidePopupStyle]} onClick={event => event.stopPropagation()}>

          <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}><FontAwesomeIcon icon={faTimes}/></div>

          {currentMessage && <h2>{currentMessage.title(t)}</h2>}
          {currentMessage && <p css={ popupMessage }>{currentMessage.text(t)}</p>}

          <div css={ buttonContainer }>
            {tutorialIndex > 0 && <Button color={ playerId } css={[button, backButton]} onClick={() => moveTutorial(-1)} >{'<<'}</Button>}
            <Button color={ playerId } css={ [button, okButton] } onClick={() => moveTutorial(1)}>{t('OK')}</Button>
          </div>
        </div>
      </div>
      {
        !displayPopup && tutorialDescription.length > tutorialStep && <Button color={ playerId } css={[button, resetStyle]} onClick={() => resetTutorialDisplay()}>{t('Show Tutorial')}</Button>
      }
      {
        currentMessage && currentMessage.arrow &&
        <img alt='Arrow pointing toward current tutorial interest' src={tutorialArrowLight} draggable="false"
             css={[arrowStyle(currentMessage.arrow.angle), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]}/>
      }
      { 
        isGameOver(game.players) &&
        <div css={[popupStyle, popupPosition(tutorialEndGame), tutorialEnd && buttonsPosition, popupLightStyle]}>
          <div css={closePopupStyle} onClick={() => toggleTutorialEnd()}><FontAwesomeIcon icon={tutorialEnd ? faPlusSquare : faMinusSquare}/></div>
          {!tutorialEnd &&
          <>
            <h2>{tutorialEndGame.title(t)}</h2>
            <p css={ popupMessage }>{tutorialEndGame.text(t)}</p>
          </>
          }
          <div css={ buttonContainer} >
            <Button css={ [button, endGameButton] } onClick={() => resetTutorial()}>{t('Restart the tutorial')}</Button>
            <Button css={ [button, endGameButton] } onClick={() => window.location.href = platformUri}>{t('Play with friends')}</Button>
            <Button css={ [button, endGameButton] } onClick={() => window.location.href = discordUri}>{t('Find players')}</Button>
          </div>
        </div>
      }
    </>
  )
}

const buttonContainer = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const button = css`
  height: 4.5em;
`

const endGameButton = css`
  width: 25%; 
  &:not(:first-of-type) {
    margin-left: 2%;
  }
`;

const okButton = css`
  width: 20%; 
`;

const backButton = css`
  width: 8%;
  margin-right: 2%;
`;

const popupMessage = css`
  font-family: 'News Cycle', sans-serif;
`

export function resetTutorial() {
  localStorage.removeItem('croa')
  window.location.reload()
}

const style = css`
  background-color: transparent;
`

export const popupPosition = ({boxWidth, boxTop, boxLeft, arrow}: TutorialStepDescription) => css`
  transition-property: width, top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  width: ${boxWidth}%;
  top: ${boxTop}%;
  left: ${boxLeft}%;
  transform: translate(-50%, ${!arrow || arrow.angle % 180 !== 0 ? '-50%' : arrow.angle % 360 === 0 ? '0%' : '-100%'});
`

export const buttonsPosition = css`
  top: 86%;
  width: 80%;
`

const resetStyle = css`
  position: absolute;
  text-align: center;
  bottom: 10%;
  right: 1%;
  height: 7.5%;
  width: 20%;
  font-size: 1.6em;
`

const arrowStyle = (angle: number) => css`
  position: absolute;
  transform: rotate(${angle}deg);
  will-change: transform;
  z-index: 102;
  transition-property: top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
`

const showArrowStyle = (top: number, left: number) => css`
  top: ${top}%;
  left: ${left}%;
  width: 20%;
`

const hideArrowStyle = css`
  top: 90%;
  left: 90%;
  width: 0;
`

export const hidePopupStyle = css`
  top: 85%;
  left: 90%;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: solid 0 #FFF;
  font-size: 0;
`

type TutorialStepDescription = {
  title: (t: TFunction) => string
  text: (t: TFunction) => any
  boxTop: number
  boxLeft: number
  boxWidth: number
  arrow?: {
    angle: number
    top: number
    left: number
  }
}

const tutorialDescription: TutorialStepDescription[][] = [
  [
    {
      title: (t: TFunction) => t('Welcome to Croak!'),
      text: (_: TFunction) => <Trans defaults="In Croak, you are a frog clan that wants their Queen to be <0>THE</0> Queen of the pond!" components={[<strong />]} />,
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('Your frogs'),
      text: (t: TFunction) => t('This is your frog clan: The blue clan. You have one Queen and until six servants.'),
      boxTop: 58,
      boxLeft: 25,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 58,
        left: 3
      }
    },
    {
      title: (t: TFunction) => t('Your opponent'),
      text: (t: TFunction) => t('In this tutorial, you play against one opponent controlled by the machine: The pink clan.'),
      boxTop: 40,
      boxLeft: 70,
      boxWidth: 50,
      arrow: {
        angle: 0,
        top: 27,
        left: 75
      }
    },
    {
      title: (t: TFunction) => t('Goal of the game'),
      text: (t: TFunction) => t('The game consists of taking controls of the pond by chasing the Queen of other clans. The player with the last Queen in the pond wins the game !'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('Game help'),
      text: (t: TFunction) => t('The header on the top of the game will help you to know what you can do and what your opponent can do.'),
      boxTop: 18,
      boxLeft: 50,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 5,
        left: 40
      }
    },
    {
      title: (t: TFunction) => t('Game help'),
      text: (t: TFunction) => isTouchDevice()?  
          t('When you long press a revealed tile, the number of copy of this tile for each water type (shallow or deep) will be displayed here.'): 
          t('When you put your mouse on a revealed tile, the number of copy of this tile for each water type (shallow or deep) will be displayed here.'),
      boxTop: 42,
      boxLeft: 57,
      boxWidth: 60,
      arrow: {
        angle: -90,
        top: 35,
        left: 15
      }
    },
    {
      title: (t: TFunction) => t('Game help'),
      text: (t: TFunction) => t('And the description of the tile will be displayed here.'),
      boxTop: 43,
      boxLeft: 43,
      boxWidth: 50,
      arrow: {
        angle: 90,
        top: 35,
        left: 65
      }
    },
    {
      title: (t: TFunction) => t('Frog move'),
      text: (t: TFunction) => t('Now, select your Queen by clicking on it.'),
      boxTop: 68,
      boxLeft: 45,
      boxWidth: 70,
      arrow: {
        angle: -180,
        top: 68,
        left: 14
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Frog move'),
      text: (t: TFunction) => t('As you can see, some tiles are surrounded by a color. The yellow indicated that the target tile is a valid target while red indicated that tile is not valid. You cannot move your frog on a tile that contains one of your other frog (There is an exception on the log that is a peaceful tile for maximum two servants).'),
      boxTop: 63,
      boxLeft: 50,
      boxWidth: 80,
      arrow: {
        angle: 180,
        top: 63,
        left: 22
      }
    },
    {
      title: (t: TFunction) => t('Frog move'),
      text: (t: TFunction) => t('Select this tile to move your frog on it. Note: You can also move a frog by dragging it and dropping it on a valid tile.'),
      boxTop: 63,
      boxLeft: 50,
      boxWidth: 80,
      arrow: {
        angle: 180,
        top: 63,
        left: 22
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Tile revealing'),
      text: (t: TFunction) => t('Depending on the tile you move your frog on, there can be different effects. Here, the tile is a Water Lily. This one allow you to move your frog again on another tile.'),
      boxTop: 57,
      boxLeft: 50,
      boxWidth: 80,
      arrow: {
        angle: 180,
        top: 57,
        left: 22
      }
    },
    {
      title: (t: TFunction) => t('Move your frog'),
      text: (t: TFunction) => t('Now jump on this tile !'),
      boxTop: 52,
      boxLeft: 47,
      boxWidth: 50,
      arrow: {
        angle: 180, 
        top: 52,
        left: 29.5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Move another frog'),
      text: (t: TFunction) => t('Your Queen has eaten a mosquito. This effect allow you to move another frog or skip your turn. In our case, we will play this frog.'),
      boxTop: 71,
      boxLeft: 30,
      boxWidth: 40,
      arrow: {
        angle: -180,
        top: 71,
        left: 21
      }
    },
    {
      title: (t: TFunction) => t('Move another frog'),
      text: (t: TFunction) => t('Move the servant on this tile.'),
      boxTop: 76,
      boxLeft: 37,
      boxWidth: 40,
      arrow: {
        angle: -180,
        top: 76,
        left: 29
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Oops!'),
      text: (t: TFunction) => t('Be careful of the Pike. This tile eliminates the frog. In case the frog is your Queen, you’re eliminated from the game.'),
      boxTop: 28,
      boxLeft: 58,
      boxWidth: 40,
      arrow: {
        angle: 0,
        top: 15,
        left: 49.5
      }
    },
    {
      title: (t: TFunction) => t('Move your Queen'),
      text: (t: TFunction) => t('Move your Queen on this tile.'),
      boxTop: 40.5,
      boxLeft: 45,
      boxWidth: 40,
      arrow: {
        angle: -180,
        top: 40,
        left: 36.5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Acquire a servant'),
      text: (t: TFunction) => t('You can acquire new servant in two ways. Either by killing another player Queen or moving a Queen on a tile with a male on it.'),
      boxTop: 46,
      boxLeft: 22,
      boxWidth: 40,
      arrow: {
        angle: 90,
        top: 38,
        left: 37.5
      }
    },
    {
      title: (t: TFunction) => t('Finish it !'),
      text: (t: TFunction) => t('Now... Eliminates the opponent by moving your Queen on the same tile !'),
      boxTop: 46,
      boxLeft: 22,
      boxWidth: 40,
      arrow: {
        angle: 90,
        top: 38,
        left: 37.5
      }
    }
  
  ]
]

const tutorialEndGame = {
  title: (t: TFunction) => t('Congratulations!'),
  text: (t: TFunction) => t('You have finished your first game! You can now play with your friends, or meet other players via our chat room on Discord.'),
  boxTop: 50,
  boxLeft: 50,
  boxWidth: 87
}

export default TutorialPopup