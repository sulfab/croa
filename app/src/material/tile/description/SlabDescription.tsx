import { css, keyframes } from '@emotion/react';
import { SlabFrontType } from '@gamepark/croa/pond';
import { useDisplayState } from '@gamepark/react-client';
import { TFunction } from 'i18next';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CroaState } from 'src/state/CroaState';

type SlabDescriptionProps = {
    slab?: SlabFrontType,
} & HTMLAttributes<HTMLDivElement>

const SlabDescription: FC<SlabDescriptionProps> = ({ ...props }) => {
    const { t } = useTranslation();
    const [croaState] = useDisplayState<CroaState | undefined>(undefined);
    const [currentSlab, setCurrentSlab] = useState<SlabFrontType | undefined>(croaState?.highlightedSlab)

    useEffect(() => {
        if (croaState?.highlightedSlab && currentSlab !== croaState?.highlightedSlab) {
            setCurrentSlab(croaState?.highlightedSlab)
        }
    // eslint-disable-next-line
    }, [croaState?.highlightedSlab])

    return (
        <div { ...props } css={ [slabDescriptionContainer, croaState?.highlightedSlab? fadeAnimation: fadeOutAnimation] }>
            <div css={ slabTitleContainer }>
                <span css={ slabTitleBar} />    
                <span css={ slabTitle }>{ currentSlab && slabDescriptions.get(currentSlab)?.title(t) }</span>
                <span css={ slabTitleBar} />    
            </div>
            <div css={ slabDescription }>
                { currentSlab && slabDescriptions.get(currentSlab)?.description(t) }
            </div>
        </div>
    );
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

const slabDescriptionContainer = css`
    border-radius: 1em;
    font-size: 2em;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 5%;
    max-height: 100%;
`;

const slabTitleContainer = css`
    height: 12%;
    width: 100%;
    display:flex;
    flex-direction: row;
`

const slabTitleBar = css`
    flex: 1;
    height: 0;
    padding-top: 5%;
    margin: 0 2%;
    border-bottom: 0.1em solid white;
`


const slabTitle = css`
    height: 100%;
    display: flex;
    font-size: 1.2em;
    align-items: center;
    justify-content: center;
    border-radius: 0.3em;
    text-align: center;
    letter-spacing: 0.05em;
    padding: 1% 0;
    text-transform: uppercase;
`;

const slabDescription = css`
    top: 15%;
    width: 100%;
    font-size: 1.2em;
    margin-top: 3%;
    white-space: pre-line;
    letter-spacing: 0.05em;
    font-family: 'News Cycle', sans-serif;
    min-height: 2.6em;
    max-height: 13.4em;
    overflow-y: auto;
    padding-right: 3%;
    padding-bottom: 3%;
    scrollbar-color: rgba(74, 74, 74, 0.3) transparent;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        width: 0.4em;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 7px;
        background-color: rgba(255, 255, 255, 1);
    }
`

const slabDescriptions = new Map<SlabFrontType, { title: (t: TFunction) => string, description: (t: TFunction) => any }>();

slabDescriptions.set(SlabFrontType.WaterLily, { title: (t) => t('Water lily'), description: (t) => t('Water lily description') });
slabDescriptions.set(SlabFrontType.Mosquito, { title: (t) => t('Mosquito'), description: (t) => t('Mosquito description') });
slabDescriptions.set(SlabFrontType.Mud, { title: (t) => t('Mud'), description: (t) => t('Mud description') });
slabDescriptions.set(SlabFrontType.Pike, { title: (t) => t('Pike'), description: (t) => t('Pike description') });
slabDescriptions.set(SlabFrontType.Reed, { title: (t) => t('Reed'), description: (t) => t('Reed description') });
slabDescriptions.set(SlabFrontType.Log, { title: (t) => t('Log'), description: (t) => logDescription(t) });
slabDescriptions.set(SlabFrontType.RedMale, { title: (t) => t('Males'), description: (t) => t('Males description') });
slabDescriptions.set(SlabFrontType.GreenMale, { title: (t) => t('Males'), description: (t) => t('Males description') });
slabDescriptions.set(SlabFrontType.BlueMale, { title: (t) => t('Males'), description: (t) => t('Males description') });
slabDescriptions.set(SlabFrontType.YellowMale, { title: (t) => t('Males'), description: (t) => t('Males description') });
slabDescriptions.set(SlabFrontType.PurpleMale, { title: (t) => t('Males'), description: (t) => t('Males description') });
slabDescriptions.set(SlabFrontType.PinkMale, { title: (t) => t('Males'), description: (t) => t('Males description') });

const logDescription = (t: TFunction) => {

    return (
        <div>
            <span>{ t('Log description') }</span>
            <ul>
                <li>{ t('Log description 1') }</li>
                <li>{ t('Log description 2') }</li>
                <li>{ t('Log description 3') }</li>
            </ul>
        </div>
    )
}

export {
    SlabDescription
}
