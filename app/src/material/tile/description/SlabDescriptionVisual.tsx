import { css, keyframes } from '@emotion/react';
import {
  Logs,
  Males,
  Mosquitos,
  Mud,
  Pikes,
  Reeds,
  Slab,
  SlabBackType,
  SlabFrontType,
  WaterLilies
} from '@gamepark/croa/pond';
import { useDisplayState } from '@gamepark/react-client';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { CroaState } from 'src/state/CroaState';
import { slabBackImages, slabFrontImages } from '../../../utils/SlabImages';

type SlabDescriptionVisualProps = {
    slab?: SlabFrontType
} & HTMLAttributes<HTMLImageElement>;

const SlabDescriptionVisual: FC<SlabDescriptionVisualProps> = ({ slab, ...props }) => {
    const [croaState,] = useDisplayState<CroaState | undefined>(undefined);
    const [currentSlab, setCurrentSlab] = useState<SlabFrontType | undefined>(croaState?.highlightedSlab)

    useEffect(() => {
        if (croaState?.highlightedSlab && currentSlab !== croaState?.highlightedSlab) {
            setCurrentSlab(croaState?.highlightedSlab)
        }
    // eslint-disable-next-line
    }, [croaState?.highlightedSlab])

    const isMale = (slab: SlabFrontType) => [
      SlabFrontType.RedMale,
      SlabFrontType.BlueMale,
      SlabFrontType.GreenMale,
      SlabFrontType.PinkMale,
      SlabFrontType.PurpleMale,
      SlabFrontType.YellowMale
    ].includes(slab);

    return (
        <div { ...props } css={ [slabDescriptionVisualStyle, croaState?.highlightedSlab? fadeAnimation: fadeOutAnimation] }>
            <div css={ backSlabs }>
                <div css={ backSlab }>
                    { currentSlab && <img css={ backSlabImage } src={ slabBackImages.get(SlabBackType.Shallow)} alt={"Shallow tile"} />}
                    <span css={ backSlabImageCounter }>{ currentSlab && backForFrontSlab.get(currentSlab)?.filter(s => s.back === SlabBackType.Shallow).length! / (isMale(currentSlab)? 6: 1) }</span>
                </div>
                <div css={ backSlab }>
                    { currentSlab && <img css={ backSlabImage } src={ slabBackImages.get(SlabBackType.Deep)} alt={"Deep tile"} /> }
                    <span css={ backSlabImageCounter }>{ currentSlab && backForFrontSlab.get(currentSlab)?.filter(s => s.back === SlabBackType.Deep).length! / (isMale(currentSlab)? 6: 1) }</span>
                </div>
            </div>
            <div css={ frontSlab }>
                { currentSlab && <img css={ frontSlabImage } src={ currentSlab && slabFrontImages.get(currentSlab)} alt={"Last slab"} />}
            </div>
        </div>
    )
};

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const fadeOut = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`

const fadeAnimation = css`
    opacity: 1;
    animation: ${fadeIn} 0.3s;
`

const fadeOutAnimation = css`
    opacity: 0;
    animation: ${fadeOut} 0.3s;
`

const slabDescriptionVisualStyle = css`
  width: 100%;
`;

const frontSlab = css`
  position: absolute; 
  height: 100%;
  width: 66%;
  right: 0;
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
    left: 0;
`;

const backSlab = css`
    position: absolute;
    height: 48%;
    &:first-of-type {
        margin-bottom: 7%;
    };
    &:not(:first-of-type) {
        top: 52%;
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
    [SlabFrontType.PinkMale, Males],
    [SlabFrontType.YellowMale, Males],
    [SlabFrontType.PurpleMale, Males],
    [SlabFrontType.Log, Logs],
]);

export {
    SlabDescriptionVisual
}