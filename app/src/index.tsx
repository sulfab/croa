import {css, Global} from '@emotion/react'
import Croa from '@gamepark/croa/Croa';
import { CroaOptionsDescription } from '@gamepark/croa/CroaOptions';
import { CroaAnimation } from './Animations';
import CroaView from '@gamepark/croa/CroaView';
import { GameProvider, setupTranslation} from '@gamepark/react-client'
import normalize from 'emotion-normalize'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Images } from './material/Resources'
import translations from './translations.json'

setupTranslation(translations);

const style = css`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  *, *::before, *::after {
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

ReactDOM.render(
  <React.StrictMode>
    <GameProvider game="croa" Rules={ Croa } RulesView={ CroaView } animations={ CroaAnimation } optionsDescription={ CroaOptionsDescription }>
      <App/>
    </GameProvider>
    <Global styles={[normalize, style]}/>
  </React.StrictMode>,
  document.getElementById('root')
)
