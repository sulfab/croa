import { IncompleteInformation, SequentialGame } from '@gamepark/rules-api'
import { CroaOptions, isGameOptions } from './CroaOptions'
import { FemaleFrog, FrogStatus } from './frog'
import { GameState, GameStateView } from './GameState'
import { acquireServant, eliminateFrog, eliminateFrogMove, Move, moveFrog, moveFrogMove, MoveType, MoveView, playSlabEffect, playSlabEffectMove, revealSlab, revealSlabMove, skipTurn, skipTurnMove } from './moves'
import { initializePlayerBoard, Player, PlayerColor } from './player'
import { isKnownSlab, pond, Slab } from './pond'
import { getAllowedPositions, shuffleSlabs } from './utils'
import { acquireServantMove } from './moves/AcquireServant';

const defaultBoardSize = 8;

export default class Croa extends SequentialGame<GameState, Move, PlayerColor> implements IncompleteInformation<GameState, GameStateView, Move, MoveView, PlayerColor>  {
  constructor(state: GameState) // from saved state
  constructor(options: CroaOptions)
  constructor(arg: GameState | CroaOptions) {
    if (isGameOptions(arg)) {
      super({
        activePlayer: arg.players[0].id,
        players: arg.players.map((player, index) => initializePlayerBoard(arg.players.length, index, player.id)), 
        pond: shuffleSlabs(pond, defaultBoardSize),
        round: 1,
      })
    } else {
      super(arg)
    }
  }  

  /**
   * The player id is directly set in the state in order to simplify the management
   */
  getActivePlayer(): PlayerColor | undefined {
    return this.state.activePlayer;
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
      player.eliminationChoice.forEach(frog => moves.push(eliminateFrogMove(frog)))
    }
    
    // By default, bogged or fed frogs can't be moved
    let movableFrogs = player.femaleFrogs.filter(frog => !!frog.position && ![FrogStatus.Bogged, FrogStatus.Fed].includes(frog.status));

    // If there is a bouncing frog, only this can be moved
    const bouncingFrog: FemaleFrog | undefined = player.femaleFrogs.find(frog => FrogStatus.Bouncing === frog.status);
    if (bouncingFrog) {
      movableFrogs = [bouncingFrog];
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
      .forEach(frog => getAllowedPositions(allFrogs, frog, this.state.pond).forEach(position => moves.push(moveFrogMove(frog.id, frog.color, position))))

    return moves; // return all the moves that active player is allowed to play depending on current this.state
  }

  getAutomaticMove(): Move | void {
    // If the tile is not known, reveal the tile, instead play the tile
    const activePlayer = this.state.players.find(player => player.color === this.state.activePlayer);
    if (!activePlayer) {
      return;
    }

    const lastFrogPlayed: FemaleFrog | undefined = activePlayer.femaleFrogs.find(f => f.id === activePlayer.lastPlayedFrogId);
    if (lastFrogPlayed && lastFrogPlayed.position) {
      const slabToPlay: Slab | Pick<Slab, 'back'> | undefined = this.state.pond[lastFrogPlayed.position.x][lastFrogPlayed.position.y] 
      if (slabToPlay && isKnownSlab(slabToPlay)) {

        //First trigger the slab display
        if (!slabToPlay.displayed) {
          return revealSlabMove(lastFrogPlayed.position);
        }
      }
    }

    return getPredictableAutomaticMoves(this.state, activePlayer);
  }

  play(move: Move): void {
    switch(move.type) {
      case MoveType.MoveFrog:
        moveFrog(this.state, move);
        break;
      case MoveType.EliminateFrog:
        eliminateFrog(this.state, move);
        break;
      case MoveType.PlaySlabEffect:
        playSlabEffect(this.state, move);
        break;
      case MoveType.RevealSlab:
        revealSlab(this.state, move)
        break;
      case MoveType.AcquireServant:
        acquireServant(this.state, move);
        break;
      case MoveType.SkipTurn:
        skipTurn(this.state);
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
export function getPredictableAutomaticMoves(state: GameState | GameStateView, activePlayer: Player): Move & MoveView | void {

  if (activePlayer.eliminationChoice.length > 0) {
    return;
  }

  // If player has not played yet and it has only frogs Bogged or Fed
  const isBlocked = !activePlayer.done 
    && activePlayer.femaleFrogs.some(frog => !!frog.position) 
    && activePlayer.femaleFrogs.filter(frog => !!frog.position).every(frog => [FrogStatus.Bogged, FrogStatus.Fed].includes(frog.status));
  if (isBlocked && activePlayer.eliminationChoice.length === 0) {
    return skipTurnMove;
  }

  // In the case the current player has a bouncing frog and no destination is possible, automatically move it to its previous slab
  const bouncingFrog = activePlayer.femaleFrogs.find(frog => FrogStatus.Bouncing === frog.status);
  if (bouncingFrog) {
    const allFrogs = state.players.flatMap(player => player.femaleFrogs).filter(frog => !!frog.position);
    if (getAllowedPositions(allFrogs, bouncingFrog, state.pond).length === 0 && bouncingFrog.previousPosition) {
      return moveFrogMove(bouncingFrog.id, bouncingFrog.color, bouncingFrog.previousPosition);
    }
  }
  
  // If there is frog to eliminate, eliminate it. It is not current player dependant
  const eliminatedWithoutChoice: FemaleFrog | undefined = state.players
    .flatMap(player => player.femaleFrogs)
    .find(frog => FrogStatus.Eliminated === frog.status);

  if (eliminatedWithoutChoice) {
    return eliminateFrogMove(eliminatedWithoutChoice);
  }    

  // If there is no queen for a player, remove all servant
  const aloneFrogs: FemaleFrog | undefined = state.players
      .filter(player => player.femaleFrogs.some(frog => frog.isQueen && !frog.position))
      .flatMap(player => player.femaleFrogs)
      .find(frog => !frog.isQueen && !!frog.position);
  if (aloneFrogs) {
    return eliminateFrogMove(aloneFrogs);
  }

  // If there is a frog to birth, pop it
  if (!!activePlayer.birth) {
    return acquireServantMove(activePlayer.color, activePlayer.birthMale);
  }

  // If the current player has finished playing, skip turn
  if (activePlayer && activePlayer.done && activePlayer.eliminationChoice.length === 0) {
    return skipTurnMove;
  }

  // If the tile is not known, reveal the tile, instead play the tile
  const lastFrogPlayed: FemaleFrog | undefined = state.players.flatMap(p => p.femaleFrogs).find(f => f.id === activePlayer.lastPlayedFrogId && FrogStatus.Moved === f.status);
  if (lastFrogPlayed && lastFrogPlayed.position) {
    const slabToPlay: Slab | Pick<Slab, 'back'> | undefined = state.pond[lastFrogPlayed.position.x][lastFrogPlayed.position.y] 
    if (slabToPlay && isKnownSlab(slabToPlay)) {
      // Then play the slab
      if (slabToPlay.displayed) {
        return playSlabEffectMove(lastFrogPlayed.position);
      }
    }    
  }
}