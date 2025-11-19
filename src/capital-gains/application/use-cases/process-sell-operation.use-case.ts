import { Injectable, Inject } from '@nestjs/common';
import {
  IPortfolioRepository,
  PORTFOLIO_REPOSITORY,
} from '../../domain/ports/portfolio-repository.port';
import {
  ITaxCalculator,
  TAX_CALCULATOR,
} from '../../domain/ports/tax-calculator.port';
import { Operation } from '../../domain/entities/operation.entity';

@Injectable()
export class ProcessSellOperationUseCase {
  constructor(
    @Inject(PORTFOLIO_REPOSITORY)
    private readonly portfolioRepo: IPortfolioRepository,

    @Inject(TAX_CALCULATOR)
    private readonly taxCalculator: ITaxCalculator,
  ) {}

  async execute(operation: Operation): Promise<number> {
    const portfolio = await this.portfolioRepo.findCurrent();
    const tax = this.taxCalculator.calculateTax(operation, portfolio);
    portfolio.reduceShares(operation.quantity);
    await this.portfolioRepo.save(portfolio);
    return tax;
  }
}
