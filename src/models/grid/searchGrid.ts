import { Coord2D, areCoord2DsEqual } from "util/Coord2D";
import Grid, { BinaryCell } from "./grid";

type IsBlockingPredicate<CellType> = (
  searchGrid: SearchGrid<CellType>,
  [x, y]: Coord2D
) => boolean;

class SearchGrid<CellType> extends Grid<CellType> {
  protected start: Coord2D;
  protected end: Coord2D;

  isBlocking: IsBlockingPredicate<CellType>;
  restrictStartEndPlacement: boolean = false;

  constructor(
    width: number,
    height: number,
    isBlocking: IsBlockingPredicate<CellType>
  ) {
    super(width, height);
    this.start = [0, 0];
    this.end = [width - 1, height - 1];
    this.isBlocking = isBlocking;
  }

  getStart(): Coord2D {
    return this.start;
  }

  getEnd(): Coord2D {
    return this.end;
  }

  moveStart(to: Coord2D): boolean {
    if (
      !this.isInside(to) ||
      (this.restrictStartEndPlacement && this.isBlocking(this, to))
    ) {
      return false;
    }

    this.start = to;
    return true;
  }

  moveEnd(to: Coord2D): boolean {
    if (
      !this.isInside(to) ||
      (this.restrictStartEndPlacement && this.isBlocking(this, to))
    ) {
      return false;
    }

    this.end = to;
    return true;
  }
}

class BinaryCellSearchGrid extends SearchGrid<BinaryCell> {
  constructor(width: number, height: number) {
    super(
      width,
      height,
      (grid: SearchGrid<BinaryCell>, [x, y]: Coord2D) =>
        areCoord2DsEqual(this.start, [x, y]) &&
        areCoord2DsEqual(this.end, [x, y]) &&
        grid.getCell([x, y]) === BinaryCell.FILLED
    );
  }
}

export default SearchGrid;
export { BinaryCellSearchGrid };
