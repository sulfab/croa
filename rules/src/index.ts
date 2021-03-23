import { IncompleteInformation, SequentialGame} from '@gamepark/rules-api'
import { EliminateFrogAction, FrogBirthAction, MoveFrogAction, PlaySlabEffectAction, RevealSlabAction, SkipTurnAction } from './action';
import { FemaleFrog } from './frog';
import { GameState, GameStateView } from './GameState'
import { Move, MoveType, eliminateFrog, playSlab, MoveView, skipTurn, frogBirth, revealSlab } from './moves';
import { Player, PlayerColor } from './player';
import { initializePlayerBoard } from './player/FrogPlacement';
import { pond, Slab, isKnownSlab } from './pond';
import { allowFrogMove } from './utils/FrogUtils';


const shuffleSlabs = (pond: Array<Slab>, dimension: number): Slab[][] => {
  const slabBoard: Slab[][] = [];
  for (let i = pond.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pond[i], pond[j]] = [pond[j], pond[i]];
  }

  for (let i = 0; i < pond.length; i++) {
    if (i % dimension === 0) {
      slabBoard.push(pond.slice(i, i + dimension));
    }
  }
  
  return slabBoard;
}

const defaultBoardSize = 8;

export default class Croa extends SequentialGame<GameState | GameStateView, Move, PlayerColor> implements IncompleteInformation<Move, PlayerColor, GameStateView, MoveView>  {
  constructor() // new game
  constructor(state: GameState) // from saved state
  constructor(arg?: GameState) {
    if (arg) {
      super(arg)
    } else {
      super({
        activePlayer: PlayerColor.Blue,
        players: [
          initializePlayerBoard(4, 0, PlayerColor.Blue),
          initializePlayerBoard(4, 1, PlayerColor.Green),
          initializePlayerBoard(4, 2, PlayerColor.Pink),
          initializePlayerBoard(4, 3, PlayerColor.Red)
        ], 
        pond: shuffleSlabs(pond, defaultBoardSize),
        round: 1,
      })
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

    // If player has only a stung frog, pass its turn

    // If player has at least one frog on board and all its frog are mudded or stung, skip turn
    const blockedPlayer: Player | undefined = this.state.players.find(player => 
      player.femaleFrogs.some(frog => !!frog.position) && player.femaleFrogs.filter(frog => !!frog.position).every(frog => frog.mudded || frog.stung));
    if (blockedPlayer) {
      return skipTurn(blockedPlayer.color);
    }

    // If there is a frog to birth, pop it
    const playerFrogBirth: Player | undefined = this.state.players.find(player => !!player.frogBirth);
    if (playerFrogBirth) {
      return frogBirth(playerFrogBirth.frogBirth!, playerFrogBirth.color);
    }
    
    // If there is frog to eliminate, eliminate it
    const eliminatedWithoutChoice: FemaleFrog | undefined = this.state.players
      .flatMap(player => player.femaleFrogs)
      .find(frog => frog.eliminated);

    if (eliminatedWithoutChoice) {
      return eliminateFrog(eliminatedWithoutChoice);
    }    

    // If there is no queen for a player, remove all servant
    const aloneFrogs: FemaleFrog | undefined = this.state.players
        .filter(player => player.femaleFrogs.some(frog => frog.isQueen && !frog.position))
        .flatMap(player => player.femaleFrogs)
        .find(frog => !frog.isQueen && !!frog.position);
    if (aloneFrogs) {
      return eliminateFrog(aloneFrogs);
    }

    // If the tile is not known, reveal the tile, instead play the tile
    const lastFrogPlayed: FemaleFrog | undefined = this.state.players.flatMap(p => p.femaleFrogs).find(f => f.hasMoved);
    if (lastFrogPlayed && lastFrogPlayed.position) {
      const slabToPlay: Slab | Pick<Slab, 'back'> | undefined = this.state.pond[lastFrogPlayed.position.x][lastFrogPlayed.position.y] 
      if (slabToPlay && isKnownSlab(slabToPlay)) {

        //First trigger the slab display
        if (!slabToPlay.displayed) {
          return revealSlab(lastFrogPlayed.position);
        }

        // Then play the slab
        return playSlab(lastFrogPlayed.position);
      }
    }

    return;
  }

  play(move: Move): void {
    console.log(move.type);
    switch(move.type) {
      case MoveType.MoveFrog:
        MoveFrogAction.apply(this.state, move);
        break;
      case MoveType.EliminateFrog:
        EliminateFrogAction.apply(this.state, move);
        break;
      case MoveType.PlaySlabEffect:
        PlaySlabEffectAction.apply(this.state, move);
        break;
      case MoveType.RevealSlab:
        RevealSlabAction.apply(this.state, move)
        break;
      case MoveType.FrogBirth:
        FrogBirthAction.apply(this.state, move);
        break;
      case MoveType.SkipTurn:
        SkipTurnAction.apply(this.state, move);
        break;
    }
  }  
  
  getView(): GameStateView {
    return {
      ...this.state, 
      pond: (this.state as GameState).pond.map(rowSlabs => rowSlabs.map(slab => slab.displayed? slab: { back: slab.back }))
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