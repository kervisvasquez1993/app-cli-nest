// src/cli/domain/ports/interactive-ui.port.ts
export const INTERACTIVE_UI = Symbol('IInteractiveUI');

export interface MenuOption {
  name: string;
  value: string;
}

export interface PromptConfig {
  message: string;
  validate?: (input: any) => boolean | string;
  default?: any;
}

export interface IInteractiveUI {
  showMenu(options: MenuOption[]): Promise<string>;
  promptNumber(config: PromptConfig): Promise<number>;
  promptText(config: PromptConfig): Promise<string>;
  promptConfirm(config: PromptConfig): Promise<boolean>;
  showMessage(message: string, type?: 'success' | 'error' | 'info'): void;
  clear(): void;
  pause(message?: string): Promise<void>;
}
