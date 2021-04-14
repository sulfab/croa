import { css } from '@emotion/react';
import { faMinusSquare, faPlusSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameStateView } from '@gamepark/croa/GameState';
import { Move } from '@gamepark/croa/moves';
import { PlayerColor } from '@gamepark/croa/player';
import { isGameOver } from '@gamepark/croa/utils';
import { Tutorial, useActions, useAnimations, useFailures, usePlayerId } from '@gamepark/react-client';
import { TFunction } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '../utils/Button';
import { closePopupStyle, discordUri, platformUri, popupLightStyle, popupStyle } from '../utils/Styles';
import tutorialArrowLight from '../utils/tutorial-arrow-light.png';
import { useOutsideAlerter } from './useOutsideAlerter';
import { Images } from '../material/Resources';

type Props = {
    game: GameStateView
    tutorial: Tutorial
}

const TutorialPopup: React.FC<Props> = ({game, tutorial}) => {
  const {t} = useTranslation()
  const [failures] = useFailures()
  const playerId = usePlayerId<PlayerColor>()
  const actions = useActions<Move, PlayerColor>();
  const animations = useAnimations()
  const actionsNumber = (actions || []).filter(action => !action.delayed).length;
  const previousActionNumber = useRef(actionsNumber);
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [tutorialEnd, setTutorialEnd] = useState(false);
  const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > actionsNumber);
  const toggleTutorialEnd = () => {
    setTutorialEnd(!tutorialEnd);
  };
  const moveTutorial = (deltaMessage: number) => {
    let currentStep = actionsNumber;
    if (tutorialDescription[currentStep] && tutorialDescription[currentStep][tutorialIndex] && tutorialDescription[currentStep][tutorialDescription[currentStep].length - 1].opponentAction) {
      tutorial.playNextMoves(tutorialDescription[currentStep][tutorialIndex].opponentAction)
    }
    setTutorialIndex(tutorialIndex + deltaMessage);
    setTutorialDisplay(true);
  };

  const resetTutorialDisplay = () => {
    setTutorialIndex(0)
    setTutorialDisplay(true);
  };
  const tutorialMessage = (index: number) => {
    let currentStep = actionsNumber;
    while (!tutorialDescription[currentStep]) {
      currentStep--;
    }

    return tutorialDescription[currentStep][index];
  };

  useEffect(() => {
    if (actionsNumber === 0 || !tutorialDescription[actionsNumber - 1]) {
      return;
    }

    if (tutorialDescription[actionsNumber - 1][tutorialDescription[actionsNumber - 1].length - 1]?.opponentAction) {
      tutorial.playNextMoves(tutorialDescription[actionsNumber - 1][tutorialDescription[actionsNumber - 1].length - 1]?.opponentAction);
    }
  // eslint-disable-next-line
  }, [game.activePlayer])

  useEffect(() => {
    if (actionsNumber >= tutorialDescription.length) {
      tutorial.setOpponentsPlayAutomatically(true);
    }

    if (previousActionNumber.current > actionsNumber) {
        setTutorialDisplay(false);
    } else if (tutorialDescription[actionsNumber]) {
        resetTutorialDisplay();
    }
    previousActionNumber.current = actionsNumber;
  // eslint-disable-next-line
  }, [actionsNumber]);

  useEffect(() => {
    if (failures.length) {
      setTutorialIndex(tutorialDescription[actionsNumber].length - 1);
      setTutorialDisplay(true);
    }
  // eslint-disable-next-line
  }, [failures]);

  const currentMessage = tutorialMessage(tutorialIndex);
  const displayPopup = tutorialDisplay && !animations.length && currentMessage && !failures.length;
  const tutorialPopupRef = useRef(null);
  const onOutsideClick = () => {
    if (!displayPopup) {
      return;
    }

    let currentStep = actionsNumber;
    if (tutorialDescription[currentStep] && tutorialDescription[currentStep][tutorialIndex]?.opponentAction) {
      tutorial.playNextMoves(tutorialDescription[currentStep][tutorialIndex].opponentAction)
    }

    setTutorialDisplay(false);
  };

  useOutsideAlerter(tutorialPopupRef, onOutsideClick);

  return (
    <>
      <div ref={ tutorialPopupRef } css={[popupStyle, popupLightStyle, displayPopup ? popupPosition(currentMessage) : hidePopupStyle]}>

        <div css={closePopupStyle} onClick={ onOutsideClick }><FontAwesomeIcon icon={faTimes}/></div>

        {currentMessage && <h2>{currentMessage.title(t)}</h2>}
        {currentMessage && <p css={popupMessage}>{currentMessage.text(t)}</p>}

        <div css={buttonContainer}>
          {tutorialIndex > 0 &&
          <Button color={playerId} css={[button, backButton]} onClick={() => moveTutorial(-1)}>{'<<'}</Button>}
          <Button color={playerId} css={[button, okButton]} onClick={() => moveTutorial(1)}>{t('OK')}</Button>
        </div>
      </div>
      {
        !displayPopup && tutorialDescription.length > actionsNumber &&
        <Button color={playerId} css={[button, resetStyle]}
                onClick={() => resetTutorialDisplay()}>{t('Show Tutorial')}</Button>
      }
      {
        currentMessage && currentMessage.arrow &&
        <img alt="Arrow pointing toward current tutorial interest" src={tutorialArrowLight} draggable="false"
             css={[arrowStyle(currentMessage.arrow.angle), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]}/>
      }
      {
        isGameOver(game.players) &&
        <div css={[popupStyle, popupPosition(tutorialEndGame), tutorialEnd && buttonsPosition, popupLightStyle]}>
            <div css={closePopupStyle} onClick={() => toggleTutorialEnd()}><FontAwesomeIcon
                icon={tutorialEnd ? faPlusSquare : faMinusSquare}/></div>
          {!tutorialEnd &&
          <>
              <h2>{tutorialEndGame.title(t)}</h2>
              <p css={popupMessage}>{tutorialEndGame.text(t)}</p>
          </>
          }
            <div css={buttonContainer}>
                <Button css={[button, endGameButton]}
                        onClick={() => resetTutorial()}>{t('Restart the tutorial')}</Button>
                <Button css={[button, endGameButton]}
                        onClick={() => window.location.href = platformUri}>{t('Play with friends')}</Button>
                <Button css={[button, endGameButton]}
                        onClick={() => window.location.href = discordUri}>{t('Find players')}</Button>
            </div>
        </div>
      }
    </>
  );
};

