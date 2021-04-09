import { GameState } from '@gamepark/croa/GameState'
import { FailuresDialog, FullscreenDialog, Menu, useGame } from '@gamepark/react-client';
import { LoadingScreen } from '@gamepark/react-components'
import { useEffect, useState } from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import { GameDisplay } from './GameDisplay'
import CroaBox from './material/visuals/croa-box.png';
import { Images} from './material/Resources'
import ImagesLoader from './utils/ImagesLoader'
import Header from './Header'
import { css } from '@emotion/react';
import { popupLightStyle, popupStyle } from './utils/Styles';

export default function App() {
  const game = useGame<GameState>()

  const [isJustDisplayed, setJustDisplayed] = useState(true);
  const [isImagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])

  const loading = !game || isImagesLoading || isJustDisplayed;

  return (
    <DndProvider options={HTML5ToTouch}>
      <LoadingScreen display={loading} gameBox={ CroaBox } author="Igor Polouchine" artist={["Claire Wendling", "David Cochard"]} publisher="Origames" css={ css`font-weight:normal; letter-spacing: 0.15em;` }  />
      {!loading && <GameDisplay game={game!}/>}
      <Header loading={loading} game={game!}/>
      <FailuresDialog css={ [popupStyle, popupLightStyle, failuresStyle] }/>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
      <Menu/>
      <FullscreenDialog/>
    </DndProvider>
  )
}

const failuresStyle = css`
  font-size: 1em;
  width: 70%;
  h2 {
    font-family: "Ranchers", cursive;
  }
`;