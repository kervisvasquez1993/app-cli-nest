// src/cli/cli.service.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  ICLIFramework,
  CLI_FRAMEWORK,
  OptionValue,
} from './domain/ports/cli-framework.port';
import { ReadInputFromStdinUseCase } from './application/use-cases/read-input-from-stdin.use-case';
import { ReadInputFromFileUseCase } from './application/use-cases/read-input-from-file.use-case';
import { RunTestsUseCase } from './application/use-cases/run-tests.use-case';

@Injectable()
export class CLIService {
  constructor(
    @Inject(CLI_FRAMEWORK)
    private readonly cliFramework: ICLIFramework,
    private readonly readFromStdin: ReadInputFromStdinUseCase,
    private readonly readFromFile: ReadInputFromFileUseCase,
    private readonly runTests: RunTestsUseCase,
  ) {}

  /**
   * Configura todos los comandos disponibles
   */
  setup(): void {
    this.registerCommands();
  }

  private registerCommands(): void {
    // Comando: process (default - lee desde stdin)
    this.cliFramework.registerCommand({
      name: 'process',
      description: 'Procesa operaciones desde stdin',
      action: async () => {
        await this.readFromStdin.execute();
      },
    });

    // Comando: file (lee desde archivo)
    this.cliFramework.registerCommand({
      name: 'file',
      description: 'Procesa operaciones desde un archivo',
      options: [
        {
          flags: '-f, --file <path>',
          description: 'Ruta del archivo de entrada',
        },
      ],
      action: async (options: Record<string, OptionValue>) => {
        const filePath = options.file;

        if (typeof filePath !== 'string') {
          throw new Error('File path must be a string');
        }

        await this.readFromFile.execute(filePath);
      },
    });

    // Comando: test (ejecuta casos de prueba)
    this.cliFramework.registerCommand({
      name: 'test',
      description: 'Ejecuta los casos de prueba',
      action: async () => {
        await this.runTests.execute();
      },
    });
  }

  /**
   * Ejecuta el CLI con los argumentos proporcionados
   */
  async run(args: string[]): Promise<void> {
    await this.cliFramework.execute(args);
  }
}
