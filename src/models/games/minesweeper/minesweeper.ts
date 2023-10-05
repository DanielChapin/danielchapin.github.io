import { Coord2D } from "util/Coord2D";

enum SelectionType {
  Flagged,
  Cleared,
}

type Tile = {
  adjacentBombs: number;
  bomb: boolean;
  selectionState: SelectionType | null;
};

class Minesweeper {
  width: number;
  height: number;
  mines: number;
  private board: Array<Array<Tile>>;
  private shouldGenerateMines: boolean = true;

  constructor(width: number, height: number, mines: number) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.board = [];
    this.reset();
  }

  private generateMines(exclude: Coord2D) {}

  private clearTile(coords: Coord2D) {}

  getTile([x, y]: Coord2D): Tile {
    return this.board[y][x];
  }

  reset() {
    this.shouldGenerateMines = true;
    this.board = Array<Array<Tile>>(this.height).fill(
      Array<Tile>(this.width).fill({
        adjacentBombs: 0,
        bomb: false,
        selectionState: null,
      })
    );
  }

  selectTile(coords: Coord2D, type: SelectionType) {
    if (type === SelectionType.Cleared && this.shouldGenerateMines) {
      this.shouldGenerateMines = false;
      this.generateMines(coords);
    }
  }
}

export default Minesweeper;
