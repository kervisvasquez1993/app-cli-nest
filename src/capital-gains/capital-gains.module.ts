import { Module } from '@nestjs/common';
import { CapitalGainsController } from './capital-gains.controller';
import { CapitalGainsService } from './capital-gains.service';
import { TaxCalculatorService } from './services/tax-calculator.service';
import { WeightedAverageService } from './services/weighted-average.service';

@Module({
  controllers: [CapitalGainsController],
  providers: [
    CapitalGainsService,
    TaxCalculatorService,
    WeightedAverageService,
  ],
  exports: [CapitalGainsService],
})
export class CapitalGainsModule {}