const buttonContainer = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const button = css`
  height: 4.5em;
`;

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
  white-space: break-spaces;
`;

export function resetTutorial() {
  localStorage.removeItem('croa');
  window.location.reload();
}

export const popupPosition = ({boxWidth, boxTop, boxLeft, arrow}: TutorialStepDescription) => css`
  transition-property: width, top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  width: ${boxWidth}%;
  top: ${boxTop}%; 
  left: ${boxLeft}%;
  transform: translate(-50%, ${!arrow || arrow.angle % 180 !== 0 ? '-50%' : arrow.angle % 360 === 0 ? '0%' : '-100%'});
`;

export const buttonsPosition = css`
  top: 86%;
  width: 80%;
`;

const resetStyle = css`
  position: absolute;
  text-align: center;
  bottom: 10%;
  right: 1%;
  height: 7.5%;
  width: 20%;
  font-size: 1.6em;
`;

const arrowStyle = (angle: number) => css`
  pointer-events: none;
  position: absolute;
  transform: rotate(${angle}deg);
  will-change: transform;
  z-index: 102;
  transition-property: top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
`;

const showArrowStyle = (top: number, left: number) => css`
  top: ${top}%;
  left: ${left}%;
  width: 20%;
`;

const hideArrowStyle = css`
  top: 90%;
  left: 90%;
  width: 0;
`;

export const hidePopupStyle = css`
  top: 85%;
  left: 90%;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: solid 0 #FFF;
  font-size: 0;
