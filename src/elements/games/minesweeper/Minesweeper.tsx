import Minesweeper, {
  Difficulty,
  MinesweeperSettings,
  SelectionType,
  difficultySettings,
} from "@models/games/minesweeper/minesweeper";
import { useState, useEffect, ReactNode } from "react";
import { Coord2D } from "util/Coord2D";
import SettingsWindow from "./SettingsWindow";

const MinesweeperElement = () => {
  type InstanceSettings = {
    instance: Minesweeper;
    game: MinesweeperSettings;
  };
  type UISettings = {
    scale: number;
    showGameSettings: boolean;
    showUISettings: boolean;
  };
  type Settings = InstanceSettings & UISettings;

  const [settings, setSettings] = useState<Settings>(() => {
    const diffSettings = difficultySettings(Difficulty.Easy);
    return {
      game: diffSettings,
      instance: new Minesweeper(diffSettings),
      scale: 1.0,
      showGameSettings: false,
      showUISettings: false,
    };
  });
  const updateSettings = (data: Partial<Settings> = {}) =>
    setSettings({ ...settings, ...data });

  const tileClicked = (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    coord: Coord2D,
    selection: SelectionType
  ) => {
    event.preventDefault();
    settings.instance.selectTile(coord, selection);
    updateSettings();
  };

  useEffect(() => {
    console.log("Change in game settings.");
  }, [settings.game.width, settings.game.height, settings.game.mines]);

  const getTextColor = (adjacentBombs: number): string => {
    if (Math.min(8, Math.max(1, adjacentBombs)) !== adjacentBombs) return "";

    return [
      "text-sky-600",
      "text-green-600",
      "text-red-500",
      "text-blue-800",
      "text-red-800",
      "text-teal-500",
      "text-black",
      "text-slate-800",
    ][adjacentBombs - 1];
  };

  return (
    <div className="px-3">
      <div className="flex flex-row py-2">
        <button
          className="text-4xl"
          onClick={() => {
            settings.instance.reset();
            updateSettings();
          }}
        >
          {settings.instance.victory
            ? "😎"
            : settings.instance.gameOver
            ? "😭"
            : "🙂"}
        </button>
        <button
          onClick={() =>
            updateSettings({ showGameSettings: !settings.showGameSettings })
          }
        >
          Game
        </button>
        <button
          onClick={() =>
            updateSettings({ showUISettings: !settings.showUISettings })
          }
        >
          Display
        </button>
      </div>
      <div>
        {(settings.showGameSettings || settings.showUISettings) && (
          <div className="absolute flex flex-row p-1">
            {settings.showGameSettings && (
              <SettingsWindow name="Game Settings">
                Very cool game settings
              </SettingsWindow>
            )}
            {settings.showUISettings && <div>UI Settings</div>}
          </div>
        )}
        <table>
          <tbody className="cursor-pointer">
            {settings.instance.getBoard().map((row, y) => (
              <tr key={`row-${y}`}>
                {row.map((tile, x) => (
                  <td
                    key={`${[x, y]}`}
                    className="p-0 w-8 h-8"
                    onClick={(event) =>
                      tileClicked(event, [x, y], SelectionType.Cleared)
                    }
                    onContextMenu={(event) =>
                      tileClicked(event, [x, y], SelectionType.Flagged)
                    }
                  >
                    <div
                      className={`text-lg m-0 p-0 w-full h-full flex items-center justify-center border ${
                        tile.selectionState === SelectionType.Cleared
                          ? "bg-gray-200"
                          : settings.instance.victory
                          ? "bg-green-500"
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
                          return (
                            <b
                              className={`${getTextColor(tile.adjacentBombs)}`}
                            >
                              {tile.adjacentBombs}
                            </b>
                          );

                        return <p></p>;
                      })()}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="min-w-max">
          {settings.instance.flagCount()}/{settings.instance.mineCount()} Flags
        </p>
      </div>
    </div>
  );
};

export default MinesweeperElement;
