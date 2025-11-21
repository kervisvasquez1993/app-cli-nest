// import { Injectable, Inject } from '@nestjs/common';
// import {
//   ICLIFramework,
//   CLI_FRAMEWORK,
//   OptionValue,
// } from './domain/ports/cli-framework.port';
// import { ReadInputFromStdinUseCase } from './application/use-cases/read-input-from-stdin.use-case';
// import { ReadInputFromFileUseCase } from './application/use-cases/read-input-from-file.use-case';
// import { RunTestsUseCase } from './application/use-cases/run-tests.use-case';
// import { RunInteractiveModeUseCase } from './application/use-cases/run-interactive-mode.use-case';

// @Injectable()
// export class CLIService {
//   constructor(
//     @Inject(CLI_FRAMEWORK)
//     private readonly cliFramework: ICLIFramework,
//     private readonly readFromStdin: ReadInputFromStdinUseCase,
//     private readonly readFromFile: ReadInputFromFileUseCase,
//     private readonly runTests: RunTestsUseCase,
//     private readonly runInteractive: RunInteractiveModeUseCase,
//   ) {}

//   setup(): void {
//     this.registerCommands();
//   }

//   private registerCommands(): void {
//     this.cliFramework.registerCommand({
//       name: 'process',
//       description: 'Procesa operaciones desde stdin',
//       action: async () => {
//         await this.readFromStdin.execute();
//       },
//     });

//     // Comando: file (lee desde archivo)
//     this.cliFramework.registerCommand({
//       name: 'file',
//       description: 'Procesa operaciones desde un archivo',
//       options: [
//         {
//           flags: '-f, --file <path>',
//           description: 'Ruta del archivo de entrada',
//         },
//       ],
//       action: async (options: Record<string, OptionValue>) => {
//         const filePath = options.file;

//         if (typeof filePath !== 'string') {
//           throw new Error('File path must be a string');
//         }

//         await this.readFromFile.execute(filePath);
//       },
//     });

//     // Comando: test (ejecuta casos de prueba)
//     this.cliFramework.registerCommand({
//       name: 'test',
//       description: 'Ejecuta los casos de prueba',
//       action: async () => {
//         await this.runTests.execute();
//       },
//     });

//     // Comando: interactive (modo interactivo con UI)
//     this.cliFramework.registerCommand({
//       name: 'interactive',
//       description: 'Inicia el modo interactivo con interfaz visual',
//       action: async () => {
//         await this.runInteractive.execute();
//       },
//     });
//   }

//   /**
//    * Ejecuta el CLI con los argumentos proporcionados
//    */
//   async run(args: string[]): Promise<void> {
//     await this.cliFramework.execute(args);
//   }
// }

import { Injectable, Inject } from '@nestjs/common';
import {
  ICLIFramework,
  CLI_FRAMEWORK,
  OptionValue,
} from './domain/ports/cli-framework.port';
import { ReadInputFromStdinUseCase } from './application/use-cases/read-input-from-stdin.use-case';
import { ReadInputFromFileUseCase } from './application/use-cases/read-input-from-file.use-case';
import { RunTestsUseCase } from './application/use-cases/run-tests.use-case';
import { RunInteractiveModeUseCase } from './application/use-cases/run-interactive-mode.use-case';
import { getRequiredStringOption } from './application/utils/cli-options.util';

@Injectable()
export class CLIService {
  constructor(
    @Inject(CLI_FRAMEWORK)
    private readonly cliFramework: ICLIFramework,
    private readonly readFromStdin: ReadInputFromStdinUseCase,
    private readonly readFromFile: ReadInputFromFileUseCase,
    private readonly runTests: RunTestsUseCase,
    private readonly runInteractive: RunInteractiveModeUseCase,
  ) {}

  /**
   * Registra todos los comandos disponibles en el CLI.
   * Llamado una sola vez desde main.ts
   */
  setup(): void {
    this.registerProcessCommand();
    this.registerFileCommand();
    this.registerTestCommand();
    this.registerInteractiveCommand();
  }

  /**
   * Ejecuta el CLI con los argumentos proporcionados.
   */
  async run(args: string[]): Promise<void> {
    await this.cliFramework.execute(args);
  }

  // ─────────────────────────────────────────────
  // Comandos
  // ─────────────────────────────────────────────

  private registerProcessCommand(): void {
    this.cliFramework.registerCommand({
      name: 'process',
      description: 'Procesa operaciones desde stdin',
      action: async () => {
        await this.readFromStdin.execute();
      },
    });
  }

  private registerFileCommand(): void {
    this.cliFramework.registerCommand({
      name: 'file',
      description: 'Procesa operaciones desde un arquivo',
      options: [
        {
          flags: '-f, --file <path>',
          description: 'Ruta del archivo de entrada',
        },
      ],
      action: async (options: Record<string, OptionValue>) => {
        const filePath = getRequiredStringOption(
          options,
          'file',
          'File path is required. Use -f, --file <path>',
        );

        await this.readFromFile.execute(filePath);
      },
    });
  }

  private registerTestCommand(): void {
    this.cliFramework.registerCommand({
      name: 'test',
      description: 'Ejecuta los casos de prueba',
      action: async () => {
        await this.runTests.execute();
      },
    });
  }

  private registerInteractiveCommand(): void {
    this.cliFramework.registerCommand({
      name: 'interactive',
      description: 'Inicia el modo interactivo con interfaz visual',
      action: async () => {
        await this.runInteractive.execute();
      },
    });
  }
}
