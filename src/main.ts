import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIService } from './cli/cli.service';

async function bootstrap() {
  console.log('🔧 Iniciando aplicación...');
  console.log('📋 Argumentos:', process.argv);
  
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'], // Habilitar logs temporalmente
  });

  console.log('✅ Contexto creado');

  const cliService = app.get(CLIService);
  console.log('✅ CLIService obtenido');
  
  cliService.setup();
  console.log('✅ CLI configurado');
  
  cliService.run(process.argv);
  console.log('✅ CLI ejecutado');
}

bootstrap().catch(err => {
  console.error('❌ Error en bootstrap:', err);
  process.exit(1);
});