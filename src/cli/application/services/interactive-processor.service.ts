import { Injectable, Inject } from '@nestjs/common';
import { ProcessOperationsUseCase } from '../../../capital-gains/application/use-cases/process-operations.use-case';
import {
  IPortfolioRepository,
  PORTFOLIO_REPOSITORY,
} from '../../../capital-gains/domain/ports/portfolio-repository.port';
import { TaxResultDto } from '../../../capital-gains/infrastructure/dto/tax-result.dto';

export interface OperationInput {
  operation: 'buy' | 'sell';
  'unit-cost': number;
  quantity: number;
}

export interface PortfolioSnapshot {
  totalShares: number;
  weightedAveragePrice: number;
  accumulatedLoss: number;
}

@Injectable()
export class InteractiveProcessorService {
  constructor(
    private readonly processOperations: ProcessOperationsUseCase,
    @Inject(PORTFOLIO_REPOSITORY)
    private readonly portfolioRepo: IPortfolioRepository,
  ) {}

  async processOperation(operation: OperationInput): Promise<TaxResultDto> {
    const results = await this.processOperations.execute([operation]);
    return results[0];
  }

  async getCurrentPortfolio(): Promise<PortfolioSnapshot> {
    const portfolio = await this.portfolioRepo.findCurrent();
    return {
      totalShares: portfolio.getTotalShares(),
      weightedAveragePrice: portfolio.getWeightedAveragePrice(),
      accumulatedLoss: portfolio.getAccumulatedLoss(),
    };
  }

  async resetPortfolio(): Promise<void> {
    await this.portfolioRepo.reset();
  }
}
