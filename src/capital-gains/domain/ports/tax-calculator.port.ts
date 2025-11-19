import { Operation } from '../entities/operation.entity';
import { Portfolio } from '../entities/portfolio.entity';

export const TAX_CALCULATOR = Symbol('ITaxCalculator');
export interface ITaxCalculator {
  calculateTax(operation: Operation, portfolio: Portfolio): number;
}
