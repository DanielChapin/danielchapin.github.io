import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TerminalInstance from "@models/terminal/terminal-instance";

const Terminal = () => {
  const navigate = useNavigate();

  const terminal = new TerminalInstance({
    onExit: () => navigate("/"),
    redirect: (_terminal, path) => navigate(path.toString()),
  });

  type TerminalUI = {
    acceptInput: boolean;
    lines: String;
    input: String;
    prompt: String;
  };
  const [ui, setUI] = useState<TerminalUI>({
    acceptInput: true,
    input: terminal.input,
    lines: terminal.lines,
    prompt: terminal.prompt,
  });

  async function keyUp(event: KeyboardEvent) {
    if (!ui.acceptInput) {
      return;
    }

    setUI({ ...ui, acceptInput: false });
    const input = await terminal.keyboardInput(event);
    const lines = terminal.lines;
    setUI({
      ...ui,
      input: input,
      lines: lines,
      acceptInput: true,
      prompt: terminal.prompt,
    });
  }

  useEffect(() => {
    window.addEventListener("keydown", keyUp);
  }, []);

  return (
    <div className="flex flex-col text-lg font-mono whitespace-pre-wrap break-words w-full h-full bg-black text-green-500">
      <p className="overflow-y-auto flex flex-col-reverse">{ui.lines}</p>
      <p>
        {`${ui.prompt}${ui.input}`}
        {ui.acceptInput && <span className="animate-blink">█</span>}
      </p>
    </div>
  );
};

export default Terminal;
