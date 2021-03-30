import { Slab } from './Slab';
import { SlabBackType } from './SlabBackType';
import { SlabFrontType } from './SlabFrontType';

const WaterLilies: Array<Slab> = [
    ...Array(6).fill({ back: SlabBackType.Shallow, front: SlabFrontType.WaterLily }),
    ...Array(4).fill({ back: SlabBackType.Deep, front: SlabFrontType.WaterLily }),
    ...Array(4).fill({ back: SlabBackType.Deep, front: SlabFrontType.WaterLily })
];

const Mosquitos: Array<Slab> = [
    ...Array(4).fill({ back: SlabBackType.Shallow, front: SlabFrontType.Mosquito }),
    ...Array(2).fill({ back: SlabBackType.Deep, front: SlabFrontType.Mosquito }),
    ...Array(2).fill({ back: SlabBackType.Deep, front: SlabFrontType.Mosquito })
];

const Mud: Array<Slab> = [
    ...Array(4).fill({ back: SlabBackType.Shallow, front: SlabFrontType.Mud })
];

const Pikes: Array<Slab> = [
    ...Array(2).fill({ back: SlabBackType.Deep, front: SlabFrontType.Pike }),
    ...Array(2).fill({ back: SlabBackType.Deep, front: SlabFrontType.Pike })
];

const Reeds: Array<Slab> = [
    ...Array(10).fill({ back: SlabBackType.Shallow, front: SlabFrontType.Reed }),
    ...Array(3).fill({ back: SlabBackType.Deep, front: SlabFrontType.Reed }),
    ...Array(3).fill({ back: SlabBackType.Deep, front: SlabFrontType.Reed })
];

const Males: Array<Slab> = [
    ...Array(1).fill({ back: SlabBackType.Shallow, front: SlabFrontType.RedMale }),
    ...Array(1).fill({ back: SlabBackType.Shallow, front: SlabFrontType.GreenMale }),
    ...Array(1).fill({ back: SlabBackType.Shallow, front: SlabFrontType.YellowMale }),
    ...Array(1).fill({ back: SlabBackType.Shallow, front: SlabFrontType.PurpleMale }),
    ...Array(1).fill({ back: SlabBackType.Shallow, front: SlabFrontType.BlueMale }),
    ...Array(1).fill({ back: SlabBackType.Shallow, front: SlabFrontType.PinkMale }),
    ...Array(1).fill({ back: SlabBackType.Deep, front: SlabFrontType.RedMale }),
    ...Array(1).fill({ back: SlabBackType.Deep, front: SlabFrontType.GreenMale }),
    ...Array(1).fill({ back: SlabBackType.Deep, front: SlabFrontType.YellowMale }),
    ...Array(1).fill({ back: SlabBackType.Deep, front: SlabFrontType.PurpleMale }),
    ...Array(1).fill({ back: SlabBackType.Deep, front: SlabFrontType.BlueMale }),
    ...Array(1).fill({ back: SlabBackType.Deep, front: SlabFrontType.PinkMale }),
];

const Logs: Array<Slab> = [
    ...Array(2).fill({ back: SlabBackType.Shallow, front: SlabFrontType.Log }),
    ...Array(2).fill({ back: SlabBackType.Deep, front: SlabFrontType.Log }),
    ...Array(2).fill({ back: SlabBackType.Deep, front: SlabFrontType.Log }),
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