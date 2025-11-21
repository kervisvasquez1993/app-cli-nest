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

    // Agregar opciones si existen
    if (command.options) {
      command.options.forEach((option) => {
        // ✅ FIX: Manejar defaultValue correctamente
        if (option.defaultValue !== undefined) {
          // Commander acepta string | boolean | string[], pero no number
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

    // Agregar acción
    cmd.action(async (options: Record<string, OptionValue>) => {
      try {
        await command.action(options);
      } catch (error) {
        console.error(
          '❌ Error:',
          error instanceof Error ? error.message : 'Unknown error',
        );
        process.exit(1);
      }
    });
  }

  async execute(args: string[]): Promise<void> {
    try {
      await this.program.parseAsync(args);
    } catch (error) {
      // Commander ya maneja los errores, solo salir
      process.exit(1);
    }
  }
}
