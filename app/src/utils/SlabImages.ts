import { SlabBackType, SlabFrontType } from "@gamepark/croa/pond";
import { Images } from "src/material/Resources";


const slabFrontImages = new Map<SlabFrontType, any>();

slabFrontImages.set(SlabFrontType.BLUE_MALE, Images.BlueMale);
slabFrontImages.set(SlabFrontType.RED_MALE, Images.RedMale);
slabFrontImages.set(SlabFrontType.YELLOW_MALE, Images.YellowMale);
slabFrontImages.set(SlabFrontType.PINK_MALE, Images.PinkMale);
slabFrontImages.set(SlabFrontType.PURPLE_MALE, Images.PurlpleMale);
slabFrontImages.set(SlabFrontType.GREEN_MALE, Images.GreenMale);
slabFrontImages.set(SlabFrontType.NENUPHAR, Images.Nenuphar);
slabFrontImages.set(SlabFrontType.MOSKITO, Images.Moskito);
slabFrontImages.set(SlabFrontType.MUD, Images.Mud);
slabFrontImages.set(SlabFrontType.REED, Images.Reed);
slabFrontImages.set(SlabFrontType.PIKE, Images.Pike);
slabFrontImages.set(SlabFrontType.LOG, Images.Log);

const slabBackImages = new Map<SlabBackType, any>();
slabBackImages.set(SlabBackType.SHALLOW, Images.Shallow);
slabBackImages.set(SlabBackType.DEEP, Images.Deep);

export {
    slabBackImages,
    slabFrontImages
}