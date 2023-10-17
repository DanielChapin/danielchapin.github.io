import {
  Coord2D,
  NeighborMode,
  generateNeighbors,
  ringDistance,
} from "util/Coord2D";

enum SelectionType {
  Flagged,
  Cleared,
}

type Tile = {
  adjacentBombs: number;
  bomb: boolean;
  selectionState: SelectionType | null;
  incorrect: boolean;
};

const emptyTile: () => Tile = () => ({
  adjacentBombs: 0,
  bomb: false,
  selectionState: null,
  incorrect: false,
});

type MinesweeperSettings = {
  width: number;
  height: number;
  mines: number;
};

enum Difficulty {
  Easy,
  Medium,
  Hard,
  Custom,
}
const difficultySettings: (_: Difficulty) => MinesweeperSettings = (
  diff: Difficulty
) => {
  switch (diff) {
    case Difficulty.Easy:
      return { width: 9, height: 9, mines: 10 };
    case Difficulty.Medium:
      return { width: 16, height: 16, mines: 40 };
    case Difficulty.Hard:
      return { width: 30, height: 16, mines: 99 };
    default:
      return { width: 30, height: 20, mines: 145 };
  }
};

class Minesweeper {
  width: number;
  height: number;
  mines: number;
  gameOver: boolean = false;
  victory: boolean = false;
  private board: Array<Array<Tile>>;
  private shouldGenerateMines: boolean = true;
  private flags: number = 0;
  private cleared: number = 0;
  private static safeDistance = 1;

  constructor({ width, height, mines }: MinesweeperSettings) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.board = [];
    this.reset();
  }

  private neighbors(coord: Coord2D): Array<Coord2D> {
    return generateNeighbors(coord, NeighborMode.SQUARE, {
      minPos: [0, 0],
      maxPos: [this.width - 1, this.height - 1],
    });
  }

  private generateMines(start: Coord2D) {
    // Generate possible mine placements
    let possibleCoords: Array<Coord2D> = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const coord: Coord2D = [x, y];
        if (ringDistance(coord, start) > Minesweeper.safeDistance) {
          possibleCoords.push(coord);
        }
      }
    }

    // Shuffle placements (for random selection)
    possibleCoords = possibleCoords.sort(() => Math.random() - 0.5);

    // Select mine placement locations and update neighbors
    for (let i = 0; i < this.mines; i++) {
      const mineCoord = possibleCoords[i];
      const mineNeighbors = this.neighbors(mineCoord);

      this.getTile(mineCoord).bomb = true;
      // This should probably be done lazily whenever a tile is cleared
      mineNeighbors.forEach(
        (neighbor) => (this.getTile(neighbor).adjacentBombs += 1)
      );
    }
  }

  private revealAll() {
    this.board.forEach((row, y) =>
      row.forEach((tile, x) => {
        if (tile.bomb && tile.selectionState !== SelectionType.Flagged) {
          this.flagTile([x, y]);
        } else {
          this.clearTile([x, y]);
        }
      })
    );

    this.victory = true;
  }

  private clearTile(coord: Coord2D) {
    const tile = this.getTile(coord);
    if (tile.selectionState != null) return;

    tile.selectionState = SelectionType.Cleared;

    if (tile.bomb) {
      this.gameOver = true;
      tile.incorrect = true;
      return;
    }

    if (tile.adjacentBombs === 0) {
      this.neighbors(coord).forEach((neighbor) => this.clearTile(neighbor));
    }

    this.cleared += 1;
    if (this.cleared >= this.safeTiles()) {
      this.revealAll();
    }
  }

  private flagTile(coord: Coord2D) {
    const tile = this.getTile(coord);

    if (tile.selectionState == null) {
      tile.selectionState = SelectionType.Flagged;
      this.flags += 1;
      tile.incorrect = !tile.bomb;
    } else if (tile.selectionState === SelectionType.Flagged) {
      tile.selectionState = null;
      this.flags -= 1;
      tile.incorrect = false;
    }
  }

  getTile([x, y]: Coord2D): Tile {
    return this.board[y][x];
  }

  getBoard(): Array<Array<Tile>> {
    return this.board;
  }

  reset() {
    this.gameOver = false;
    this.victory = false;
    this.shouldGenerateMines = true;
    this.flags = 0;
    this.cleared = 0;

    this.board = Array<Array<Tile>>(this.height);
    for (let y = 0; y < this.height; y++) {
      const row = Array<Tile>(this.width);
      for (let x = 0; x < this.width; x++) {
        row[x] = emptyTile();
      }
      this.board[y] = row;
    }
  }

  selectTile(coord: Coord2D, type: SelectionType) {
    if (this.gameOver || this.victory) return;

    if (type === SelectionType.Cleared) {
      if (this.shouldGenerateMines) {
        this.shouldGenerateMines = false;
        this.generateMines(coord);
      }

      this.clearTile(coord);
    } else if (type === SelectionType.Flagged) {
      this.flagTile(coord);
    }
  }

  flagCount(): number {
    return this.flags;
  }

  mineCount(): number {
    return this.mines;
  }

  safeTiles(): number {
    return this.width * this.height - this.mineCount();
  }
}

export default Minesweeper;
export { Difficulty, difficultySettings, SelectionType };
export type { MinesweeperSettings, Tile };
