import { IncompleteInformation, SequentialGame} from '@gamepark/rules-api';
import { FemaleFrog } from './frog';
import { GameState, GameStateView } from './GameState';
import { Move, MoveType, eliminateFrog, playSlab, MoveView, skipTurn, frogBirth, revealSlabMove } from './moves';
import { eliminateFrogAction, moveFrogAction, frogBirthAction, playSlabEffectAction, skipTurnAction, revealSlab } from './action';
import { Player, PlayerColor } from './player';
import { initializePlayerBoard } from './player/FrogPlacement';
import { pond, Slab, isKnownSlab } from './pond';
import { allowFrogMove, shuffleSlabs } from './utils';
import { CroaOptions, isGameOptions } from './CroaOptions';

const defaultBoardSize = 8;

export default class Croa extends SequentialGame<GameState, Move, PlayerColor> implements IncompleteInformation<GameState, GameStateView, Move, MoveView, PlayerColor>  {
  constructor(state: GameState) // from saved state
  constructor(options: CroaOptions)
  constructor(arg: GameState | CroaOptions) {
    if (isGameOptions(arg)) {
      super({
        activePlayer: PlayerColor.Blue,
        players: arg.players.map((player, index) => initializePlayerBoard(4, index, player.id)), 
        pond: shuffleSlabs(pond, defaultBoardSize),
        round: 1,
      })
    } else {
      super(arg)
    }
  }  

  /**
   * Players ids are the player color
   */
  getPlayerIds(): PlayerColor[] {
    return this.state.players.map(player => player.color)
  }

  /**
   * The player id is directly set in the state in order to simplify the management
   */
  getActivePlayer(): PlayerColor | undefined {
    // The game ends when there is only one player that has its queen frog in game.
    if (this.state.players.filter(p => p.femaleFrogs.some(f => f.isQueen && !!f.position)).length > 1) {
      return this.state.activePlayer;
    }
    
    return undefined;// Undefined = end of the game. Return the id of current active player depending on this.state otherwise
  }

