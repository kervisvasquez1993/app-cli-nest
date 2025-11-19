import { Injectable } from '@nestjs/common';
import { IPortfolioRepository } from '../domain/ports/portfolio-repository.port';
import { Portfolio } from '../domain/entities/portfolio.entity';

@Injectable()
export class InMemoryPortfolioRepository implements IPortfolioRepository {
  private portfolio: Portfolio = new Portfolio();

  findCurrent(): Promise<Portfolio> {
    return Promise.resolve(this.portfolio);
  }

  save(portfolio: Portfolio): Promise<void> {
    this.portfolio = portfolio;
    return Promise.resolve();
  }

  reset(): Promise<void> {
    this.portfolio = new Portfolio();
    return Promise.resolve();
  }
}
