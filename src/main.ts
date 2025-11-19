// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIService } from './cli/cli.service';

async function bootstrap() {
  // Crear contexto de aplicación (no servidor HTTP)
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false, // Desactivar logs de NestJS para CLI limpia
  });

  try {
    // Obtener el servicio CLI
    const cliService = app.get(CLIService);

    // Configurar los comandos
    cliService.setup();

    // Ejecutar con los argumentos de línea de comandos
    await cliService.run(process.argv);

    // Cerrar la aplicación después de ejecutar
    await app.close();
  } catch (error) {
    console.error('Error en la aplicación CLI:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
