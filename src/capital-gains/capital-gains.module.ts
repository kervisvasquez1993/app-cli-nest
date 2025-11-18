import { Module } from '@nestjs/common';
import { CapitalGainsService } from './capital-gains.service';
import { CapitalGainsController } from './capital-gains.controller';

@Module({
  providers: [CapitalGainsService],
  controllers: [CapitalGainsController]
})
export class CapitalGainsModule {}
