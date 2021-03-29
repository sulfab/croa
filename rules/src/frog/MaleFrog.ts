export enum MaleFrog {
    Red,
    Blue,
    Pink,
    Yellow,
    Purple,
    Green
}

let values = Object.values(MaleFrog);
export const maleFrogs = values.filter(isPlayerColor)

function isPlayerColor(arg: string | MaleFrog): arg is MaleFrog {
  return typeof arg === 'number'
}