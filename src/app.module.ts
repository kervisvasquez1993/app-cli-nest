import { Module } from '@nestjs/common';

import { CapitalGainsModule } from './capital-gains/capital-gains.module';
import { CLIModule } from './cli/cli.module';

@Module({
  imports: [CapitalGainsModule, CLIModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
