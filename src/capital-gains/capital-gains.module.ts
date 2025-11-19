import { Module } from '@nestjs/common';
import { CapitalGainsService } from './capital-gains.service';

import { ProcessOperationsUseCase } from './application/use-cases/process-operations.use-case';
import { ProcessBuyOperationUseCase } from './application/use-cases/process-buy-operation.use-case';
import { ProcessSellOperationUseCase } from './application/use-cases/process-sell-operation.use-case';
import { VALIDATION_SERVICE } from './domain/ports/validation.port';

import { PORTFOLIO_REPOSITORY } from './domain/ports/portfolio-repository.port';
import { LOGGER } from './domain/ports/logger.port';

import { InMemoryPortfolioRepository } from './insfrastructure/repositories/in-memory-portfolio.repository';
import { ConsoleLoggerAdapter } from './insfrastructure/logger/console-logger.adapter';
import { ValidationService } from './insfrastructure/validation/validation.service';

@Module({
  providers: [
    { provide: VALIDATION_SERVICE, useClass: ValidationService },
    { provide: PORTFOLIO_REPOSITORY, useClass: InMemoryPortfolioRepository },
    { provide: LOGGER, useClass: ConsoleLoggerAdapter },
    ProcessOperationsUseCase,
    ProcessBuyOperationUseCase,
    ProcessSellOperationUseCase,
    CapitalGainsService,
  ],
  exports: [
    CapitalGainsService,
    ProcessOperationsUseCase,
    PORTFOLIO_REPOSITORY,
  ],
})
export class CapitalGainsModule {}
