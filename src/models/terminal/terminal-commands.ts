import {
  TerminalDirectory,
  TerminalExecutableFile,
  TerminalTextFile,
} from "./terminal-files";
import TerminalInstance from "./terminal-instance";

type TerminalCommand = {
  command: String;
  name: String;
  description: String;
  execute: (
    terminal: TerminalInstance,
    params: Array<String>
  ) => Promise<String | void>;
};

const cdCommand: TerminalCommand = {
  command: "cd",
  name: "Change Directory",
  description:
    "== Change Directory ==\n" +
    "Used to switch between directories.\n" +
    "Usage:\n" +
    "  $ cd <relative-or-absolute-directory-path>",
  execute(terminal, params) {
    if (params.length !== 1 || params[0] === "") {
      return Promise.reject("Exactly 1 parameter required.");
    }

    // TODO Move directory/file finding to TerminalInstance
    const path = params[0].split("/");
    const absolute = path[0] === terminal.root.name;

    let directory = terminal.workingDirectory;

    if (absolute) {
      directory = terminal.root;
      path.shift();
    }

    if (path.length > 0 && path.at(-1) === "") {
      path.pop();
    }

    while (path.length > 0) {
      const next = path[0];
      path.shift();

      if (next === ".") {
        continue;
      } else if (next === "..") {
        const previous = directory.parent;
        if (previous == null) {
          return Promise.reject("Root directory has no parent directory.");
        }
        directory = previous;
      } else {
        const candidate = directory.children.find((dir) => dir.name === next);
        if (candidate == null) {
          return Promise.reject(`Could not find directory "${next}".`);
        } else if (
          candidate instanceof TerminalExecutableFile ||
          candidate instanceof TerminalTextFile
        ) {
          return Promise.reject(`'${candidate.name}' is a file.`);
        } else {
          directory = candidate as TerminalDirectory;
        }
      }
    }

    terminal.workingDirectory = directory;

    return Promise.resolve();
  },
};

const helpCommand: TerminalCommand = {
  command: "help",
  name: "Help",
  description:
    "== Help ==\n" +
    "Used for getting help in the terminal.\n" +
    "Usage:\n" +
    "  $ help [<command-name> [<command-name>...]]\n" +
    "hint: try 'help ls cd'",
  execute(terminal, params) {
    if (params.length === 0) {
      terminal.log(this.description);
      terminal.log();
      terminal.log("Available commands:");
      terminal.commands.forEach((_, key) => terminal.log(key));
    } else {
      for (let commandName of params) {
        const command = terminal.commands.get(commandName);
        if (command != null) {
          terminal.log(command.description);
        } else {
          terminal.log(`Could not find command "${commandName}"`);
        }
        terminal.log();
      }
    }

    return Promise.resolve();
  },
};

const clearCommand: TerminalCommand = {
  command: "clear",
  name: "Clear Terminal",
  description:
    "== Clear Terminal ==\n" +
    "Clear the current line buffer.\n" +
    "Usage:\n" +
    "  $ clear",
  execute(terminal, params) {
    terminal.lines = "";
    return Promise.resolve();
  },
};

const pwdCommand: TerminalCommand = {
  command: "pwd",
  name: "Print Working Directory",
  description:
    "== Print Working Directory ==\n" +
    "Prints the terminal's current directory to the screen.\n" +
    "Usage:\n" +
    "  $ pwd",
  execute(terminal, params) {
    terminal.log(terminal.getDirectoryPath());
    return Promise.resolve();
  },
};

const lsCommand: TerminalCommand = {
  command: "ls",
  name: "List Directory Contents",
  description:
    "== List Directory Contents ==\n" +
    "Prints out the contents of the current directory to the screen.\n" +
    "You may either supply a path, or default to the current path (.)\n" +
    "Usage:\n" +
    "  $ ls [<path-to-directory>]",
  execute(terminal, params) {
    // TODO Implement parameters
    if (params.length > 0) {
      terminal.log("[WARN] ls parameters unimplemented.");
    }
    for (const item of terminal.workingDirectory.children) {
      terminal.log(item.name);
    }
    return Promise.resolve();
  },
};

const exitCommand: TerminalCommand = {
  command: "exit",
  name: "Exit",
  description:
    "== Exit ==\n" +
    "Terminates the current terminal session.\n" +
    "Usage:\n" +
    "  $ exit",
  execute(terminal, params) {
    const onExit = terminal.settings.onExit;
    if (onExit != null) {
      onExit(terminal);
      return Promise.resolve("Goodbye.");
    } else {
      return Promise.reject("No onExit function provided.");
    }
  },
};

const terminalCommands: Array<TerminalCommand> = [
  cdCommand,
  helpCommand,
  clearCommand,
  pwdCommand,
  lsCommand,
  exitCommand,
];

export default terminalCommands;
export type { TerminalCommand };
export {
  cdCommand,
  clearCommand,
  helpCommand,
  pwdCommand,
  lsCommand,
  exitCommand,
};
