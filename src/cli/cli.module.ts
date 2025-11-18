import { Module } from '@nestjs/common';
import { CapitalGainsModule } from '../capital-gains/capital-gains.module';
import { CLIService } from './cli.service';
import { CommanderAdapter } from './adapters/commander.adapter';

@Module({
  imports: [CapitalGainsModule],
  providers: [
    {
      provide: 'ICLIAdapter',
      useClass: CommanderAdapter,
    },
    CLIService,
  ],
  exports: [CLIService],
})
export class CLIModule {}
