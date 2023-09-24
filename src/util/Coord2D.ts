export type Coord2D = [number, number];

export function areCoord2DsEqual(a: Coord2D, b: Coord2D): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function addCoord2D([ax, ay]: Coord2D, [bx, by]: Coord2D): Coord2D {
  return [ax + bx, ay + by];
}
