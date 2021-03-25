import { Slab } from "./Slab";
import { SlabBackType } from "./SlabBackType";
import { SlabFrontType } from "./SlabFrontType";

const Nenuphars: Array<Slab> = [
    ...Array(6).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.NENUPHAR }),
    ...Array(4).fill({ back: SlabBackType.DEEP, front: SlabFrontType.NENUPHAR }),
    ...Array(4).fill({ back: SlabBackType.DEEP, front: SlabFrontType.NENUPHAR })
];

const Moskitos: Array<Slab> = [
    ...Array(4).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.MOSKITO }),
    ...Array(2).fill({ back: SlabBackType.DEEP, front: SlabFrontType.MOSKITO }),
    ...Array(2).fill({ back: SlabBackType.DEEP, front: SlabFrontType.MOSKITO })
];

const Muds: Array<Slab> = [
    ...Array(4).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.MUD })
];

const Pikes: Array<Slab> = [
    ...Array(2).fill({ back: SlabBackType.DEEP, front: SlabFrontType.PIKE }),
    ...Array(2).fill({ back: SlabBackType.DEEP, front: SlabFrontType.PIKE })
];

const Reeds: Array<Slab> = [
    ...Array(10).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.REED }),
    ...Array(3).fill({ back: SlabBackType.DEEP, front: SlabFrontType.REED }),
    ...Array(3).fill({ back: SlabBackType.DEEP, front: SlabFrontType.REED })
];

const Males: Array<Slab> = [
    ...Array(1).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.RED_MALE }),
    ...Array(1).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.GREEN_MALE }),
    ...Array(1).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.YELLOW_MALE }),
    ...Array(1).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.PURPLE_MALE }),
    ...Array(1).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.BLUE_MALE }),
    ...Array(1).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.PINK_MALE }),
    ...Array(1).fill({ back: SlabBackType.DEEP, front: SlabFrontType.RED_MALE }),
    ...Array(1).fill({ back: SlabBackType.DEEP, front: SlabFrontType.GREEN_MALE }),
    ...Array(1).fill({ back: SlabBackType.DEEP, front: SlabFrontType.YELLOW_MALE }),
    ...Array(1).fill({ back: SlabBackType.DEEP, front: SlabFrontType.PURPLE_MALE }),
    ...Array(1).fill({ back: SlabBackType.DEEP, front: SlabFrontType.BLUE_MALE }),
    ...Array(1).fill({ back: SlabBackType.DEEP, front: SlabFrontType.PINK_MALE }),
];

const Logs: Array<Slab> = [
    ...Array(2).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.LOG }),
    ...Array(2).fill({ back: SlabBackType.DEEP, front: SlabFrontType.LOG }),
    ...Array(2).fill({ back: SlabBackType.DEEP, front: SlabFrontType.LOG }),
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