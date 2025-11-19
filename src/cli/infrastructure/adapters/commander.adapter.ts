import { Injectable } from '@nestjs/common';
import { Command } from 'commander';
import {
  ICLIAdapter,
  ICommand,
} from '../../domain/ports/cli-adapter.interface';

@Injectable()
export class CommanderAdapter implements ICLIAdapter {
  private program: Command;

  constructor() {
    this.program = new Command();
  }

  setName(name: string): void {
    this.program.name(name);
  }

  setDescription(description: string): void {
    this.program.description(description);
  }

  setVersion(version: string): void {
    this.program.version(version);
  }

  addCommand(command: ICommand): void {
    const cmd = this.program
      .command(command.name)
      .description(command.description)
      .action(command.action);

    if (command.alias) {
      cmd.alias(command.alias);
    }
  }

  parse(args: string[]): void {
    this.program.parse(args);
  }

  showHelp(): void {
    this.program.outputHelp();
  }
}
