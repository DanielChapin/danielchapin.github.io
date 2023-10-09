export type Coord2D = [number, number];

export function areCoord2DsEqual(a: Coord2D, b: Coord2D): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function addCoord2D([ax, ay]: Coord2D, [bx, by]: Coord2D): Coord2D {
  return [ax + bx, ay + by];
}

export function distanceCoord2D([ax, ay]: Coord2D, [bx, by]: Coord2D): number {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

export enum NeighborMode {
  CARDINALS,
  SQUARE,
}

const cardinalNeighbors: Array<Coord2D> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const diagonalNeighbors: Array<Coord2D> = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];
const squareNeighbors: Array<Coord2D> = [
  ...cardinalNeighbors,
  ...diagonalNeighbors,
];

// (Inclusive)
export function coordBetween(
  coord: Coord2D,
  lo: Coord2D,
  hi: Coord2D
): boolean {
  return (
    coord[0] >= lo[0] &&
    coord[0] <= hi[0] &&
    coord[1] >= lo[1] &&
    coord[1] <= hi[1]
  );
}

export function neighborDeltas(mode: NeighborMode): Array<Coord2D> {
  switch (mode) {
    case NeighborMode.CARDINALS:
      return cardinalNeighbors;
    case NeighborMode.SQUARE:
      return squareNeighbors;
    default:
      console.error(
        "[Coord2D] Could not get neighbors for given neighborMode."
      );
      return [];
  }
}

export function generateNeighbors(
  pos: Coord2D,
  mode: NeighborMode,
  options: {
    minPos: Coord2D;
    maxPos: Coord2D;
  } | null = null
): Array<Coord2D> {
  let neighbors = neighborDeltas(mode).map((delta) => addCoord2D(pos, delta));

  if (options != null) {
    neighbors = neighbors.filter((neighbor) =>
      coordBetween(neighbor, options.minPos, options.maxPos)
    );
  }

  return neighbors;
}
