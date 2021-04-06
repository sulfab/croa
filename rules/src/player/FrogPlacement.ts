import { Position } from '../common/Position';
import { FemaleFrog, FrogStatus, MaleFrog } from '../frog';
import { Player } from './Player';
import { PlayerColor } from './PlayerColor';

export type QueenInit = {
    id: number,
    isQueen: boolean,
    position: Position
}


export const FrogPlacement: { [key: number]: { [key: number]: { currentPlayerRotation: number, frogs: Array<QueenInit> }}} = {  
    // 2 Players    
    [2]: {
        [0]: {
            currentPlayerRotation: 1,
            frogs: [
                { id: 1, isQueen: true, position: { x: 0, y: 0 } },
                { id: 2, isQueen: false, position: { x: 1, y: 0 } },
                { id: 3, isQueen: false, position: { x: 0, y: 1 } }
            ]   
        },
        [1]: {
            currentPlayerRotation: 3,
            frogs: [
                { id: 1, isQueen: true, position: { x: 7, y: 7 } },
                { id: 2, isQueen: false, position: { x: 7, y: 6 } },
                { id: 3, isQueen: false, position: { x: 6, y: 7 } }
            ]
        },
    },
    [3]: {
        [0]: {
            currentPlayerRotation: 1,
            frogs: [
                { id: 1, isQueen: true, position: { x: 0, y: 0 } },
                { id: 2, isQueen: false, position: { x: 1, y: 0 } },
                { id: 3, isQueen: false, position: { x: 0, y: 1 } }
            ]
        },
        [1]: {
            currentPlayerRotation: 2,
            frogs: [
                { id: 1, isQueen: true, position: { x: 7, y: 4 } },
                { id: 2, isQueen: false, position: { x: 6, y: 3 } },
                { id: 3, isQueen: false, position: { x: 6, y: 5 } }
            ]
        },
        [2]: {
            currentPlayerRotation: 0,
            frogs: [
                { id: 1, isQueen: true, position: { x: 0, y: 7 } },
                { id: 2, isQueen: false, position: { x: 0, y: 6  } },
                { id: 3, isQueen: false, position: { x: 1, y: 7 } }
            ]
        }
    },
    [4]: {
        [0]: {
            currentPlayerRotation: 1,
            frogs: [
                { id: 1, isQueen: true, position: { x: 0, y: 0 } },
                { id: 2, isQueen: false, position: { x: 1, y: 0 } },
                { id: 3, isQueen: false, position: { x: 0, y: 1 } }
            ]
        },
        [1]: {
            currentPlayerRotation: 2,
            frogs: [
                { id: 1, isQueen: true, position: { x: 7, y: 0 } },
                { id: 2, isQueen: false, position: { x: 6, y: 0 } },
                { id: 3, isQueen: false, position: { x: 7, y: 1 } }
            ]
        },
        [2]: {
            currentPlayerRotation: 3,
            frogs: [
                { id: 1, isQueen: true, position: { x: 7, y: 7 } },
                { id: 2, isQueen: false, position: { x: 7, y: 6 } },
                { id: 3, isQueen: false, position: { x: 6, y: 7 } }
            ]
        },
        [3]: {
            currentPlayerRotation: 0,
            frogs: [
                { id: 1, isQueen: true, position: { x: 0, y: 7 } },
                { id: 2, isQueen: false, position: { x: 0, y: 6  } },
                { id: 3, isQueen: false, position: { x: 1, y: 7 } }
            ]
        }

    }
}

  /**
   * Initialize player material
   * 
   */
  export function initializePlayerBoard (playerCount: number, playerIndex: number, color: PlayerColor): Player {
    return { 
      color: color, 
      maleFrogs: [MaleFrog.Blue, MaleFrog.Pink, MaleFrog.Purple, MaleFrog.Red, MaleFrog.Yellow, MaleFrog.Green], 
      femaleFrogs: getFrogPositions(playerCount, playerIndex, color).concat(
        { id: 4, isQueen: false, color }, 
        { id: 5, isQueen: false, color }, 
        { id: 6, isQueen: false, color }, 
        { id: 7, isQueen: false, color }
      ).map(frog => ({ ...frog, status: FrogStatus.Ready, previousPosition: frog.position})),
      eliminationChoice: [],
      done: false
    }
  }

  export function getFrogPositions (playerCount: number, playerIndex: number, color: PlayerColor): Array<Omit<FemaleFrog, 'status'>> {
    return FrogPlacement[playerCount][playerIndex].frogs.map(f => ({
        ...f,
        color
    }));
  }