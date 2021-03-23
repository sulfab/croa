import { Position } from "../common/Position";
import { FemaleFrog } from "../frog";
import { Move, moveFrog } from "../moves";
import { isKnownSlab, Slab, SlabFrontType } from "../pond";


  /**
   * Allow moving the frog only if there is no other frog on the target slab
   * @param frogs The player frogs
   * @param frog The current played frog
   * @param position The targeted slab
   * @param moves THe liste of allowed moves
   */
export const allowFrogMove = (allFrogs: Array<FemaleFrog>, frog: FemaleFrog, delta: Position, pond: (Slab | Pick<Slab, 'back'>)[][],  moves?: Array<Move>, boardSize?: number) => {
    const frogX = frog.position!.x + delta.x;
    const frogY = frog.position!.y + delta.y;
    if (!boardSize || !(frogX >= 0 && frogY >= 0 && frogX < boardSize && frogY < boardSize)) {
        return;
    }

    const slab = pond[frogX][frogY];
    if (moves && isAllowedMove(allFrogs, frog, delta, slab, boardSize)) {
      moves.push(moveFrog(frog.id, frog.color, { x: frogX, y: frogY }));
    }
}
    
export const isAllowedMove = (allFrogs: Array<FemaleFrog>, frog: FemaleFrog, delta: Position, slab: (Slab | Pick<Slab, 'back'>), boardSize: number): boolean => {
    const frogX = frog.position!.x + delta.x;
    const frogY = frog.position!.y + delta.y;
    if (!boardSize || !(frogX >= 0 && frogY >= 0 && frogX < boardSize && frogY < boardSize)) {
        return false;
    }    

    // Player can move frog only when position is on the board and that there is no frog on the target slab
    const frogsOnTargetSlab = allFrogs.filter(f => (f.id !== frog.id || f.color !== frog.color) && f.position && f.position!.x === frogX && f.position!.y === frogY);
        if (frogsOnTargetSlab.length > 0) {
      const targetSlab = slab;
      if (frogsOnTargetSlab.some(otherFrog => otherFrog.color === frog.color)) {
        
        // The servant can always be moved on a log slab
        // The player queen cannot be moved on a slab with one of its queens
        if (!frog.isQueen && isKnownSlab(targetSlab) && !!targetSlab.front && SlabFrontType.LOG === targetSlab.front) {
            return true;
        }
      } else {
          return true;
      }
    } else {
        return true;
    }

    return false;
}

/**
 * Does the current tile an adjacent one to the given frog
 * @param frog The frog where tiles needs to be compared
 */
export const isAdjcentSlab = (frog: FemaleFrog, slabPosition: Position) => {
    const deltaX = Math.abs(slabPosition.x - frog.position!.x);
    const deltaY = Math.abs(slabPosition.y - frog.position!.y);
    return (deltaY <= 1 && deltaX <= 1 && (deltaX !== 0 || deltaY !== 0))
};