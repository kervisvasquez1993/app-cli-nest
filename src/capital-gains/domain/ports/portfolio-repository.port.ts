import { Portfolio } from '../entities/portfolio.entity';

export const PORTFOLIO_REPOSITORY = Symbol('IPortfolioRepository');

export interface IPortfolioRepository {
  findCurrent(): Promise<Portfolio>;
  save(portfolio: Portfolio): Promise<void>;
  reset(): Promise<void>;
}
