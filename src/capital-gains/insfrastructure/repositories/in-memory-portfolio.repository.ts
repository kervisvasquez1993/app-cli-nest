import { Injectable } from '@nestjs/common';
import { Portfolio } from 'src/capital-gains/domain/entities/portfolio.entity';

import { IPortfolioRepository } from 'src/capital-gains/domain/ports/portfolio-repository.port';

@Injectable()
export class InMemoryPortfolioRepository implements IPortfolioRepository {
  private portfolio: Portfolio = Portfolio.create();

  findCurrent(): Promise<Portfolio> {
    return Promise.resolve(this.portfolio);
  }

  save(portfolio: Portfolio): Promise<void> {
    this.portfolio = portfolio;
    return Promise.resolve();
  }

  reset(): Promise<void> {
    this.portfolio = Portfolio.create();
    return Promise.resolve();
  }
}
