import { css } from '@emotion/react';
import { Player, PlayerColor } from '@gamepark/croa/player';
import { FC, HTMLAttributes } from 'react';
import { Images } from '../Resources';
import { Avatar } from '@gamepark/react-client';
import { SpeechBubbleDirection } from '@gamepark/react-client/dist/Avatar';

type CroaAvatarProps = {
    player: Player
    playerInfo?: any,
    color?: PlayerColor
    speechBubbleDirection?: SpeechBubbleDirection
} & Omit<HTMLAttributes<HTMLElement>, 'color'>

const CroaAvatar: FC<CroaAvatarProps> = ({player, playerInfo, color, speechBubbleDirection, ...props}) => {

    if (playerInfo?.avatar) {
        return <Avatar {...props} css={avatarCss} playerId={player.color} speechBubbleProps={{direction: speechBubbleDirection}}/>
    }

    return <img {...props} alt={'Player board'} src={playerDefaultImages.get(color || player.color)} css={defaultAvatarStyle} draggable="false"/>;
};

const avatarCss = css`
  font-family: 'News Cycle', sans-serif;
  color: black;
  > p {
    filter: drop-shadow(0.1em 0.1em black);
  }
`

const defaultAvatarStyle = css`
  position: absolute;
  height: 130%;
  top: -28%;
  left: -6%;
  width: 109%;
`;

const playerDefaultImages = new Map<PlayerColor, any>();
playerDefaultImages.set(PlayerColor.Blue, Images.DefaultBlueAvatar);
playerDefaultImages.set(PlayerColor.Green, Images.DefaultGreenAvatar);
playerDefaultImages.set(PlayerColor.Red, Images.DefaultRedAvatar);
playerDefaultImages.set(PlayerColor.Pink, Images.DefaultPinkAvatar);

export {
    CroaAvatar
}