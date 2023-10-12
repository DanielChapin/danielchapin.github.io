import {
  TerminalDirectory,
  TerminalExecutableFile,
  TerminalTextFile,
  reparentTerminalDirectory,
} from "./terminal-files";

const defaultFileSystem = (): TerminalDirectory => {
  const helloWorldExe = new TerminalExecutableFile("hello_world.exe", {
    description: "Says hello world <n> times.\n  $ run hello_world.exe <n>",
    execute(terminal, params) {
      if (params.length > 1) {
        terminal.log("Maximum one argument.");
        return;
      }

      let count = 1;
      if (params.length === 1) {
        console.warn(params[0]);
        count = parseInt(params[0].toString());
      }

      for (let i = 1; i <= count; i++) {
        terminal.log(`${i}: Hello, world!`);
      }
    },
  });

  const introScript = new TerminalTextFile(
    "intro.script",
    "# Welcome to my portfolio command line!\n" +
      "# A brief overview of the features of this terminal:\n" +
      "# - Simple directory and file structure (root: '/')\n" +
      "# - Full scripting support using terminal commands (just how you ran this script!)\n" +
      "# - Built in scoped executable files (try: $ run /hello_world.exe 10)\n" +
      "# - Simple unix-like directory navigation.\n" +
      "# - Open source implementation\n" +
      "#\n" +
      "# To start you off, I'm now going to run the 'help' command for you:\n" +
      "help"
  );

  const gamesDir = new TerminalDirectory("games", null, [
    new TerminalTextFile("minesweeper.script", "redirect /games/minesweeper"),
  ]);

  const root = new TerminalDirectory("", null, [
    helloWorldExe,
    introScript,
    gamesDir,
  ]);

  reparentTerminalDirectory(root);
  return root;
};

export default defaultFileSystem;
