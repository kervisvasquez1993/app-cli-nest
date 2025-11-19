// src/capital-gains/application/use-cases/process-buy-operation.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  IPortfolioRepository,
  PORTFOLIO_REPOSITORY,
} from '../../domain/ports/portfolio-repository.port';
import { Operation } from '../../domain/entities/operation.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { ILogger, LOGGER } from '../../domain/ports/logger.port';

@Injectable()
export class ProcessBuyOperationUseCase {
  constructor(
    @Inject(PORTFOLIO_REPOSITORY)
    private readonly portfolioRepo: IPortfolioRepository,
    @Inject(LOGGER)
    private readonly logger: ILogger,
  ) {}

  async execute(operation: Operation): Promise<Money> {
    this.logger.debug('Processing buy operation', {
      quantity: operation.getQuantity().getValue(),
      unitCost: operation.getUnitCost().getValue(),
    });

    const portfolio = await this.portfolioRepo.findCurrent();

    const updatedPortfolio = portfolio.buyShares(
      operation.getQuantity().getValue(),
      operation.getUnitCost().getValue(),
    );

    await this.portfolioRepo.save(updatedPortfolio);

    this.logger.debug('Buy operation completed', {
      totalShares: updatedPortfolio.getTotalShares(),
      weightedAverage: updatedPortfolio.getWeightedAveragePrice(),
    });

    return Money.from(0);
  }
}
