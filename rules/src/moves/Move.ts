import { EliminateFrog, MoveFrog, SkipTurn, AcquireServant, PlaySlabEffect } from './';
import { RevealSlab, RevealSlabView } from './RevealSlab';

export type Move = MoveFrog | EliminateFrog | PlaySlabEffect | RevealSlab | AcquireServant | SkipTurn;
export default Move;

export type MoveView = Exclude<Move, RevealSlab> | RevealSlabView;
