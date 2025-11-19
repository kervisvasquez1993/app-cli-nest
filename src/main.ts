// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIService } from './cli/cli.service';

async function bootstrap() {
  // ✅ Crear contexto de aplicación (no servidor HTTP)
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false, // Desactivar logs para CLI limpia
  });

  try {
    // ✅ Obtener el servicio CLI del contenedor
    const cliService = app.get(CLIService);

    // ✅ Configurar los comandos
    cliService.setup();

    // ✅ Ejecutar con los argumentos de la línea de comandos
    cliService.run(process.argv);

    // ⚠️ NO cerrar la app aquí - dejar que los comandos controlen el ciclo de vida
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
