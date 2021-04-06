import { css } from '@emotion/react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Failure } from '@gamepark/react-client';
import { TFunction } from 'i18next';
import { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '../utils/Button';
import {
  closePopupStyle,
  popupLightStyle,
  popupOverlayStyle,
  popupPosition,
  popupStyle,
  showPopupOverlayStyle
} from '../utils/Styles';

const FailurePopup: FunctionComponent<{ failures: string[], clearFailures: () => {} }> = ({failures, clearFailures}) => {
  const {t} = useTranslation()
  const description = failuresDescription[failures[0]] || fallbackDescription(failures[0])
  return (
    <div css={[popupOverlayStyle, showPopupOverlayStyle]} onClick={clearFailures}>
      <div css={[popupStyle, popupPosition, css`width: 70%`, popupLightStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={clearFailures}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{description.title(t)}</h2>
        <p css={ descriptionStyle }>{description.text(t)}</p>
        {[Failure.MOVE_FORBIDDEN].includes(failures[0]) && <p css={ refreshStyle }>
          <Trans defaults="If the issue remains, try to <0>reload the game</0>"
                 components={[<Button css={ buttonStyle } onClick={() => window.location.reload()}>rafraîchir la partie</Button>]}/>
        </p>}
      </div>
    </div>
  )
}

const buttonStyle = css`
  margin-left: 2%;
  height: 4.5em;
  width: 20%;
  font-size: 0.3em;
  font-family: "Ranchers", cursive;
`;

const refreshStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'News Cycle', sans-serif;
`;

const descriptionStyle = css`
  margin: 0;
  font-family: 'News Cycle', sans-serif;
`;

const failuresDescription = {
  [Failure.NETWORK]: {
    title: (t: TFunction) => t('Whoops…'),
    text: (t: TFunction) => t('An action could not be completed and was canceled. Are you still connected to the Internet?')
  },
  [Failure.MOVE_FORBIDDEN]: {
    title: (t: TFunction) => t('Move unauthorized!'),
    text: (t: TFunction) => t('The action you played is not allowed.')
  },
  [Failure.UNDO_FORBIDDEN]: {
    title: (t: TFunction) => t('Too late!'),
    text: (t: TFunction) => t('The other players have already played, your move could not be canceled.')
  },
  [Failure.TUTORIAL_MOVE_EXPECTED]: {
    title: (t: TFunction) => t('Move not expected in the tutorial'),
    text: (t: TFunction) => t('Let us show you the last information…')
  },
  // eslint-disable-next-line
  ['You must subscribe to offer a friendly rematch']: {
    title: (t: TFunction) => t('Subscription required'),
    text: (t: TFunction) => t('Game Park is evolving! You must subscribe to offer a rematch and invite everyone to play friendly games.')
  }
};

const fallbackDescription = (failure: string) => ({
  title: (t: TFunction) => t('Unknown error:'),
  text: () => failure
});

export {
  FailurePopup
};