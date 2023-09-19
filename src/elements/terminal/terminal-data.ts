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
        } else if ((candidate as TerminalFile).data != null) {
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

type RawTerminalFile<DataType> = {
  name: String;
  data: DataType;
};
type TerminalTextFile = RawTerminalFile<String>;
type TerminalBinaryFile = RawTerminalFile<Uint8Array>;
type TerminalFile = TerminalBinaryFile | TerminalTextFile;

type TerminalDirectory = {
  name: String;
  parent: TerminalDirectory | null;
  children: Array<TerminalDirectory | TerminalFile>;
};

class TerminalInstance {
  root: TerminalDirectory;
  commands: Map<String, TerminalCommand>;
  workingDirectory: TerminalDirectory;
  history: Array<String>;
  lines: String;
  input: String;

  constructor() {
    this.root = {
      name: "",
      parent: null,
      children: [],
    };
    this.root.children = [
      {
        name: "test",
        parent: this.root,
        children: [],
      } satisfies TerminalDirectory,
    ];
    this.commands = new Map(
      [cdCommand, helpCommand].map((cmd) => [cmd.command, cmd])
    );
    this.workingDirectory = this.root;
    this.history = [];
    this.lines =
      "Daniel Chapin Portfolio Terminal\n" +
      "(Type 'help')\n" +
      "(If keystokes aren't registering you may need to click on the page.)\n";
    this.input = "";
  }

  parseTokens(line: String): Promise<Array<String>> {
    const tokens: Array<String> = [];
    let current = "";
    let parsingString = false;

    for (let i = 0; i < line.length; i++) {
      const character = line.charAt(i);

      // Parsing whitespaces
      if (!parsingString && /^\s$/.test(character)) {
        if (current.length > 0) {
          tokens.push(current);
        }
        current = "";
        continue;
      }

      // String parsing
      if (character === '"') {
        // Checking for escape characters
        if (/\\$/.test(current)) {
          current = current.slice(0, -1) + character;
          continue;
        } else {
          if (!parsingString) {
            parsingString = true;
            continue;
          } else {
            parsingString = false;
            tokens.push(current);
            current = "";
            continue;
          }
        }
      }

      current += character;
    }

    if (parsingString) {
      return Promise.reject("Failed to parse quoted parameter.");
    }

    if (current.length > 0) {
      tokens.push(current);
    }

    return Promise.resolve(tokens);
  }

  async execute(line: String): Promise<void> {
    try {
      this.log(`$ ${line}`);
      const tokens = await this.parseTokens(line);
      if (tokens.length === 0) {
        return;
      }

      const commandName = tokens[0];
      const parameters = tokens.slice(1);

      const command = this.commands.get(commandName);
      if (command == null) {
        this.log("Couldn't find command.");
        return;
      }

      const result = await command.execute(this, parameters);
      console.log(result);
    } catch (err) {
      this.log(err as String);
    }
  }

  log(text: String = "") {
    this.lines += text + "\n";
  }

  async keyboardInput(event: KeyboardEvent): Promise<String> {
    const key = event.key;

    if (key.length === 1) {
      this.input += key;
    } else if (key === "Backspace") {
      this.input = this.input.slice(0, -1);
    } else if (key === "Enter") {
      await this.execute(this.input);
      this.input = "";
    }

    return Promise.resolve(this.input);
  }
}

export { TerminalInstance };
