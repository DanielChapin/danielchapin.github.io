import assert from "assert";
import { Coord2D, addCoord2D } from "util/Coord2D";

enum NeighborMode {
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

class Grid<CellType> {
  private width: number;
  private height: number;
  private data: Array<Array<CellType>>;

  neighborMode: NeighborMode = NeighborMode.CARDINALS;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    assert(width > 0 && height > 0);
    this.data = Array(height).fill(Array(width));
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

  getCell([x, y]: Coord2D): CellType {
    return this.data[y][x];
  }

  setCell([x, y]: Coord2D, value: CellType): boolean {
    this.data[y][x] = value;
    return true;
  }

  getNeighbors([x, y]: Coord2D): Array<Coord2D> {
    let deltas: Array<Coord2D>;
    switch (this.neighborMode) {
      case NeighborMode.CARDINALS:
        deltas = cardinalNeighbors;
        break;
      case NeighborMode.SQUARE:
        deltas = squareNeighbors;
        break;
    }

    let neighbors = deltas.map((delta) => addCoord2D(delta, [x, y]));
    neighbors = neighbors.filter((coord) => this.isInside(coord));
    return neighbors;
  }
}

enum BinaryCell {
  EMPTY,
  FILLED,
}

export default Grid;
export { BinaryCell, NeighborMode };
