import { Position } from '../common/Position';
import { MoveType } from './MoveType';

export type PlaySlabEffect = {
    type: MoveType.PlaySlabEffect,
    slabPosition: Position
}

/**
 * Execute the slab effect
 * @param position The position of the slab which effect must be applied
 */
export function playSlab(position: Position): PlaySlabEffect {
    return {
        type: MoveType.PlaySlabEffect,
        slabPosition: position
    };
}