import Minesweeper, {
  Difficulty,
  MinesweeperSettings,
  SelectionType,
  difficultySettings,
} from "@models/games/minesweeper/minesweeper";
import { useState, useEffect, ReactNode } from "react";
import { Coord2D } from "util/Coord2D";

const MinesweeperElement = () => {
  type InstanceSettings = {
    instance: Minesweeper;
    game: MinesweeperSettings;
  };
  type UISettings = {
    scale: number;
  };
  type Settings = InstanceSettings & UISettings;

  const [settings, setSettings] = useState<Settings>(() => {
    const diffSettings = difficultySettings(Difficulty.Easy);
    return {
      game: diffSettings,
      instance: new Minesweeper(diffSettings),
      scale: 1.0,
    };
  });
  const updateSettings = (data: Partial<Settings> = {}) =>
    setSettings({ ...data, ...settings });

  const tileClicked = (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    coord: Coord2D
  ) => {
    event.preventDefault();
    if (event.button === 0)
      settings.instance.selectTile(coord, SelectionType.Cleared);
    else if (event.button === 2)
      settings.instance.selectTile(coord, SelectionType.Flagged);
    updateSettings();
  };

  useEffect(() => {
    console.log("Change in game settings.");
  }, [settings.game.width, settings.game.height, settings.game.mines]);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            settings.instance.reset();
            updateSettings();
          }}
        >
          Reset
        </button>
        <div>
          Game <small>settings</small>
        </div>
        <div>
          Display <small>settings</small>
        </div>
      </div>
      <div>
        <table>
          <tbody className="cursor-pointer">
            {settings.instance.getBoard().map((row, y) => (
              <tr key={`row-${y}`}>
                {row.map((tile, x) => (
                  <td
                    key={`${[x, y]}`}
                    className="p-0 w-8 h-8"
                    onClick={(event) => tileClicked(event, [x, y])}
                    onContextMenu={(event) => tileClicked(event, [x, y])}
                  >
                    <div
                      className={`text-lg m-0 p-0 w-full h-full flex items-center justify-center border ${
                        tile.selectionState === SelectionType.Cleared
                          ? "bg-gray-300"
                          : "bg-gray-400"
                      } ${
                        settings.instance.gameOver && tile.incorrect
                          ? "border-2 border-red-600"
                          : "border-1 border-black"
                      }`}
                    >
                      {((): ReactNode => {
                        if (tile.selectionState === SelectionType.Flagged)
                          return <b>F</b>;

                        if (
                          (tile.selectionState === SelectionType.Cleared ||
                            settings.instance.gameOver) &&
                          tile.bomb
                        )
                          return <b className="text-red-600">B</b>;

                        if (tile.selectionState == null) return <p></p>;

                        if (tile.adjacentBombs !== 0)
                          return <p>{tile.adjacentBombs}</p>;

                        return <p></p>;
                      })()}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MinesweeperElement;
