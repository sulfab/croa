import { GameState } from '@gamepark/croa/GameState';
import { Move, moveFrogMove } from '@gamepark/croa/moves';
import { initializePlayerBoard, PlayerColor } from '@gamepark/croa/player';
import { pond, SlabBackType, SlabFrontType } from '@gamepark/croa/pond';
import { shuffleSlabs } from '@gamepark/croa/utils';
import { Tutorial } from '@gamepark/react-client';

const tilesToPlace: Array<{ front: SlabFrontType, back: SlabBackType, x: number, y: number }> = [
    { front: SlabFrontType.WaterLily, back: SlabBackType.Deep, x: 1, y: 1 },
    { front: SlabFrontType.Mosquito, back: SlabBackType.Shallow, x: 2, y: 2 },
    { front: SlabFrontType.Reed, back: SlabBackType.Deep, x: 0, y: 2 },
    { front: SlabFrontType.Reed, back: SlabBackType.Shallow, x: 3, y: 3 },
    { front: SlabFrontType.PurpleMale, back: SlabBackType.Deep, x: 4, y: 4 },
    { front: SlabFrontType.WaterLily, back: SlabBackType.Shallow, x: 5, y: 5 },
    { front: SlabFrontType.WaterLily, back: SlabBackType.Deep, x: 6, y: 6 },
    { front: SlabFrontType.Pike, back: SlabBackType.Deep, x: 7, y: 5 }
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

const CroaTutorial: Tutorial<GameState, Move, PlayerColor> = {

    setupTutorial: () => [
        {
            players: [PlayerColor.Blue, PlayerColor.Pink].map((p, index) => initializePlayerBoard(2, index, p)), 
            pond: shuffledPond, 
            tutorial: true,
            activePlayer: PlayerColor.Blue
        }, [PlayerColor.Blue, PlayerColor.Pink]],
    expectedMoves: () => [
        moveFrogMove(1, PlayerColor.Blue, { x: 1, y: 1 }),
        moveFrogMove(1, PlayerColor.Blue, { x: 2, y: 2 }),
        moveFrogMove(3, PlayerColor.Blue, { x: 0, y: 2 }),
        moveFrogMove(2, PlayerColor.Pink, { x: 7, y: 5 }),
        moveFrogMove(1, PlayerColor.Blue, { x: 3, y: 3 }),
        moveFrogMove(1, PlayerColor.Pink, { x: 6, y: 6 }),
        moveFrogMove(1, PlayerColor.Pink, { x: 5, y: 5 }),
        moveFrogMove(1, PlayerColor.Pink, { x: 4, y: 4 }),
        moveFrogMove(1, PlayerColor.Blue, { x: 4, y: 4 })
    ]
}

export {
    CroaTutorial
};