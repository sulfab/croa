import { css } from '@emotion/react';
import { Player, PlayerColor } from '@gamepark/croa/player';
import Avatar from 'avataaars';
import { CSSProperties, FC, HTMLAttributes } from 'react';
import { Images } from '../Resources';

type CroaAvatarProps = {
    player: Player
    playerInfo?: any,
    customStyle?: CSSProperties,
    color?: PlayerColor
} & Omit<HTMLAttributes<HTMLImageElement>, 'color'>

const CroaAvatar: FC<CroaAvatarProps> = ({ player, customStyle, playerInfo, color, ...props }) => {

    if (playerInfo?.avatar) {
        return <Avatar  style={{ ...avatarStyle, ...customStyle }} avatarStyle="Circle" {...playerInfo?.avatar} />
    }

    return <img { ...props } alt={'Player board'} src={playerDefaultImages.get(color || player.color)} css={[defaultAvatarStyle]} draggable="false"/>;
};

const avatarStyle: CSSProperties = {
  position: 'absolute',
  borderRadius: '100%'
};

const defaultAvatarStyle = css`
    height: 29%;
    width: 18.5%;
`;

const playerDefaultImages = new Map<PlayerColor, any>();
playerDefaultImages.set(PlayerColor.Blue, Images.DefaultBlueAvatar);
playerDefaultImages.set(PlayerColor.Green, Images.DefaultGreenAvatar);
playerDefaultImages.set(PlayerColor.Red, Images.DefaultRedAvatar);
playerDefaultImages.set(PlayerColor.Pink, Images.DefaultPinkAvatar);

export {
    CroaAvatar
}