  /**
   * Current player authorized moves
   */
  getLegalMoves(): Move[] {
    const player = this.state.players.find(player => player.color === this.state.activePlayer);
    if (!player || player.eliminated) {
      return [];
    }

    const moves: Array<Move> = [];

    // Player elimination choice
    if (player.eliminationChoice && player.eliminationChoice.length > 1) {
      player.eliminationChoice.forEach(frog => moves.push(eliminateFrog({ color: frog.color, id: frog.id })))
    }
    
    // By default, mudded or stung frogs can't be moved
    let movableFrogs = player.femaleFrogs.filter(frog => !!frog.position && !frog.mudded && !frog.stung);

    // If there is a boucing frog, only this can be moved
    const boucingFrog: FemaleFrog | undefined = player.femaleFrogs.find(frog => frog.bouncing);
    if (boucingFrog) {
      movableFrogs = [boucingFrog];
    } else {
      const queenFrog = movableFrogs.find(frog => frog.isQueen)
      if (queenFrog) {
        const servantFrogsOnSlab = movableFrogs
          .filter(frog => frog.id !== queenFrog.id && frog.position!.x === queenFrog.position!.x && frog.position!.y === queenFrog.position!.y)
  
        // If there is a queen frog and servants on the same slab, only one of them must be moved
        if (servantFrogsOnSlab && servantFrogsOnSlab.length) {
          movableFrogs = [queenFrog, ...servantFrogsOnSlab];
        }
      }
    }

    const allFrogs = this.state.players.flatMap(player => player.femaleFrogs.filter(frog => !!frog.position));
    movableFrogs
      .filter(frog => !!frog.position)  
      .forEach(frog => {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
              if (!frog.bouncing || (frog.previousPosition && (frog.previousPosition.x !== frog.position!.x + i || frog.previousPosition.y !== frog.position!.y + j))) {
                allowFrogMove(allFrogs, frog, { x: i, y: j }, this.state.pond, moves, defaultBoardSize);
              }
            }
          }
        }
      })

    return moves; // return all the moves that active player is allowed to play depending on current this.state
  }

  getAutomaticMove(): Move | void {


    // If the tile is not known, reveal the tile, instead play the tile
    const lastFrogPlayed: FemaleFrog | undefined = this.state.players.flatMap(p => p.femaleFrogs).find(f => f.hasMoved);
    if (lastFrogPlayed && lastFrogPlayed.position) {
      const slabToPlay: Slab | Pick<Slab, 'back'> | undefined = this.state.pond[lastFrogPlayed.position.x][lastFrogPlayed.position.y] 
      if (slabToPlay && isKnownSlab(slabToPlay)) {

        //First trigger the slab display
        if (!slabToPlay.displayed) {
          return revealSlabMove(lastFrogPlayed.position);
        }
      }
    }
    
    return getPredictableAutomaticMoves(this.state);
  }

  play(move: Move): void {
    switch(move.type) {
      case MoveType.MoveFrog:
        moveFrogAction(this.state, move);
        break;
      case MoveType.EliminateFrog:
        eliminateFrogAction(this.state, move);
        break;
      case MoveType.PlaySlabEffect:
        playSlabEffectAction(this.state, move);
        break;
      case MoveType.RevealSlab:
        revealSlab(this.state, move)
        break;
      case MoveType.FrogBirth:
        frogBirthAction(this.state, move);
        break;
      case MoveType.SkipTurn:
        skipTurnAction(this.state, move);
        break;
    }
  }  
  
  getView(): GameStateView {
    return {
      ...this.state, 
      pond: this.state.pond.map(rowSlabs => rowSlabs.map(slab => slab.displayed? slab: { back: slab.back }))
    };
  }

  getMoveView(move: Move): MoveView {
    switch(move.type) {
      case MoveType.RevealSlab:
        return {
          ...move,
          front: (this.state.pond[move.slabPosition.x][move.slabPosition.y] as Slab).front
        }
    }

    return move;  
  }
}
export function getPredictableAutomaticMoves(state: GameState | GameStateView): Move & MoveView | void {

  // If player has only a stung frog, pass its turn

  // If player has at least one frog on board and all its frog are mudded or stung, skip turn
  // Improve by asking the player to pass instead of doing it automatically
  const blockedPlayer: Player | undefined = state.players.find(player => 
    player.femaleFrogs.some(frog => !!frog.position) && player.femaleFrogs.filter(frog => !!frog.position).every(frog => frog.mudded || frog.stung));
  if (blockedPlayer) {
    return skipTurn(blockedPlayer.color);
  }

  // If there is a frog to birth, pop it
  const playerFrogBirth: Player | undefined = state.players.find(player => !!player.birth);
  if (playerFrogBirth) {
    return frogBirth(playerFrogBirth.color, playerFrogBirth.birthMale);
  }
  
  // If there is frog to eliminate, eliminate it
  const eliminatedWithoutChoice: FemaleFrog | undefined = state.players
    .flatMap(player => player.femaleFrogs)
    .find(frog => frog.eliminated);

  if (eliminatedWithoutChoice) {
    return eliminateFrog(eliminatedWithoutChoice);
  }    

  // If there is no queen for a player, remove all servant
  const aloneFrogs: FemaleFrog | undefined = state.players
      .filter(player => player.femaleFrogs.some(frog => frog.isQueen && !frog.position))
      .flatMap(player => player.femaleFrogs)
      .find(frog => !frog.isQueen && !!frog.position);
  if (aloneFrogs) {
    return eliminateFrog(aloneFrogs);
  }

  // If the tile is not known, reveal the tile, instead play the tile
  const lastFrogPlayed: FemaleFrog | undefined = state.players.flatMap(p => p.femaleFrogs).find(f => f.hasMoved);
  if (lastFrogPlayed && lastFrogPlayed.position) {
    const slabToPlay: Slab | Pick<Slab, 'back'> | undefined = state.pond[lastFrogPlayed.position.x][lastFrogPlayed.position.y] 
    if (slabToPlay && isKnownSlab(slabToPlay)) {
      // Then play the slab
      if (slabToPlay.displayed) {
        return playSlab(lastFrogPlayed.position);
      }
    }
  }
}