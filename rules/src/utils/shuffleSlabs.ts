import { Slab } from '../pond';
import shuffle from 'lodash.shuffle';

const shuffleSlabs = (pond: Array<Slab>, dimension: number): Slab[][] => {
  const slabBoard: Slab[][] = [];
  const shuffledSlab = shuffle(pond);
  
  for (let i = 0; i < shuffledSlab.length; i++) {
    if (i % dimension === 0) {
      slabBoard.push(shuffledSlab.slice(i, i + dimension));
    }
  }
    
    return slabBoard;
}

export {
    shuffleSlabs
}