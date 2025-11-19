// src/cli/infrastructure/adapters/cli-framework/ink-react.adapter.ts
import { Injectable } from '@nestjs/common';
import {
  ICLIFramework,
  CLICommand,
  CLIOption,
  OptionValue,
} from '../../../domain/ports/cli-framework.port';

@Injectable()
export class InkReactAdapter implements ICLIFramework {
  private commands: Map<string, CLICommand> = new Map();

  registerCommand(command: CLICommand): void {
    this.commands.set(command.name, command);
  }

  async execute(args: string[]): Promise<void> {
    // args[0] = node
    // args[1] = script path
    // args[2] = comando (process, file, test)
    // args[3+] = opciones

    const commandName = args[2] || 'process'; // default command
    const command = this.commands.get(commandName);

    if (!command) {
      console.error(`❌ Comando no encontrado: ${commandName}`);
      console.log('\n📋 Comandos disponibles:');
      this.commands.forEach((cmd) => {
        console.log(`  - ${cmd.name}: ${cmd.description}`);
      });
      process.exit(1);
    }

    // Parsear opciones para comandos como 'file -f input.txt'
    const options = this.parseOptions(args.slice(3), command.options || []);

    try {
      await command.action(options);
    } catch (error) {
      console.error(
        '❌ Error al ejecutar comando:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      process.exit(1);
    }
  }

  private parseOptions(
    args: string[],
    commandOptions: CLIOption[],
  ): Record<string, OptionValue> {
    const options: Record<string, OptionValue> = {};

    // Establecer valores por defecto
    commandOptions.forEach((option) => {
      const optionName = this.extractOptionName(option.flags);
      if (option.defaultValue !== undefined) {
        options[optionName] = option.defaultValue;
      }
    });

    // Parsear argumentos
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg && arg.startsWith('-')) {
        const optionConfig = commandOptions.find((opt) =>
          this.matchesFlag(opt.flags, arg),
        );

        if (optionConfig) {
          const optionName = this.extractOptionName(optionConfig.flags);
          const nextArg = args[i + 1];

          if (nextArg && !nextArg.startsWith('-')) {
            options[optionName] = this.parseValue(nextArg);
            i++; // Saltar el siguiente argumento
          } else {
            options[optionName] = true; // Flag booleano
          }
        }
      }
    }

    return options;
  }

  private parseValue(value: string): OptionValue {
    // Intentar convertir a número
    const numValue = Number(value);
    if (!isNaN(numValue) && value.trim() !== '') {
      return numValue;
    }

    // Convertir booleanos
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;

    // Retornar como string
    return value;
  }

  private extractOptionName(flags: string): string {
    // Extraer el nombre largo de flags como "-f, --file <path>"
    const match = flags.match(/--([a-zA-Z0-9-]+)/);
    return match ? match[1] : flags.replace(/^-+/, '');
  }

  private matchesFlag(flags: string, arg: string): boolean {
    const flagParts = flags.split(',').map((f) => f.trim().split(' ')[0]);
    return flagParts.includes(arg);
  }
}
