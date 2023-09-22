import TerminalInstance from "./terminal-instance";

interface TerminalFile<DataType> {
  name: String;
  data: DataType;
}

class TerminalTextFile implements TerminalFile<String> {
  name: String;
  data: String;

  constructor(name: String, text: String = "") {
    this.name = name;
    this.data = text;
  }
}

type ExecutableFileData = {
  description: String | null;
  execute: (terminal: TerminalInstance) => void;
};

class TerminalExecutableFile implements TerminalFile<ExecutableFileData> {
  name: String;
  data: ExecutableFileData;

  constructor(name: String, data: ExecutableFileData) {
    this.name = name;
    this.data = data;
  }
}

type TerminalDirectory = {
  name: String;
  parent: TerminalDirectory | null;
  children: Array<TerminalDirectory | TerminalFile<any>>;
};

export default TerminalFile;
export type { TerminalDirectory };
export { TerminalExecutableFile, TerminalTextFile };
