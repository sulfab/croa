import { Slab } from "./Slab";
import { SlabBackType } from "./SlabBackType";
import { SlabFrontType } from "./SlabFrontType";

const Nenuphars: Array<Slab> = [
    ...Array.from(Array(6).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.NENUPHAR })),
    ...Array.from(Array(4).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.NENUPHAR })),
    ...Array.from(Array(4).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.NENUPHAR }))
];

const Moskitos: Array<Slab> = [
    ...Array.from(Array(4).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.MOSKITO })),
    ...Array.from(Array(2).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.MOSKITO })),
    ...Array.from(Array(2).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.MOSKITO }))
];

const Muds: Array<Slab> = [
    ...Array.from(Array(4).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.MUD }))
];

const Pikes: Array<Slab> = [
    ...Array.from(Array(2).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.PIKE })),
    ...Array.from(Array(2).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.PIKE }))
];

const Reeds: Array<Slab> = [
    ...Array.from(Array(10).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.REED })),
    ...Array.from(Array(3).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.REED })),
    ...Array.from(Array(3).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.REED }))
];

const Males: Array<Slab> = [
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.RED_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.GREEN_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.YELLOW_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.PURPLE_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.BLUE_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.PINK_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.RED_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.GREEN_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.YELLOW_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.PURPLE_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.BLUE_MALE })),
    ...Array.from(Array(1).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.PINK_MALE })),
];

const Logs: Array<Slab> = [
    ...Array.from(Array(2).keys()).map(_ => ({ back: SlabBackType.SHALLOW, front: SlabFrontType.LOG })),
    ...Array.from(Array(2).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.LOG })),
    ...Array.from(Array(2).keys()).map(_ => ({ back: SlabBackType.DEEP, front: SlabFrontType.LOG })),
];

export {
    Nenuphars,
    Moskitos,
    Muds,
    Pikes,
    Reeds,
    Males,
    Logs
};

export const pond: Array<Slab> = [
    ...Nenuphars, ...Moskitos, ...Muds, ...Pikes, ...Reeds, ...Males, ...Logs
]