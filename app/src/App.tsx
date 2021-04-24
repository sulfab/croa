import { GameState } from '@gamepark/croa/GameState';
import { FailuresDialog, FullscreenDialog, Menu, useGame } from '@gamepark/react-client';
import { LoadingScreen } from '@gamepark/react-components';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { GameDisplay } from './GameDisplay';
import CroaBox from './material/visuals/croa-box.png';
import { Images, Sounds } from './material/Resources';
import ImagesLoader from './utils/ImagesLoader';
import Header from './Header';
import { css, Global } from '@emotion/react';
import { popupLightStyle, popupStyle } from './utils/Styles';
import normalize from 'emotion-normalize';
import { SoundLoader } from './utils/SoundLoader';
import { AudioLoader } from './utils/AudioLoader';

export default function App() {
  const game = useGame<GameState>()
  const [audioLoader, setAudioLoader] = useState<AudioLoader>()

  const [isJustDisplayed, setJustDisplayed] = useState(true);
  const [isImagesLoading, setImagesLoading] = useState(true);
  const [isSoundsLoading, setSoundLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, []);

  const loading = !game || isImagesLoading || isSoundsLoading || isJustDisplayed;

  return (
    <DndProvider options={HTML5ToTouch}>
      <Global styles={[normalize, style]}/>
      <LoadingScreen display={loading} gameBox={ CroaBox } author="Igor Polouchine" artist={["Claire Wendling", "David Cochard"]} publisher="Origames" css={ css`font-weight:normal; letter-spacing: 0.15em;` }  />
      {!loading && audioLoader && <GameDisplay game={game!} audioLoader={ audioLoader }/>}
      <Header loading={loading} game={game!}/>
      <FailuresDialog css={ [popupStyle, popupLightStyle, failuresStyle] }/>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
      <SoundLoader sounds={Object.values(Sounds)} onSoundsLoad={ () => setSoundLoading(false) } onSoundsPrepared={ (audioLoader) => setAudioLoader(audioLoader) } />
      <Menu/>
      <FullscreenDialog/>
    </DndProvider>
  )
}

const failuresStyle = css`
  font-size: 1em !important;
  width: 70%;
  h2 {
    font-family: "Ranchers", cursive;
  }
`;

const style = css`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  * {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }

  body {
    margin: 0;
    font-family: "Ranchers", cursive;
    font-size: 1vh;
    @media (max-aspect-ratio: 16/9) {
      font-size: calc(9vw / 16);
    }
  }

  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-color: white;
    background-size: cover;
    background-position: center;
    color: #eee;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    
    background-image: url(${Images.BoardBackground});
  }
`