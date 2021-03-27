import { Player } from "../player";


const isGameOver = (players: Array<Player>) => players.filter(player => !player.eliminated).length === 1; 

export {
    isGameOver
}