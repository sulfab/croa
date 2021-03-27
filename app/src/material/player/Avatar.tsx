import { css } from '@emotion/react';
import { Player, PlayerColor } from '@gamepark/croa/player';
import { Avatar } from 'avataaars';
import { FC } from 'react';
import { Images } from '../Resources';

type CroaAvatarProps = {
    player: Player
    playerInfo?: any
}

const CroaAvatar: FC<CroaAvatarProps> = ({ player, playerInfo }) => {

    if (playerInfo?.avatar) {
        return <Avatar style={avatarStyle} avatarStyle="Circle" {...playerInfo?.avatar}/>
    }

    return <img alt={'Player board'} src={playerDefaultImages.get(player.color)} css={[avatarStyle, defaultAvatarStyle]} draggable="false"/>;
};

const avatarStyle = css`
  position: absolute;
  height: 20%;
  top: 7%;
  left: 5%;
  border-radius: 100%;
`;

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