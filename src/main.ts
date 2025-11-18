import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIService } from './cli/cli.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  const cliService = app.get(CLIService);
  
  cliService.setup();
  cliService.run(process.argv);
}

bootstrap();