import { FemaleFrog } from '@gamepark/croa/frog'
import { DragObjectType } from './'

export type FrogFromBoard = {
  type: typeof DragObjectType.FrogFromBoard
  frog: FemaleFrog
}

export function frogFromBoard(frog: FemaleFrog): FrogFromBoard {
    return {
        type: DragObjectType.FrogFromBoard,
        frog
    }
}