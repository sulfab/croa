import { SlabBackType, SlabFrontType } from '@gamepark/croa/pond';
import { Images } from '../material/Resources';


const slabFrontImages = new Map<SlabFrontType, any>();

slabFrontImages.set(SlabFrontType.BlueMale, Images.BlueMale);
slabFrontImages.set(SlabFrontType.RedMale, Images.RedMale);
slabFrontImages.set(SlabFrontType.YellowMale, Images.YellowMale);
slabFrontImages.set(SlabFrontType.PinkMale, Images.PinkMale);
slabFrontImages.set(SlabFrontType.PurpleMale, Images.PurpleMale);
slabFrontImages.set(SlabFrontType.GreenMale, Images.GreenMale);
slabFrontImages.set(SlabFrontType.WaterLily, Images.WaterLily);
slabFrontImages.set(SlabFrontType.Mosquito, Images.Mosquito);
slabFrontImages.set(SlabFrontType.Mud, Images.Mud);
slabFrontImages.set(SlabFrontType.Reed, Images.Reed);
slabFrontImages.set(SlabFrontType.Pike, Images.Pike);
slabFrontImages.set(SlabFrontType.Log, Images.Log);

const slabBackImages = new Map<SlabBackType, any>();
slabBackImages.set(SlabBackType.Shallow, Images.Shallow);
slabBackImages.set(SlabBackType.Deep, Images.Deep);

export {
    slabBackImages,
    slabFrontImages
}