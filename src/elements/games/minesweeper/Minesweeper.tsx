import Minesweeper, {
  Difficulty,
  MinesweeperSettings,
  difficultySettings,
} from "@models/games/minesweeper/minesweeper";
import { useState, useEffect } from "react";

const MinesweeperElement = () => {
  type InstanceSettings = {
    instance: Minesweeper;
  };
  type UISettings = {
    game: MinesweeperSettings;
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
  const updateSettings = (data: Partial<Settings>) =>
    setSettings({ ...data, ...settings });

  useEffect(() => {
    console.log("Change in game settings.");
  }, [settings.game.width, settings.game.height, settings.game.mines]);

  return (
    <div>
      <div>
        <button>Reset</button>
        <div>
          Game <small>settings</small>
        </div>
        <div>
          Display <small>settings</small>
        </div>
      </div>
      <div>
        <p>Game board</p>
      </div>
    </div>
  );
};

export default MinesweeperElement;
