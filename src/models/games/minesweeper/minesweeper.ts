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
};

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
  gameOver: boolean;
  private board: Array<Array<Tile>>;
  private shouldGenerateMines: boolean = true;
  private static safeDistance = 1;

  constructor({ width, height, mines }: MinesweeperSettings) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.gameOver = false;
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

  private clearTile(coord: Coord2D) {
    if (this.gameOver) return;

    const tile = this.getTile(coord);
    if (tile.selectionState != null) return;

    tile.selectionState = SelectionType.Cleared;

    if (tile.bomb) {
      this.gameOver = true;
      return;
    }

    if (tile.adjacentBombs === 0) {
      this.neighbors(coord).forEach((neighbor) => this.clearTile(neighbor));
    }
  }

  private flagTile(coord: Coord2D) {
    if (this.gameOver) return;

    const tile = this.getTile(coord);

    if (tile.selectionState == null) {
      tile.selectionState = SelectionType.Flagged;
    } else if (tile.selectionState === SelectionType.Flagged) {
      tile.selectionState = null;
    }
  }

  getTile([x, y]: Coord2D): Tile {
    return this.board[y][x];
  }

  reset() {
    this.gameOver = false;
    this.shouldGenerateMines = true;
    this.board = Array<Array<Tile>>(this.height).fill(
      Array<Tile>(this.width).fill({
        adjacentBombs: 0,
        bomb: false,
        selectionState: null,
      })
    );
  }

  selectTile(coord: Coord2D, type: SelectionType) {
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
}

export default Minesweeper;
export { Difficulty, difficultySettings };
export type { MinesweeperSettings };
