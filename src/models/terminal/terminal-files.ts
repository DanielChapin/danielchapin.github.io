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
  execute: (terminal: TerminalInstance, params: Array<String>) => void;
};

class TerminalExecutableFile implements TerminalFile<ExecutableFileData> {
  name: String;
  data: ExecutableFileData;

  constructor(name: String, data: ExecutableFileData) {
    this.name = name;
    this.data = data;
  }
}

type TerminalDirectoryChildren = Array<TerminalDirectory | TerminalFile<any>>;

class TerminalDirectory {
  name: String;
  parent: TerminalDirectory | null;
  children: TerminalDirectoryChildren;

  constructor(
    name: String,
    parent: TerminalDirectory | null,
    children: TerminalDirectoryChildren
  ) {
    this.name = name;
    this.parent = parent;
    this.children = children;
  }
}

function reparentTerminalDirectory(
  dir: TerminalDirectory,
  recursive: boolean = true
) {
  dir.children.forEach((child) => {
    if (!(child instanceof TerminalDirectory)) return;
    child.parent = dir;

    if (recursive) reparentTerminalDirectory(child, recursive);
  });
}

function isTerminalFile(value: any): value is TerminalFile<any> {
  return (
    value instanceof TerminalTextFile || value instanceof TerminalExecutableFile
  );
}

export default TerminalFile;
export {
  TerminalExecutableFile,
  TerminalTextFile,
  TerminalDirectory,
  isTerminalFile,
  reparentTerminalDirectory,
};
