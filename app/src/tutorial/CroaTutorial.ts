import { GameState } from '@gamepark/croa/GameState';
import { Move, moveFrogMove } from '@gamepark/croa/moves';
import { initializePlayerBoard, PlayerColor } from '@gamepark/croa/player';
import { pond, SlabFrontType } from '@gamepark/croa/pond';
import { shuffleSlabs } from '@gamepark/croa/utils';
import { TutorialDescription } from '@gamepark/react-client';
import { Position } from '@gamepark/croa/dist/common/Position';


const tilesToPlace: Array<{ front: SlabFrontType, x: number, y: number }> = [
    // Servant diagonals
    { front: SlabFrontType.Reed, x: 1, y: 2 },
    { front: SlabFrontType.WaterLily, x: 2, y: 3 },
    { front: SlabFrontType.Mud, x: 3, y: 4 },
    { front: SlabFrontType.Log, x: 4, y: 5 },
    { front: SlabFrontType.Reed, x: 5, y: 6 },
    { front: SlabFrontType.BlueMale, x: 7, y: 6 },

    // Queen tiles
    { front: SlabFrontType.RedMale, x: 1, y: 1 },

    // Other servants
    { front: SlabFrontType.Mosquito, x: 2, y: 1 },
    { front: SlabFrontType.Mosquito, x: 3, y: 5 },
    { front: SlabFrontType.Mosquito, x: 0, y: 2 },

    // Pike on opponent
    { front: SlabFrontType.Pike, x: 7, y: 5 }
]


const shuffledPond = shuffleSlabs(pond, 8);

tilesToPlace.forEach(tile => {
    let replacingPosition: Position | undefined;
    shuffledPond.forEach((row, rowIndex) =>
      row.forEach((t, columnIndex) => {
          if (t.front === tile.front && !tilesToPlace.some(tileToPlace => tileToPlace.x === rowIndex && tileToPlace.y === columnIndex)) {
              replacingPosition = {x: rowIndex, y: columnIndex};
          }
      })
    );

    if (!replacingPosition) {
        throw new Error("Impossible to build the tutorial");
    }

    const tempTile = shuffledPond[tile.x][tile.y];
    shuffledPond[tile.x][tile.y] =  shuffledPond[replacingPosition.x][replacingPosition.y];
    shuffledPond[replacingPosition.x][replacingPosition.y] = tempTile;
});

const CroaTutorial: TutorialDescription<GameState, Move, PlayerColor> = {

    setupTutorial: () => [
        {
            players: [PlayerColor.Blue, PlayerColor.Pink].map((p, index) => initializePlayerBoard(2, index, p)), 
            pond: shuffledPond,
            activePlayer: PlayerColor.Blue
        }, [PlayerColor.Blue, PlayerColor.Pink]],
    expectedMoves: () => [
        // Moves on reed
        moveFrogMove(3, PlayerColor.Blue, { x: 1, y: 2 }),
        moveFrogMove(3, PlayerColor.Pink, { x: 5, y: 6 }),

        // Player servant bouncing on mud
        moveFrogMove(3, PlayerColor.Blue, { x: 2, y: 3 }),
        moveFrogMove(3, PlayerColor.Blue, { x: 3, y: 4 }),

        // Opponent frog pike
        moveFrogMove(2, PlayerColor.Pink, { x: 7, y: 5 }),

        // Player other servant mosquito and queen male
        moveFrogMove(2, PlayerColor.Blue, { x: 2, y: 1 }),
        moveFrogMove(1, PlayerColor.Blue, { x: 1, y: 1 }),

        // Opponent servant on log
        moveFrogMove(3, PlayerColor.Pink, { x: 4, y: 5 }),

        // Move player new servant on mosquito
        moveFrogMove(4, PlayerColor.Blue, { x: 0, y: 2 }),

        // Move bogged frog to log
        moveFrogMove(3, PlayerColor.Blue, { x: 4, y: 5 }),

        // Move opponent frog from log to mosquito
        moveFrogMove(3, PlayerColor.Pink, { x: 3, y: 5 }),

        // THen move queen to reed
        moveFrogMove(1, PlayerColor.Pink, { x: 7, y: 6 }),

        // Kill the opponent servant
        moveFrogMove(3, PlayerColor.Blue, { x: 3, y: 5 })
    ]
}

export {
    CroaTutorial
};