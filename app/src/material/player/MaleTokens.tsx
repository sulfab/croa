import { css, keyframes } from '@emotion/react';
import { MaleFrog, maleFrogs } from '@gamepark/croa/frog';
import { isAcquireServant } from '@gamepark/croa/moves';
import { Player, PlayerColor } from '@gamepark/croa/player';
import { useAnimation } from '@gamepark/react-client';
import { FC, HTMLAttributes } from 'react';
import { playerBoardMaleTokensWidth } from '../../utils/Styles';
import { Images } from '../Resources';

type MaleTokensProps = {
  player: Player
  color?: PlayerColor
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'>

export const MaleTokens: FC<MaleTokensProps> = ({player, color, ...props}) => {
  const animation = useAnimation(animation => isAcquireServant(animation.move) && animation.move.playerId === player.color);
  const displayedColor = color || player.color;
  const playerMaleTokens = maleToken.get(displayedColor);
  return (
    <div {...props}>
      {
        maleFrogs.map((male, index) => {
          return (
            <div key={`${male}`} css={[maleTokenContainer(index), (animation && animation.move.male === male) && maleTokenToTop]}>
              <div css={[
                maleTokenStyle,
                (!player.maleFrogs.includes(male) && !animation) && flipped,
                (animation && animation.move.male === male) && maleFrogAnimation(animation.duration),
              ]}>
                <img css={[maleTokenBackFace]} alt={'test'} src={maleToken.get(PlayerColor.Green)!.get(male)}/>
                <img css={[maleTokenFrontFace]} alt={'test'} src={playerMaleTokens!.get(male)}/>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

const maleTokenContainer = (index: number) => css`
  position: absolute;
  height: 100%;
  width: ${playerBoardMaleTokensWidth}%;
  transform: translateX(${(playerBoardMaleTokensWidth * index + ((100 - playerBoardMaleTokensWidth * 6) / 7 * (index + 1))) * 100 / playerBoardMaleTokensWidth}%);
  filter: drop-shadow(0.1em 0.1em 0.3em black);
`;

const maleTokenToTop = css`
  z-index: 2;
  background-attachment: scroll;
`;

const maleTokenStyle = css`
  height: 100%;
  width: 100%;
  transform-style: preserve-3d;
`;

const maleTokenBackFace = css`
  -webkit-tap-highlight-color: transparent;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  border-radius: 15%;
  image-rendering: -webkit-optimize-contrast;
  background-size: 100% 100%;
  filter: grayscale(100%);
`;

const maleTokenFrontFace = css`
  -webkit-tap-highlight-color: transparent;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15%;
  image-rendering: -webkit-optimize-contrast;
  background-size: 100% 100%;
`;

const flipped = css`
  transform: rotateY(180deg);
`;

const maleFrogScale = keyframes`
  30% {        
    transform: scale(2.0);
  }
  50% {        
    transform: rotateY(180deg) scale(2.0);
  }
  100% {           
    transform: rotateY(180deg) scale(1.0);
  }
`;

const maleFrogAnimation = (duration: number) => css`
  animation-name: ${maleFrogScale};
  animation-duration: ${duration}s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
`;

const maleToken = new Map<PlayerColor, Map<MaleFrog, any>>();
maleToken.set(PlayerColor.Blue, new Map([
  [MaleFrog.Blue, Images.BlueMaleTokenBlue],
  [MaleFrog.Red, Images.RedMaleTokenBlue],
  [MaleFrog.Pink, Images.PinkMaleTokenBlue],
  [MaleFrog.Green, Images.GreenMaleTokenBlue],
  [MaleFrog.Yellow, Images.YellowMaleTokenBlue],
  [MaleFrog.Purple, Images.PurpleMaleTokenBlue]
]));

maleToken.set(PlayerColor.Green, new Map([
  [MaleFrog.Blue, Images.BlueMaleTokenGreen],
  [MaleFrog.Red, Images.RedMaleTokenGreen],
  [MaleFrog.Pink, Images.PinkMaleTokenGreen],
  [MaleFrog.Green, Images.GreenMaleTokenGreen],
  [MaleFrog.Yellow, Images.YellowMaleTokenGreen],
  [MaleFrog.Purple, Images.PurpleMaleTokenGreen]
]));


maleToken.set(PlayerColor.Pink, new Map([
  [MaleFrog.Blue, Images.BlueMaleTokenPink],
  [MaleFrog.Red, Images.RedMaleTokenPink],
  [MaleFrog.Pink, Images.PinkMaleTokenPink],
  [MaleFrog.Green, Images.GreenMaleTokenPink],
  [MaleFrog.Yellow, Images.YellowMaleTokenPink],
  [MaleFrog.Purple, Images.PurpleMaleTokenPink]
]));

maleToken.set(PlayerColor.Red, new Map([
  [MaleFrog.Blue, Images.BlueMaleTokenRed],
  [MaleFrog.Red, Images.RedMaleTokenRed],
  [MaleFrog.Pink, Images.PinkMaleTokenRed],
  [MaleFrog.Green, Images.GreenMaleTokenRed],
  [MaleFrog.Yellow, Images.YellowMaleTokenRed],
  [MaleFrog.Purple, Images.PurpleMaleTokenRed]
]));