import defaultFileSystem from "./defaultFileSystem";
import terminalCommands, { TerminalCommand } from "./terminal-commands";
import TerminalFile, {
  TerminalDirectory,
  TerminalExecutableFile,
  TerminalTextFile,
  isTerminalFile,
} from "./terminal-files";

type TerminalSettings = {
  onExit?: (terminal: TerminalInstance) => void;
  redirect?: (terminal: TerminalInstance, path: String) => void;
};

class TerminalInstance {
  root: TerminalDirectory;
  commands: Map<String, TerminalCommand>;
  workingDirectory: TerminalDirectory;
  history: Array<String>;
  lines: String;
  prompt: String;
  input: String;
  settings: TerminalSettings;

  constructor(settings: TerminalSettings = {}) {
    this.settings = settings;
    this.root = defaultFileSystem();
    this.commands = new Map(terminalCommands.map((cmd) => [cmd.command, cmd]));
    this.workingDirectory = this.root;
    this.prompt = "$";
    this.history = [];
    this.lines =
      "Daniel Chapin Portfolio Terminal\n" +
      "(Type 'help')\n" +
      "(If keystokes aren't registering you may need to click on the page.)\n" +
      "(type 'run intro.script')\n";
    this.input = "";

    this.setWorkingDirectory(this.root);
  }

  setWorkingDirectory(directory: TerminalDirectory) {
    this.workingDirectory = directory;
    this.prompt = `${this.getDirectoryPath()} $ `;
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
      this.log(`${this.prompt}${line}`);
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

      await command.execute(this, parameters);
    } catch (err) {
      this.log(err as String);
      return Promise.reject(err);
    }
  }

  async executeScript(script: String): Promise<void> {
    const lines = script.split("\n");
    for (let line of lines) {
      try {
        await this.execute(line);
      } catch (err) {}
    }
  }

  getDirectory(resourcePath: String): Promise<TerminalDirectory> {
    const path = resourcePath.split("/");
    const absolute = path[0] === this.root.name;

    let directory = this.workingDirectory;

    if (absolute) {
      directory = this.root;
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
        } else if (isTerminalFile(candidate)) {
          return Promise.reject(`'${candidate.name}' is a file.`);
        } else {
          directory = candidate as TerminalDirectory;
        }
      }
    }

    return Promise.resolve(directory);
  }

  async getFile(resourcePath: String): Promise<TerminalFile<any>> {
    const match = resourcePath.match(/^([/a-zA-Z_]*\/)?([a-zA-Z_.]*)$/);
    if (match == null || match.length !== 3) {
      return Promise.reject("Malformated file path.");
    }

    const [dirPath, filename] = match.slice(1);
    let dir = this.workingDirectory;
    if (dirPath != null) {
      try {
        dir = await this.getDirectory(dirPath);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    const files = dir.children.filter((child) => {
      return isTerminalFile(child) && child.name === filename;
    });

    if (files.length === 0) {
      return Promise.reject(
        `Could not find file with name '${filename}' in ${this.getDirectoryPath(
          dir
        )}`
      );
    }

    const file = files[0];

    if (isTerminalFile(file)) {
      return Promise.resolve(file);
    }

    return Promise.reject("Could not get file.");
  }

  async getExecutable(resourcePath: String): Promise<TerminalExecutableFile> {
    try {
      const file = await this.getFile(resourcePath);

      if (!(file instanceof TerminalExecutableFile)) {
        return Promise.reject(`'${resourcePath}' is not an executable.`);
      }

      return Promise.resolve(file);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getTextFile(resourcePath: String): Promise<TerminalTextFile> {
    try {
      const file = await this.getFile(resourcePath);

      if (!(file instanceof TerminalTextFile)) {
        return Promise.reject(`'${resourcePath}' is not a text file.`);
      }

      return Promise.resolve(file);
    } catch (err) {
      return Promise.reject(err);
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
      try {
        await this.execute(this.input);
      } catch {}
      this.input = "";
    }

    return Promise.resolve(this.input);
  }
}

export default TerminalInstance;
