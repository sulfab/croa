
enum SlabFrontType {
    WaterLily = 1,
    Mosquito,
    Mud,
    Pike,
    Reed,
    Log,
    BlueMale,
    RedMale,
    PinkMale,
    PurpleMale,
    YellowMale,
    GreenMale
}

const isMale = (tileFront?: SlabFrontType) => {
    return !!tileFront && [SlabFrontType.BlueMale, SlabFrontType.RedMale, SlabFrontType.YellowMale, SlabFrontType.PinkMale, SlabFrontType.PurpleMale, SlabFrontType.GreenMale].includes(tileFront)
};

export {
    SlabFrontType,
    isMale
}