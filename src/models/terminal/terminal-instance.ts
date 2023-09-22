import terminalCommands, { TerminalCommand } from "./terminal-commands";
import { TerminalDirectory } from "./terminal-files";

type TerminalSettings = {
  onExit?: (terminal: TerminalInstance) => void;
};

class TerminalInstance {
  root: TerminalDirectory;
  commands: Map<String, TerminalCommand>;
  workingDirectory: TerminalDirectory;
  history: Array<String>;
  // TODO Add stylizing for lines
  lines: String;
  input: String;
  settings: TerminalSettings;

  constructor(settings: TerminalSettings = {}) {
    this.settings = settings;
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
    this.commands = new Map(terminalCommands.map((cmd) => [cmd.command, cmd]));
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
        this.log(`Couldn't find command "${commandName}".`);
        return;
      }

      const result = await command.execute(this, parameters);
      console.log(result);
    } catch (err) {
      this.log(err as String);
    }
  }

  getDirectoryPath(dir: TerminalDirectory = this.workingDirectory): String {
    let result = "";
    let current: TerminalDirectory | null = dir;
    while (current != null) {
      result = current.name + "/" + result;
      current = current.parent;
    }
    return result;
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

export default TerminalInstance;
