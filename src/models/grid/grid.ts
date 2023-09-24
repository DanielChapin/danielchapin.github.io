import assert from "assert";
import { Coord2D } from "util/Coord2D";

class Grid<CellType> {
  private width: number;
  private height: number;
  private data: Array<Array<CellType>>;

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
}

enum BinaryCell {
  EMPTY,
  FILLED,
}

export default Grid;
export { BinaryCell };
