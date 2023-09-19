import { useState, useEffect } from "react";
import { TerminalInstance } from "./terminal-data";

const Terminal = () => {
  const terminal = new TerminalInstance();

  type TerminalUI = {
    lines: String;
    input: String;
  };
  const [ui, setUI] = useState<TerminalUI>({
    input: "",
    lines: terminal.lines,
  });

  async function keyUp(event: KeyboardEvent) {
    const input = await terminal.keyboardInput(event);
    const lines = terminal.lines;
    setUI({ ...ui, input: input, lines: lines });
  }

  useEffect(() => {
    window.addEventListener("keydown", keyUp);
  }, []);

  return (
    <div className="flex flex-col text-lg font-mono w-full h-full bg-black text-green-500">
      <p className="whitespace-pre overflow-y-clip">{ui.lines}</p>
      <div className="flex flex-row">
        <p className="whitespace-pre">{`$ ${ui.input}`}</p>
        <p className="animate-blink">█</p>
      </div>
    </div>
  );
};

export default Terminal;
