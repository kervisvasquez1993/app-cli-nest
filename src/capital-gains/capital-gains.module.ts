import { Module } from '@nestjs/common';

import { CapitalGainsService } from './capital-gains.service';
import { TaxCalculatorService } from './services/tax-calculator.service';
import { ValidationService } from './services/validation.service';

@Module({
  controllers: [],
  providers: [CapitalGainsService, TaxCalculatorService, ValidationService],
  exports: [CapitalGainsService],
})
export class CapitalGainsModule {}
