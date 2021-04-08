import {css} from '@emotion/react';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {usePlayer} from '@gamepark/react-client';
import {FunctionComponent} from 'react';
import {useTranslation} from 'react-i18next';
import {
    closePopupStyle,
    popupLightStyle,
    popupOverlayStyle,
    popupPosition,
    popupStyle,
    showPopupOverlayStyle
} from '../utils/Styles';
import {FrogAnimation} from '../material/frog/FrogAnimation';
import {Player} from '@gamepark/croa/player';
import {Button} from '../utils/Button';
import {getPlayerName} from '@gamepark/croa/CroaOptions';

const WelcomePopup: FunctionComponent<{ player: Player, close: () => void }> = ({ player, close }) => {
    const {t} = useTranslation()
    const playerInfo = usePlayer(player.color)
    return (
        <div css={[popupOverlayStyle, showPopupOverlayStyle, style]} onClick={close}>
            <div css={[popupStyle, popupPosition, css`width: 60%`, popupLightStyle]}
                 onClick={event => event.stopPropagation()}>
                <div css={closePopupStyle} onClick={close}><FontAwesomeIcon icon={faTimes}/></div>
                <h2>{t('Welcome {playerName}', { playerName: (playerInfo?.name || getPlayerName(player.color, t)) })}</h2>
                <FrogAnimation css={ frogImage } visible={ true } frog={ player.femaleFrogs.find(f => f.isQueen)! } color={ player.color } animation="blinking" />
                <FrogAnimation css={ frogImageRight } visible={ true } frog={ player.femaleFrogs.find(f => !f.isQueen)! } color={ player.color } animation="blinking" />
                <p>{t('You play {color} frogs. Have fun!', {color: getPlayerName(player.color, t) })}</p>
                <Button css={ welcomeButton } color={ player.color } onClick={close}>{t('OK')}</Button>
            </div>
        </div>
    )
}

const frogImage = css`
  position: absolute;
  bottom: 25%;
  margin: 0;
  left: 10%;
  width: 10%;
  height: 50%;
`

const frogImageRight = css`
  position: absolute;
  bottom: 25%;
  right: 13%;
  margin: 0;
  left: unset;
  width: 6%;
  height: 29%;
  transform: rotateY(180deg);
`

const welcomeButton = css`
  width: 20%;
  height: 4.5em;
  margin-left: 40%;
`;

const style = css`
  background-color: transparent;
`;

export default WelcomePopup