import { PlayerColor } from "@gamepark/croa/player";
import { Images } from "../Resources";


export const fromMiniImages = new Map<PlayerColor, { queen: any, servant: any}>([
    [ PlayerColor.Blue,  { queen: Images.BlueQueen, servant: Images.BlueServant }],
    [ PlayerColor.Green,  { queen: Images.GreenQueen, servant: Images.GreenServant }],
    [ PlayerColor.Pink,  { queen: Images.PinkQueen, servant: Images.PinkServant }],
    [ PlayerColor.Red,  { queen: Images.RedQueen, servant: Images.RedServant }]
])