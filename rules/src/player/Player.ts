import { MaleFrog, FemaleFrog } from '../frog';
import { PlayerColor } from '.';

export type Player = {
  // color act as the player identifier
  color: PlayerColor,
  maleFrogs: Array<MaleFrog>,
  femaleFrogs: Array<FemaleFrog>,
  eliminationChoice: Array<FemaleFrog>,
  birth?: boolean,
  birthMale?: MaleFrog
  eliminated?: number
  done: boolean
  lastPlayedFrogId?: number
}