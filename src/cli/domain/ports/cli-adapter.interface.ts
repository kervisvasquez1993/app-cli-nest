export interface ICommand {
  name: string;
  description: string;
  alias?: string;
  action: (...args: string[]) => void | Promise<void>;
}

export const CLI_ADAPTER = Symbol('ICLIAdapter');

export interface ICLIAdapter {
  setName(name: string): void;
  setDescription(description: string): void;
  setVersion(version: string): void;
  addCommand(command: ICommand): void;
  parse(args: string[]): void;
  showHelp(): void;
}
