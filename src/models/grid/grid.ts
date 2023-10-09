import { WeightedGraph } from "@models/graph/graph";
import assert from "assert";
import {
  Coord2D,
  NeighborMode,
  addCoord2D,
  distanceCoord2D,
  neighborDeltas,
} from "util/Coord2D";

type IsBlockingPredicate<CellType> = (
  searchGrid: Grid<CellType>,
  [x, y]: Coord2D
) => boolean;

class Grid<CellType> implements WeightedGraph<Coord2D, CellType> {
  private width: number;
  private height: number;
  private data: Array<Array<CellType>>;
  protected isBlocking: IsBlockingPredicate<CellType>;

  neighborMode: NeighborMode = NeighborMode.CARDINALS;

  constructor(
    width: number,
    height: number,
    isBlocking: IsBlockingPredicate<CellType>
  ) {
    this.width = width;
    this.height = height;
    this.isBlocking = isBlocking;
    assert(width > 0 && height > 0);
    this.data = Array(height).fill(Array(width));
  }

  edgeWeight(from: Coord2D, to: Coord2D): number | null {
    return this.adjacent(from, to) ? distanceCoord2D(from, to) : null;
  }

  adjacent(a: Coord2D, b: Coord2D): boolean {
    const distx = Math.abs(a[0] - b[0]);
    const disty = Math.abs(a[1] - b[1]);
    switch (this.neighborMode) {
      case NeighborMode.CARDINALS:
        return distx + disty === 1;
      case NeighborMode.SQUARE:
        return distx + disty > 0 && distx <= 1 && disty <= 1;
    }
  }

  getValue(vertex: Coord2D): CellType {
    return this.data[vertex[1]][vertex[0]];
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  isInside([x, y]: Coord2D): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  setCell([x, y]: Coord2D, value: CellType): boolean {
    this.data[y][x] = value;
    return true;
  }

  getNeighbors([x, y]: Coord2D): Array<Coord2D> {
    let neighbors = neighborDeltas(this.neighborMode).map((delta) =>
      addCoord2D(delta, [x, y])
    );
    neighbors = neighbors.filter((coord) => this.isInside(coord));
    return neighbors;
  }
}

enum BinaryCell {
  EMPTY,
  FILLED,
}

export default Grid;
export { BinaryCell };
export type { IsBlockingPredicate };
