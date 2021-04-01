import { css } from '@emotion/react';
import { Slab, SlabBackType, SlabFrontType, WaterLilies, Mosquitos, Mud, Pikes, Reeds, Males, Logs } from '@gamepark/croa/pond';
import { FC, HTMLAttributes } from 'react'
import { slabBackImages, slabFrontImages } from '../../../utils/SlabImages';

type SlabDescriptionVisualProps = {
    slab?: SlabFrontType
} & HTMLAttributes<HTMLImageElement>;

const SlabDescriptionVisual: FC<SlabDescriptionVisualProps> = ({ slab, ...props }) => {

    if (!slab) {
        return null;
    }


    return (
        <div { ...props } css={ slabDescriptionVisual }>
            <div css={ backSlabs }>
                <div css={ backSlab }>
                    <img css={ backSlabImage } src={ slabBackImages.get(SlabBackType.Shallow)} alt={"Shallow tile"} />
                    <span css={ backSlabImageCounter }>{ backForFrontSlab.get(slab)?.filter(s => s.back === SlabBackType.Shallow).length }</span>
                </div>
                <div css={ backSlab }>
                    <img css={ backSlabImage } src={ slabBackImages.get(SlabBackType.Deep)} alt={"Deep tile"} /> 
                    <span css={ backSlabImageCounter }>{ backForFrontSlab.get(slab)?.filter(s => s.back === SlabBackType.Deep).length }</span>
                </div>
            </div>
            <div css={ frontSlab }>
                <img css={ frontSlabImage } src={ slabFrontImages.get(slab)} alt={"Last slab"} />
            </div>
        </div>
    )
};

const slabDescriptionVisual = css`
  width: 100%;
`;

const frontSlab = css`
  position: absolute; 
  height: 100%;
  width: 66%;
  right: 0%;
`

const frontSlabImage = css`
  height: 100%;
  border-radius: 15%;
  box-shadow: 0 0.5em 0.7em black;
`;

const backSlabs = css`
    position: absolute;
    height: 100%;
    width: 33%;
    left: 0%;
`;

const backSlab = css`
    position: absolute;
    height: 48%;
    &:first-child {
        margin-bottom: 7%;
    };
    &:not(:first-child) {
        top: 53%;
    }

`;

const backSlabImageCounter = css`
    position: absolute;
    font-size: 4em;
    top: 4%;
    font-weight: normal;
    left: 6%;
    color: gold;
`;

const backSlabImage = css`
    height: 100%;
    border-radius: 15%;
    box-shadow: 0 0.5em 0.7em black;
`;

const backForFrontSlab = new Map<SlabFrontType, Array<Slab>>([
    [SlabFrontType.WaterLily, WaterLilies],
    [SlabFrontType.Mosquito, Mosquitos],
    [SlabFrontType.Mud, Mud],
    [SlabFrontType.Pike, Pikes],
    [SlabFrontType.Reed, Reeds],
    [SlabFrontType.RedMale, Males],
    [SlabFrontType.BlueMale, Males],
    [SlabFrontType.GreenMale, Males],
    [SlabFrontType.RedMale, Males],
    [SlabFrontType.YellowMale, Males],
    [SlabFrontType.PurpleMale, Males],
    [SlabFrontType.Log, Logs],
]);

export {
    SlabDescriptionVisual
}