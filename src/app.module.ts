import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CapitalGainsModule } from './capital-gains/capital-gains.module';

@Module({
  imports: [CapitalGainsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
