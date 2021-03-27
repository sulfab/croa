import { Slab } from './Slab';
import { SlabBackType } from './SlabBackType';
import { SlabFrontType } from './SlabFrontType';

const WaterLilies: Array<Slab> = [
    ...Array(6).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.WATER_LILY }),
    ...Array(4).fill({ back: SlabBackType.DEEP, front: SlabFrontType.WATER_LILY }),
    ...Array(4).fill({ back: SlabBackType.DEEP, front: SlabFrontType.WATER_LILY })
];

const Mosquitos: Array<Slab> = [
    ...Array(4).fill({ back: SlabBackType.SHALLOW, front: SlabFrontType.MOSQUITO }),
    ...Array(2).fill({ back: SlabBackType.DEEP, front: SlabFrontType.MOSQUITO }),
    ...Array(2).fill({ back: SlabBackType.DEEP, front: SlabFrontType.MOSQUITO })
];

const Mud: Array<Slab> = [
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
    WaterLilies,
    Mosquitos,
    Mud,
    Pikes,
    Reeds,
    Males,
    Logs
};

export const pond: Array<Slab> = [
    ...WaterLilies, ...Mosquitos, ...Mud, ...Pikes, ...Reeds, ...Males, ...Logs
]