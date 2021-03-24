import { MaleFrog, FemaleFrog, FemaleFrogId } from '../frog';
import { PlayerColor } from '.';

export type Player = {
  // color act as the player identifier
  color: PlayerColor,
  maleFrogs: Array<MaleFrog>,
  femaleFrogs: Array<FemaleFrog>,
  eliminationChoice: Array<FemaleFrogId>,
  birth?: boolean,
  birthMale?: MaleFrog
  eliminated: boolean
}