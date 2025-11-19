import { Injectable } from '@nestjs/common';
import { Operation } from '../entities/operation.entity';
import { Portfolio } from '../entities/portfolio.entity';
import { ITaxCalculator } from '../ports/tax-calculator.port';

@Injectable()
export class TaxCalculatorService implements ITaxCalculator {
  private readonly TAX_RATE = 0.2;
  private readonly TAX_FREE_LIMIT = 20000;

  calculateTax(operation: Operation, portfolio: Portfolio): number {
    if (operation.isBuy()) {
      return 0;
    }

    const profitOrLoss = this.calculateProfitOrLoss(operation, portfolio);
    if (profitOrLoss < 0) {
      portfolio.addLoss(profitOrLoss);
      return 0;
    }

    const totalOperationValue = operation.getTotalValue();
    if (totalOperationValue <= this.TAX_FREE_LIMIT) {
      return 0;
    }
    const taxableProfit = portfolio.deductLoss(profitOrLoss);
    return taxableProfit * this.TAX_RATE;
  }

  private calculateProfitOrLoss(
    operation: Operation,
    portfolio: Portfolio,
  ): number {
    const weightedAverage = portfolio.getWeightedAveragePrice();
    const profitPerShare = operation.unitCost - weightedAverage;

    return profitPerShare * operation.quantity;
  }
}
