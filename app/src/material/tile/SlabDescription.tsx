import { css } from '@emotion/react';
import { SlabFrontType } from '@gamepark/croa/pond';
import { TFunction } from 'i18next';
import { FC, HTMLAttributes } from 'react';
import { Trans, useTranslation } from 'react-i18next';

type SlabDescriptionProps = {
    slab: SlabFrontType,
} & HTMLAttributes<HTMLDivElement>

const SlabDescription: FC<SlabDescriptionProps> = ({ slab, ...props }) => {
    const { t } = useTranslation();

    return (
        <div { ...props } css={ slabDescriptionContainer }>
            <div css={ slabTitleContainer }>
                <span css={ slabTitleBar} />    
                <span css={ slabTitle }>{ slabDescriptions.get(SlabFrontType.RedMale)?.title(t) }</span>
                <span css={ slabTitleBar} />    
            </div>
            <div css={ slabDescrîption }>
                { slabDescriptions.get(SlabFrontType.RedMale)?.description }
            </div>
        </div>
    );
};

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

const slabDescrîption = css`
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
`

const slabDescriptions = new Map<SlabFrontType, { title: (t: TFunction) => string, description: any }>();

slabDescriptions.set(SlabFrontType.WaterLily, { title: (t) => t('Water lily'), description: <Trans defaults="Water lily description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.Mosquito, { title: (t) => t('Mosquito'), description: <Trans defaults="Mosquito description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.Mud, { title: (t) => t('Mud'), description: <Trans defaults="Mud description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.Pike, { title: (t) => t('Pike'), description: <Trans defaults="Pike description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.Reed, { title: (t) => t('Reed'), description: <Trans defaults="Reed description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.Log, { title: (t) => t('Log'), description: <Trans defaults="Log description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.BlueMale, { title: (t) => t('Males'), description: <Trans defaults="Males description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.GreenMale, { title: (t) => t('Males'), description: <Trans defaults="Males description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.RedMale, { title: (t) => t('Males'), description: <Trans defaults="Males description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.YellowMale, { title: (t) => t('Males'), description: <Trans defaults="Males description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.PurpleMale, { title: (t) => t('Males'), description: <Trans defaults="Males description" components={[ <span css={ css`color: gold;` } />]} /> });
slabDescriptions.set(SlabFrontType.PinkMale, { title: (t) => t('Males'), description: <Trans defaults="Males description" components={[ <span css={ css`color: gold;` } />]} /> });

export {
    SlabDescription
}
