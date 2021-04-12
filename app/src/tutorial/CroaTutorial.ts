import { GameState } from '@gamepark/croa/GameState';
import { Move, moveFrogMove } from '@gamepark/croa/moves';
import { initializePlayerBoard, PlayerColor } from '@gamepark/croa/player';
import { pond, SlabBackType, SlabFrontType } from '@gamepark/croa/pond';
import { shuffleSlabs } from '@gamepark/croa/utils';
import { TutorialDescription } from '@gamepark/react-client';


const tilesToPlace: Array<{ front: SlabFrontType, back: SlabBackType, x: number, y: number }> = [
    // Servant diagonals
    { front: SlabFrontType.Reed,       back: SlabBackType.Deep, x: 1, y: 2 },
    { front: SlabFrontType.WaterLily,  back: SlabBackType.Deep, x: 2, y: 3 },
    { front: SlabFrontType.Mud,        back: SlabBackType.Deep, x: 3, y: 4 },
    { front: SlabFrontType.Log,        back: SlabBackType.Deep, x: 4, y: 5 },
    { front: SlabFrontType.Reed,       back: SlabBackType.Deep, x: 5, y: 6 },
    { front: SlabFrontType.Reed,       back: SlabBackType.Deep, x: 7, y: 6 },

    // Queen tiles
    { front: SlabFrontType.RedMale,    back: SlabBackType.Deep, x: 1, y: 1 },

    // Other servants
    { front: SlabFrontType.Mosquito, back: SlabBackType.Deep, x: 2, y: 1 },
    { front: SlabFrontType.Mosquito, back: SlabBackType.Deep, x: 3, y: 5 },
    { front: SlabFrontType.Mosquito, back: SlabBackType.Deep, x: 0, y: 2 },

    // Pike on opponent
    { front: SlabFrontType.Pike,     back: SlabBackType.Deep, x: 7, y: 5 }
]


const shuffledPond = shuffleSlabs(pond, 8).map((row, x) => row.map((tile, y) => {
    const newTile = tilesToPlace.find(tile => tile.x === x && tile.y === y);
    if (newTile) {
        return {
            front: newTile.front,
            back: newTile.back
        }
    }

    return tile;
}));

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