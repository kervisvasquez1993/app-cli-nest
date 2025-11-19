export const CLI_FRAMEWORK = Symbol('ICLIFramework');

export type OptionValue = string | number | boolean;

export interface CLIOption {
  flags: string;
  description: string;
  defaultValue?: OptionValue;
}

export interface CLICommand {
  name: string;
  description: string;
  options?: CLIOption[];
  action: (args: Record<string, OptionValue>) => Promise<void>;
}

export interface ICLIFramework {
  registerCommand(command: CLICommand): void;

  execute(args: string[]): Promise<void>;
}
