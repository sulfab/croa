import { css } from '@emotion/react';
import { Player, PlayerColor } from '@gamepark/croa/player';
import Avatar from 'avataaars';
import { CSSProperties, FC, HTMLAttributes } from 'react';
import { Images } from '../Resources';

type CroaAvatarProps = {
    player: Player
    playerInfo?: any,
    customStyle?: CSSProperties
} & HTMLAttributes<HTMLImageElement>

const CroaAvatar: FC<CroaAvatarProps> = ({ player, customStyle, playerInfo, ...props }) => {

    if (playerInfo?.avatar) {
        return <Avatar  style={{ ...avatarStyle, ...customStyle }} avatarStyle="Circle" {...playerInfo?.avatar} />
    }

    return <img { ...props } alt={'Player board'} src={playerDefaultImages.get(player.color)} css={[avatarImage, defaultAvatarStyle]} draggable="false"/>;
};

const avatarImage = css`
  position: absolute;
  height: 20%;
  top: 7%;
  left: 5%;
  border-radius: 100%;
`;

const avatarStyle: CSSProperties = {
  position: 'absolute',
  height: '30%',
  top: '-10%',
  width: '20%',
  left: '-4%',
  filter: 'drop-shadow(0 0.1em 0.3em black)',
  borderRadius: '100%'
};

const defaultAvatarStyle = css`
    height: 29%;
    width: 18.5%;
    top: -10%;
    left: -4%;
`;

const playerDefaultImages = new Map<PlayerColor, any>();
playerDefaultImages.set(PlayerColor.Blue, Images.DefaultBlueAvatar);
playerDefaultImages.set(PlayerColor.Green, Images.DefaultGreenAvatar);
playerDefaultImages.set(PlayerColor.Red, Images.DefaultRedAvatar);
playerDefaultImages.set(PlayerColor.Pink, Images.DefaultPinkAvatar);

export {
    CroaAvatar
}