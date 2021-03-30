export enum PlayerColor {
  Blue = 1,
  Red,
  Green,
  Pink
}

let values = Object.values(PlayerColor);
export const playerColors = values.filter(isPlayerColor)

function isPlayerColor(arg: string | PlayerColor): arg is PlayerColor {
  return typeof arg === 'number'
}