import Minesweeper, {
  Difficulty,
  MinesweeperSettings,
  SelectionType,
  defaultDifficulty,
  difficulties,
  difficultySettings,
} from "@models/games/minesweeper/minesweeper";
import { useState, ReactNode } from "react";
import { Coord2D } from "util/Coord2D";
import SettingsWindow from "./SettingsWindow";

const MinesweeperElement = () => {
  type InstanceSettings = {
    instance: Minesweeper;
    difficulty: Difficulty;
    customSettings: MinesweeperSettings;
  };
  type UISettings = {
    scale: number;
    showGameSettings: boolean;
    showUISettings: boolean;
  };
  type State = InstanceSettings & UISettings;

  const [state, setState] = useState<State>(() => {
    const diffSettings = difficultySettings(defaultDifficulty);
    return {
      difficulty: defaultDifficulty,
      customSettings: difficultySettings(Difficulty.Custom),
      instance: new Minesweeper(diffSettings),
      scale: 1.0,
      showGameSettings: false,
      showUISettings: false,
    };
  });
  const updateState = (data: Partial<State> = {}) =>
    setState({ ...state, ...data });

  const updateCustomSettings = (update: Partial<MinesweeperSettings>) => {
    const custom: MinesweeperSettings = { ...state.customSettings, ...update };
    custom.height = Math.max(1, Math.round(custom.height));
    custom.width = Math.max(1, Math.round(custom.width));
    const maxMines = custom.width * custom.height - 9;
    custom.mines = Math.max(0, Math.min(maxMines, custom.mines));

    updateState({ customSettings: custom });
  };

  const tileClicked = (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    coord: Coord2D,
    selection: SelectionType
  ) => {
    event.preventDefault();
    state.instance.selectTile(coord, selection);
    updateState();
  };

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
      <div className="flex flex-row items-center py-2">
        <button
          className="text-4xl p-2 mx-1 bg-slate-200 rounded-full border border-black"
          onClick={() => {
            state.instance.reset();
            updateState();
          }}
        >
          {state.instance.victory
            ? "😎"
            : state.instance.gameOver
            ? "😭"
            : "🙂"}
        </button>
        <button
          className="mx-1 px-1 bg-slate-200 rounded-full border border-black"
          onClick={() =>
            updateState({ showGameSettings: !state.showGameSettings })
          }
        >
          Game Settings
        </button>
        <button
          className="mx-1 px-1 bg-slate-200 rounded-full border border-black"
          onClick={() => updateState({ showUISettings: !state.showUISettings })}
        >
          Display Settings
        </button>
      </div>
      <div>
        {(state.showGameSettings || state.showUISettings) && (
          <div className="absolute flex flex-row p-1">
            {state.showGameSettings && (
              <SettingsWindow
                name="Game Settings"
                onClose={() => updateState({ showGameSettings: false })}
              >
                <table>
                  <thead>
                    <tr className="bg-slate-400">
                      <th>Difficulty</th>
                      <th>Rows</th>
                      <th>Columns</th>
                      <th>Mines</th>
                    </tr>
                  </thead>
                  <tbody>
                    {difficulties.map(({ difficulty, name, settings }, row) => (
                      <tr
                        key={name}
                        className={row % 2 === 1 ? "bg-slate-300" : ""}
                      >
                        <td>
                          <input
                            type="radio"
                            id={name}
                            name="difficulty"
                            onChange={() => {
                              console.log("Updating difficulty!");
                              updateState({ difficulty: difficulty });
                            }}
                          />
                          <label htmlFor={name}>{name}</label>
                        </td>
                        {
                          (difficulty !== Difficulty.Custom ? (
                            <span>
                              <td>{settings.height}</td>
                              <td>{settings.width}</td>
                              <td>{settings.mines}</td>
                            </span>
                          ) : (
                            <span>
                              <td>
                                <input
                                  className="w-12"
                                  type="number"
                                  value={state.customSettings.height}
                                  onChange={({ target: { valueAsNumber } }) =>
                                    updateCustomSettings({
                                      height: valueAsNumber,
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className="w-12"
                                  type="number"
                                  value={state.customSettings.width}
                                  onChange={({ target: { valueAsNumber } }) =>
                                    updateCustomSettings({
                                      width: valueAsNumber,
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className="w-12"
                                  type="number"
                                  value={state.customSettings.mines}
                                  onChange={({ target: { valueAsNumber } }) =>
                                    updateCustomSettings({
                                      mines: valueAsNumber,
                                    })
                                  }
                                />
                              </td>
                            </span>
                          )).props.children
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() =>
                    updateState({
                      showGameSettings: false,
                      showUISettings: false,
                      instance: new Minesweeper(
                        state.difficulty === Difficulty.Custom
                          ? state.customSettings
                          : difficultySettings(state.difficulty)
                      ),
                    })
                  }
                >
                  New Game
                </button>
              </SettingsWindow>
            )}
            {state.showUISettings && (
              <SettingsWindow
                name="UI Settings"
                onClose={() => updateState({ showUISettings: false })}
              >
                <div className="flex flex-row grow-0">
                  <div className="my-auto w-auto">
                    <b>Scale</b>
                  </div>
                  <div className="my-auto ml-auto">
                    <select
                      onChange={(event) =>
                        updateState({
                          scale: Number.parseFloat(event.target.value),
                        })
                      }
                      value={state.scale}
                    >
                      <option value={1.0}>100%</option>
                      <option value={1.5}>150%</option>
                      <option value={2.0}>200%</option>
                    </select>
                  </div>
                </div>
              </SettingsWindow>
            )}
          </div>
        )}
        <table>
          <tbody className="cursor-pointer">
            {state.instance.getBoard().map((row, y) => (
              <tr key={`row-${y}`}>
                {row.map((tile, x) => (
                  <td
                    key={`${[x, y]}`}
                    className={`p-0 ${
                      state.scale === 2
                        ? "w-16 h-16"
                        : state.scale === 1.5
                        ? "w-12 h-12"
                        : "w-8 h-8"
                    }`}
                    onClick={(event) =>
                      tileClicked(event, [x, y], SelectionType.Cleared)
                    }
                    onContextMenu={(event) =>
                      tileClicked(event, [x, y], SelectionType.Flagged)
                    }
                  >
                    <div
                      className={`m-0 p-0 w-full h-full flex items-center justify-center border ${
                        tile.selectionState === SelectionType.Cleared
                          ? "bg-gray-200"
                          : state.instance.victory
                          ? "bg-green-500"
                          : "bg-gray-400"
                      } ${
                        state.instance.gameOver && tile.incorrect
                          ? "border-2 border-red-600"
                          : "border-1 border-black"
                      } ${
                        state.scale === 2
                          ? "text-5xl"
                          : state.scale === 1.5
                          ? "text-3xl"
                          : "text-xl"
                      }`}
                    >
                      {((): ReactNode => {
                        if (tile.selectionState === SelectionType.Flagged)
                          return <b>F</b>;

                        if (
                          (tile.selectionState === SelectionType.Cleared ||
                            state.instance.gameOver) &&
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
          {state.instance.flagCount()}/{state.instance.mineCount()} Flags
        </p>
      </div>
    </div>
  );
};

export default MinesweeperElement;
