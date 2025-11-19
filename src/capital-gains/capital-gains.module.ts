import { Module } from '@nestjs/common';

import { CapitalGainsService } from './capital-gains.service';
import { TaxCalculatorService } from './services/tax-calculator.service';

import { InMemoryPortfolioRepository } from './repositories/in-memory-portfolio.repository';
import { ProcessOperationsUseCase } from './application/use-cases/process-operations.use-case';
import { ProcessBuyOperationUseCase } from './application/use-cases/process-buy-operation.use-case';
import { ProcessSellOperationUseCase } from './application/use-cases/process-sell-operation.use-case';
import { TAX_CALCULATOR } from './domain/ports/tax-calculator.port';
import { VALIDATION_SERVICE } from './domain/ports/validation.port';
import { ValidationService } from './domain/services/validation.service';
import { PORTFOLIO_REPOSITORY } from './domain/ports/portfolio-repository.port';

@Module({
  providers: [
    { provide: TAX_CALCULATOR, useClass: TaxCalculatorService },
    { provide: VALIDATION_SERVICE, useClass: ValidationService },
    { provide: PORTFOLIO_REPOSITORY, useClass: InMemoryPortfolioRepository },
    ProcessOperationsUseCase,
    ProcessBuyOperationUseCase,
    ProcessSellOperationUseCase,
    CapitalGainsService,
  ],
  exports: [CapitalGainsService],
})
export class CapitalGainsModule {}
