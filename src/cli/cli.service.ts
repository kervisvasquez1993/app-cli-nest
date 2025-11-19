// src/cli/cli.service.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  CLI_ADAPTER,
  ICLIAdapter,
  ICommand,
} from './domain/ports/cli-adapter.interface';
import { ProcessStdinUseCase } from './application/use-cases/process-stdin.use-case';
import { ProcessFileUseCase } from './application/use-cases/process-file.use-case';
import { RunTestsUseCase } from './application/use-cases/run-tests.use-case';

@Injectable()
export class CLIService {
  constructor(
    @Inject(CLI_ADAPTER)
    private readonly cliAdapter: ICLIAdapter,

    private readonly processStdin: ProcessStdinUseCase,
    private readonly processFile: ProcessFileUseCase,
    private readonly runTests: RunTestsUseCase,
  ) {}

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
        action: () => {
          void this.processStdin.execute();
        },
      },
      {
        name: 'file <path>',
        description: 'Procesar operaciones desde archivo',
        action: (path: string) => {
          void this.processFile.execute(path);
        },
      },
      {
        name: 'test',
        description: 'Ejecutar casos de prueba predefinidos',
        action: () => {
          void this.runTests.execute();
        },
      },
    ];

    commands.forEach((command) => this.cliAdapter.addCommand(command));
  }

  run(args: string[]): void {
    // Si no hay argumentos, mostrar ayuda
    if (args.length <= 2) {
      this.cliAdapter.showHelp();
      process.exit(0);
    }

    // Parsear y ejecutar comando
    this.cliAdapter.parse(args);
  }
}
