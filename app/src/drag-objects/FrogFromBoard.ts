import { FemaleFrog } from '@gamepark/croa/frog'
import { DragObjectType } from './'

export type FrogFromBoard = {
  type: typeof DragObjectType.FROG_FROM_BOARD
  frog: FemaleFrog
}

export function frogFromBoard(frog: FemaleFrog): FrogFromBoard {
    return {
        type: DragObjectType.FROG_FROM_BOARD,
        frog
    }
}