export enum PlayerColor {
  Blue,
  Red,
  Green,
  Pink
}

let values = Object.values(PlayerColor);
export const playerColors = values.filter(isPlayerColor)

function isPlayerColor(arg: string | PlayerColor): arg is PlayerColor {
  return typeof arg === 'number'
}