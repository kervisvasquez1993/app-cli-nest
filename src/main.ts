// // src/main.ts
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { CLIService } from './cli/cli.service';

// async function bootstrap() {
//   // Crear contexto de aplicación (no servidor HTTP)
//   const app = await NestFactory.createApplicationContext(AppModule, {
//     logger: false, // Desactivar logs de NestJS para CLI limpia
//   });

//   try {
//     // Obtener el servicio CLI
//     const cliService = app.get(CLIService);

//     // Configurar los comandos
//     cliService.setup();

//     // Ejecutar con los argumentos de línea de comandos
//     await cliService.run(process.argv);

//     // Cerrar la aplicación después de ejecutar
//     await app.close();
//   } catch (error) {
//     console.error('Error en la aplicación CLI:', error);
//     await app.close();
//     process.exit(1);
//   }
// }

// bootstrap();
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIService } from './cli/cli.service';
import { CLIError } from './cli/domain/errors/cli.errors';

function mapExitCode(error: unknown): number {
  if (error instanceof CLIError) {
    switch (error.code) {
      case 'FILE_NOT_FOUND':
        return 2;
      case 'EMPTY_FILE':
        return 3;
      case 'INVALID_INPUT_FORMAT':
        return 4;
      case 'COMMAND_NOT_FOUND':
        return 5;
      default:
        return 1; // CLIError desconhecido
    }
  }

  // Errores no controlados
  return 1;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false, // CLI limpia
  });

  try {
    const cliService = app.get(CLIService);

    cliService.setup();
    await cliService.run(process.argv);

    await app.close();
    process.exit(0);
  } catch (error) {
    // Log simple en stderr
    console.error(
      'Error en la aplicación CLI:',
      error instanceof Error ? error.message : error,
    );

    const exitCode = mapExitCode(error);

    await app.close();
    process.exit(exitCode);
  }
}

bootstrap();
