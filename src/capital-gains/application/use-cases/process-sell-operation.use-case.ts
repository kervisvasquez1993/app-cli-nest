import { Injectable, Inject } from '@nestjs/common';
import {
  IPortfolioRepository,
  PORTFOLIO_REPOSITORY,
} from '../../domain/ports/portfolio-repository.port';
import { Operation } from '../../domain/entities/operation.entity';
import { Money } from '../../domain/value-objects/money.vo';

import { ILogger, LOGGER } from '../../domain/ports/logger.port';
import { TaxCalculationService } from 'src/capital-gains/domain/services/tax-calculator.service';

@Injectable()
export class ProcessSellOperationUseCase {
  constructor(
    @Inject(PORTFOLIO_REPOSITORY)
    private readonly portfolioRepo: IPortfolioRepository,
    @Inject(LOGGER)
    private readonly logger: ILogger,
  ) {}

  async execute(operation: Operation): Promise<Money> {
    this.logger.debug('Processing sell operation', {
      quantity: operation.getQuantity().getValue(),
      unitCost: operation.getUnitCost().getValue(),
    });

    const portfolio = await this.portfolioRepo.findCurrent();

    const { tax, updatedPortfolio } = TaxCalculationService.calculateTax(
      operation,
      portfolio,
    );

    const portfolioAfterSale = updatedPortfolio.sellShares(
      operation.getQuantity().getValue(),
    );

    await this.portfolioRepo.save(portfolioAfterSale);

    this.logger.debug('Sell operation completed', {
      tax: tax.getValue(),
      remainingShares: portfolioAfterSale.getTotalShares(),
      accumulatedLoss: portfolioAfterSale.getAccumulatedLoss(),
    });

    return tax;
  }
}
