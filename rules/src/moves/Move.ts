import { EliminateFrog, MoveFrog, SkipTurn, FrogBirth, PlaySlabEffect } from './';
import { RevealSlab, RevealSlabView } from './RevealSlab';

export type Move = MoveFrog | EliminateFrog | PlaySlabEffect | RevealSlab | FrogBirth | SkipTurn;
export default Move;

export type MoveView = Exclude<Move, RevealSlab> | RevealSlabView;
