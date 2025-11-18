import { Injectable } from '@nestjs/common';
import { CapitalGainsController } from '../capital-gains/capital-gains.controller';
import { type ICLIAdapter, ICommand } from './interfaces/cli-adapter.interface';
import { CalculateCommand } from './commands/calculate.command';
import { FileCommand } from './commands/file.command';
import { TestCommand } from './commands/test.command';
import { InteractiveCommand } from './commands/interactive.command';

@Injectable()
export class CLIService {
  private calculateCommand: CalculateCommand;
  private fileCommand: FileCommand;
  private testCommand: TestCommand;
  private interactiveCommand: InteractiveCommand;

  constructor(
    private readonly cliAdapter: ICLIAdapter,
    private readonly controller: CapitalGainsController,
  ) {
    this.calculateCommand = new CalculateCommand(this.controller);
    this.fileCommand = new FileCommand(this.controller);
    this.testCommand = new TestCommand(this.controller);
    this.interactiveCommand = new InteractiveCommand(this.controller);
  }

  setup(): void {
    this.cliAdapter.setName('capital-gains');
    this.cliAdapter.setDescription(
      '📊 Calculadora de Impuestos sobre Ganancia de Capital',
    );
    this.cliAdapter.setVersion('1.0.0');

    this.registerCommands();
  }

  private registerCommands(): void {
    const commands: ICommand[] = [
      {
        name: 'calculate',
        description: 'Procesar operaciones desde stdin (modo estándar)',
        action: () => this.calculateCommand.execute(),
      },
      {
        name: 'file <path>',
        description: 'Procesar operaciones desde archivo',
        action: (path: string) => this.fileCommand.execute(path),
      },
      {
        name: 'test',
        description: 'Ejecutar casos de prueba predefinidos',
        action: () => this.testCommand.execute(),
      },
      {
        name: 'interactive',
        alias: 'i',
        description: 'Modo interactivo con ejemplos y ayuda',
        action: () => this.interactiveCommand.execute(),
      },
    ];

    commands.forEach((command) => this.cliAdapter.addCommand(command));
  }

  run(args: string[]): void {
    this.cliAdapter.parse(args);

    // Si no se pasa ningún comando, mostrar ayuda
    if (!args.slice(2).length) {
      this.cliAdapter.showHelp();
    }
  }
}
