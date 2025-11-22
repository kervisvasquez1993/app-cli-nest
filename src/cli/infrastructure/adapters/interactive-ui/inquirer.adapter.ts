import { Injectable } from '@nestjs/common';
import inquirer from 'inquirer';
import {
  IInteractiveUI,
  MenuOption,
  PromptConfig,
} from '../../../domain/ports/interactive-ui.port';

@Injectable()
export class InquirerAdapter implements IInteractiveUI {
  async showMenu(options: MenuOption[]): Promise<string> {
    const answers = await inquirer.prompt<{ selected: string }>([
      {
        type: 'list',
        name: 'selected',
        message: 'O que você deseja fazer?',
        choices: options,
      },
    ]);
    return answers.selected;
  }

  async promptNumber(config: PromptConfig): Promise<number> {
    const answers = await inquirer.prompt<{ value: string }>([
      {
        type: 'input',
        name: 'value',
        message: config.message,
        default:
          typeof config.default === 'number'
            ? String(config.default)
            : config.default,
        validate: (input: string) => {
          const trimmed = input.trim();

          if (!trimmed) {
            return 'Por favor, informe um número.';
          }

          const num = Number(trimmed);

          if (!Number.isFinite(num)) {
            return 'Valor inválido, digite apenas números.';
          }

          // se o chamador passou uma função de validação, usamos ela
          if (config.validate) {
            return config.validate(num);
          }

          return true;
        },
        filter: (input: string) => input.trim(),
      },
    ]);

    const num = Number(answers.value.trim());
    return num;
  }

  async promptText(config: PromptConfig): Promise<string> {
    const answers = await inquirer.prompt<{ value: string }>([
      {
        type: 'input',
        name: 'value',
        message: config.message,
        default: config.default,
        validate: config.validate,
      },
    ]);
    return answers.value;
  }

  async promptConfirm(config: PromptConfig): Promise<boolean> {
    const answers = await inquirer.prompt<{ value: boolean }>([
      {
        type: 'confirm',
        name: 'value',
        message: config.message,
        default: config.default ?? false,
      },
    ]);
    return answers.value;
  }

  showMessage(
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
  ): void {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    console.log(`${icons[type]} ${message}`);
  }

  clear(): void {
    console.clear();
  }

  async pause(
    message: string = 'Pressione Enter para continuar...',
  ): Promise<void> {
    await inquirer.prompt<{ pause: string }>([
      {
        type: 'input',
        name: 'pause',
        message,
      },
    ]);
  }
}
