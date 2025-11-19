import { Injectable, Inject } from '@nestjs/common';
import {
  IPortfolioRepository,
  PORTFOLIO_REPOSITORY,
} from '../../domain/ports/portfolio-repository.port';
import { Operation } from '../../domain/entities/operation.entity';

@Injectable()
export class ProcessBuyOperationUseCase {
  constructor(
    @Inject(PORTFOLIO_REPOSITORY)
    private readonly portfolioRepo: IPortfolioRepository,
  ) {}

  async execute(operation: Operation): Promise<number> {
    const portfolio = await this.portfolioRepo.findCurrent();
    portfolio.updateWeightedAverage(operation.quantity, operation.unitCost);
    await this.portfolioRepo.save(portfolio);
    return 0;
  }
}
