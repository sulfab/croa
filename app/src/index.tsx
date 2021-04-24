import Croa from '@gamepark/croa/Croa';
import { CroaOptionsDescription } from '@gamepark/croa/CroaOptions';
import { CroaAnimation } from './Animations';
import CroaView from '@gamepark/croa/CroaView';
import { GameProvider, setupTranslation } from '@gamepark/react-client';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import translations from './translations.json';
import { CroaTutorial } from './tutorial/CroaTutorial';
import { ai } from './tutorial/ai/TutorialAI.worker';

setupTranslation(translations);

ReactDOM.render(
  <React.StrictMode>
    <GameProvider 
        game="croa"
        Rules={ Croa }
        RulesView={ CroaView }
        tutorial={ CroaTutorial }
        animations={ CroaAnimation } 
        optionsDescription={ CroaOptionsDescription }
        ai={ ai }>
      <App/>
    </GameProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
