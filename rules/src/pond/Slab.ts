import { SlabBackType } from "./SlabBackType";
import { SlabFrontType } from "./SlabFrontType";

export type Slab = {
    back: SlabBackType,
    front: SlabFrontType,
    displayed?: boolean
}

export function isKnownSlab(slab: Slab | Pick<Slab, 'back'>): slab is Slab {
    return !!(slab as Slab).front;
}