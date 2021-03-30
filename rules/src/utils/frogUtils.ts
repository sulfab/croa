import { Position } from '../common/Position'
import { FemaleFrog, FrogStatus } from '../frog'
import { isKnownSlab, Slab, SlabFrontType } from '../pond'

export const getAllowedPositions = (allFrogs: Array<FemaleFrog>, frog: FemaleFrog, pond: (Slab | Pick<Slab, 'back'>)[][]): Position[] => {
  const positions = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i !== 0 || j !== 0) {

        const frogX = frog.position!.x + i;
        const frogY = frog.position!.y + j;
        const isOutSideBoard = !(frogX >= 0 && frogY >= 0 && frogX < pond.length && frogY < pond.length);
        const isBouncingFrogPreviousTile = FrogStatus.Bouncing === frog.status && frog.previousPosition && frog.previousPosition.x === frog.position!.x + i && frog.previousPosition.y === frog.position!.y + j;
        if (!isOutSideBoard && !isBouncingFrogPreviousTile) {
          
          const slab = pond[frogX][frogY];
          const delta = {x: i, y: j};
          if (isAllowedMove(allFrogs, frog, delta, slab, pond.length)) {
            positions.push({ x: frogX, y: frogY})
          }
        }
      }
    }
  }

  return positions;
}
    
export const isAllowedMove = (allFrogs: Array<FemaleFrog>, frog: FemaleFrog, delta: Position, slab: (Slab | Pick<Slab, 'back'>), boardSize: number): boolean => {
    const frogX = frog.position!.x + delta.x;
    const frogY = frog.position!.y + delta.y;
    if (!boardSize || !(frogX >= 0 && frogY >= 0 && frogX < boardSize && frogY < boardSize)) {
        return false;
    }       

    // Player can move frog only when position is on the board and that there is no frog on the target slab
    const frogsOnTargetSlab = allFrogs.filter(f => !!f.position && (f.id !== frog.id || f.color !== frog.color) && f.position!.x === frogX && f.position!.y === frogY);
    if (frogsOnTargetSlab.length > 0) {
      const targetSlab = slab;
      
      if (frogsOnTargetSlab.some(otherFrog => otherFrog.color === frog.color)) {

        
        // The servant can always be moved on a log slab
        // The player queen cannot be moved on a slab with one of its queens
        if (!frog.isQueen && isKnownSlab(targetSlab) && targetSlab.displayed && SlabFrontType.Log === targetSlab.front 
              && !frogsOnTargetSlab.some(f => f.color === frog.color && f.isQueen)) {
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
 * @param slabPosition Position to compare to
 */
export const isAdjacentSlab = (frog: FemaleFrog, slabPosition: Position) => {
    const deltaX = Math.abs(slabPosition.x - frog.position!.x);
    const deltaY = Math.abs(slabPosition.y - frog.position!.y);
    return (deltaY <= 1 && deltaX <= 1 && (deltaX !== 0 || deltaY !== 0))
};