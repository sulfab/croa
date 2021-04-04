import { GameState } from '@gamepark/croa/GameState';
import { Move, moveFrogMove } from '@gamepark/croa/moves';
import { initializePlayerBoard, PlayerColor } from '@gamepark/croa/player';
import { pond, SlabBackType, SlabFrontType } from '@gamepark/croa/pond';
import { shuffleSlabs } from '@gamepark/croa/utils';
import { Tutorial } from '@gamepark/react-client';

const tilesToPlace: Array<{ tile: SlabFrontType, x: number, y: number }> = [
    { tile: SlabFrontType.WaterLily, x: 1, y: 1 },
    { tile: SlabFrontType.Mosquito, x: 2, y: 2 },
    { tile: SlabFrontType.Reed, x: 0, y: 2 },
    { tile: SlabFrontType.Reed, x: 3, y: 3 },
    { tile: SlabFrontType.PurpleMale, x: 4, y: 4 },
    { tile: SlabFrontType.WaterLily, x: 5, y: 5 },
    { tile: SlabFrontType.WaterLily, x: 6, y: 6 },
    { tile: SlabFrontType.Pike, x: 7, y: 5 }
]


const shuffledPond = shuffleSlabs(pond, 8).map((row, x) => row.map((tile, y) => {
    const newTile = tilesToPlace.find(tile => tile.x === x && tile.y === y);
    if (newTile) {
        return {
            front: newTile.tile,
            back: newTile.x % 2 === 0? SlabBackType.Deep: SlabBackType.Shallow
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