`;

type TutorialStepDescription = {
  title: (t: TFunction) => string
  text: (t: TFunction) => any
  opponentAction?: number,
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
      text: (_: TFunction) => <Trans defaults="tutorial.welcome" components={[<strong/>]}/>,
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('Your frogs'),
      text: (t: TFunction) => t('tutorial.intro.you'),
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
      text: (t: TFunction) => t('tutorial.intro.opponent'),
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
      text: (t: TFunction) => t('tutorial.goal'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('The pond'),
      text: (t: TFunction) => t('tutorial.intro.pond'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('Tile'),
      text: (t: TFunction) =>
        <>
          <span>{ t('tutorial.intro.tile')}</span>
          <span css={ tilesStyle }>
            { t('Water type') }
            <span  css={ tileContainerStyle }>{ t('Dangerous:') } <img css={ tileStyle } alt={"Dangerous water"} src={ Images.Deep } /></span>
            <span css={ tileContainerStyle }>{ t('Calm:') } <img css={ tileStyle } alt={"Calm water"} src={ Images.Shallow } /></span>
          </span>
        </>,
      boxTop: 64,
      boxLeft: 50,
      boxWidth: 55,
      arrow: {
        angle: 180,
        top: 64,
        left: 43.5
      }
    },
    {
      title: (t: TFunction) => t('Turn'),
      text: (t: TFunction) => t('tutorial.intro.turn'),
      boxTop: 70,
      boxLeft: 30,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 70,
        left: 21
      }
    },
    {
      title: (t: TFunction) => t('Let’s go!'),
      text: (t: TFunction) => t('tutorial.move.start'),
      opponentAction: 1,
      boxTop: 70,
      boxLeft: 30,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 70,
        left: 21
      }
    }
  ], // Me
  [], // Opponent
  [
    {
      title: (t: TFunction) => t('Move your servant'),
      text: (t: TFunction) => t('tutorial.move.servant'),
      boxTop: 51,
      boxLeft: 45,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 51,
        left: 36.5
      }
    }
  ], // Me
  [
    {
      title: (t: TFunction) => t('Water Lily'),
      text: (t: TFunction) => t('tutorial.move.waterlily'),
      boxTop: 40,
      boxLeft: 52,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 40,
        left: 43.5
      }
    }
  ], // Me
  [
    {
      title: (t: TFunction) => t('Mud'),
      text: (t: TFunction) => t('tutorial.move.mud'),
      opponentAction: 1,
      boxTop: 35,
      boxLeft: 52,
      boxWidth: 52,
      arrow: {
        angle: 180,
        top: 35,
        left: 43.5
      }
    },
  ], // Me
  [
    {
      title: (t: TFunction) => t('Pike'),
      text: (t: TFunction) =>
        <>
          <span>{ t('tutorial.move.pike') }</span>
          <span css={ [tipsContainerStyle] }>
            <Trans
              defaults="tutorial.move.pike.tips"
              components={[
                // eslint-disable-next-line
                <span css={ tipsStyle } />,
                <img css={ tileStyle } alt={"Deep water"} src={ Images.Deep } />
              ]}
            />
          </span>
        </>,
      boxTop: 29,
      boxLeft: 50,
      boxWidth: 50,
      arrow: {
        angle: 0,
        top: 15,
        left: 50
      }
    },
    {
      title: (t: TFunction) => t('Move your servant'),
      text: (t: TFunction) => t('tutorial.move.servant'),
      boxTop: 51,
      boxLeft: 30,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 51,
        left: 22.5
      }
    },
  ],
  [
    {
      title: (t: TFunction) => t('Mosquito'),
      text: (t: TFunction) => t('tutorial.move.mosquito'),
      boxTop: 49,
      boxLeft: 30,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 49,
        left: 23.5
      }
    },
    {
      title: (t: TFunction) => t('Move your Queen'),
      text: (t: TFunction) => t('tutorial.move.queen'),
      boxTop: 63,
      boxLeft: 30,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 63,
        left: 22.5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Males'),
      text: (t: TFunction) => t('Males description'),
      opponentAction: 1,
      boxTop: 58,
      boxLeft: 50,
      boxWidth: 80,
      arrow: {
        angle: 180,
        top: 58,
        left: 22
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Move your servant'),
      text: (t: TFunction) => t('tutorial.move.servant'),
      boxTop: 80,
      boxLeft: 72,
      boxWidth: 50,
      arrow: {
        angle: 270,
        top: 83,
        left: 35
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Log'),
      text: (t: TFunction) => t('tutorial.move.log'),
      boxTop: 60,
      boxLeft: 50,
      boxWidth: 70,
      arrow: {
        angle: 0,
        top: 47,
        left: 52
      }
    },
    {
      title: (t: TFunction) => t('Move your servant'),
      text: (t: TFunction) => t('tutorial.move.servant'),
      opponentAction: 2,
      boxTop: 60,
      boxLeft: 50,
      boxWidth: 70,
      arrow: {
        angle: 0,
        top: 47,
        left: 52
      }
    }
  ],
  [],
  [],
  [
    {
      title: (t: TFunction) => t('Elimination'),
      text: (t: TFunction) => t('tutorial.move.elimination'),
      boxTop: 53,
      boxLeft: 26,
      boxWidth: 45,
      arrow: {
        angle: 90,
        top: 45.5,
        left: 44
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('It’s up to you!'),
      text: (t: TFunction) => t('tutorial.free'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 40
    },
    {
      title: (t: TFunction) => t('Oh! One more thing!'),
      text: (t: TFunction) => t('tutorial.highlight'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 40
    }
  ]
];

const tutorialEndGame = {
  title: (t: TFunction) => t('Congratulations!'),
  text: (t: TFunction) => t('tutorial.end'),
  boxTop: 50,
  boxLeft: 50,
  boxWidth: 87
};

const tilesStyle = css`
  line-height: 2em;
  height: 3em;
  display: flex;
  align-items: center;
  padding: 0.4em 0.2em;
  justify-content: space-around;
  font-family: "Ranchers", cursive;
  border-top: 0.05em solid gray;
  margin-top: 0.5em;
`;

const tileContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  flex: 2;
  font-family: 'News Cycle', sans-serif;
`;

const tileStyle = css`
  height: 100%;
  border-radius: 15%;
  box-shadow: 0 0.1em 0.1em black;
`;

const tipsContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 3em;
  flex: 2;
  font-family: 'News Cycle', sans-serif;
  padding: 0.4em 0.2em;
  border-top: 0.05em solid gray;
  margin-top: 0.5em;
  text-align: left;
`;

const tipsStyle = css`
  font-family: "Ranchers", cursive;
  font-weight: bold;
  letter-spacing: 0.04em;
  margin-right: 0.5em;
`;

export default TutorialPopup;