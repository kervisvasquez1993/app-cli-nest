// src/cli/infrastructure/adapters/cli-framework/commander.adapter.ts
import { Injectable } from '@nestjs/common';
import { Command } from 'commander';
import {
  ICLIFramework,
  CLICommand,
  OptionValue,
} from '../../../domain/ports/cli-framework.port';

@Injectable()
export class CommanderAdapter implements ICLIFramework {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.program
      .name('capital-gains')
      .description('CLI para cálculo de impuestos sobre ganancias de capital')
      .version('1.0.0');
  }

  registerCommand(command: CLICommand): void {
    const cmd = this.program
      .command(command.name)
      .description(command.description);

    if (command.options) {
      command.options.forEach((option) => {
        if (option.defaultValue !== undefined) {
          const defaultValue = option.defaultValue as
            | string
            | boolean
            | string[];
          cmd.option(option.flags, option.description, defaultValue);
        } else {
          cmd.option(option.flags, option.description);
        }
      });
    }

    cmd.action(async (options: Record<string, OptionValue>) => {
      // ❗ No process.exit aquí. Si hay error, que se propague.
      await command.action(options);
    });
  }

  async execute(args: string[]): Promise<void> {
    // Commander ya lanza errores si algo sale mal (comando inválido, etc.)
    await this.program.parseAsync(args);
  }
}
