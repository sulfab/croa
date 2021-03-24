import { Slab } from "../pond";

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

export {
    shuffleSlabs
}