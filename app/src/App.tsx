import { GameState } from '@gamepark/croa/GameState'
import { useGame} from '@gamepark/react-client'
import { LoadingScreen } from '@gamepark/react-components'
import { useEffect, useState } from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import GameDisplay from './GameDisplay'
import CroaBox from './material/visuals/croa-box.png';
import { Images, AnimationTexts, AnimationTextures } from './material/Resources'
import ImagesLoader from './utils/ImagesLoader'
import Header from './Header'
import { css } from '@emotion/react';

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
      <LoadingScreen display={loading} gameBox={ CroaBox } author="Igor Polouchine" artist={["Claire Wendling", "David Cochard"]} publisher="Origames" css={ css`font-weight:normal;` }  />
      {!loading && <GameDisplay game={game}/>}
      <Header loading={loading} game={game}/>
      <ImagesLoader images={Object.values(Images)} animationTexts={ AnimationTexts } animationTextures={ AnimationTextures } onImagesLoad={() => setImagesLoading(false)}/>
    </DndProvider>
  )
}