export interface ICommand {
  name: string;
  description: string;
  alias?: string;
  action: (...args: any[]) => void | Promise<void>;
}

export interface ICLIAdapter {
  setName(name: string): void;
  setDescription(description: string): void;
  setVersion(version: string): void;
  addCommand(command: ICommand): void;
  parse(args: string[]): void;
  showHelp(): void;
}