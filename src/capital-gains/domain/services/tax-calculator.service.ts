import { Injectable } from '@nestjs/common';
import { Operation } from '../entities/operation.entity';
import { Portfolio } from '../entities/portfolio.entity';
import { ITaxCalculator } from '../ports/tax-calculator.port';

@Injectable()
export class TaxCalculatorService implements ITaxCalculator {
  private readonly TAX_RATE = 0.2; // 20%
  private readonly TAX_FREE_LIMIT = 20000; // R$ 20,000

  calculateTax(operation: Operation, portfolio: Portfolio): number {
    if (operation.isBuy()) {
      return 0;
    }

    const profitOrLoss = this.calculateProfitOrLoss(operation, portfolio);
    console.log(`[DEBUG] Profit/Loss: ${profitOrLoss}`);

    if (profitOrLoss < 0) {
      portfolio.addLoss(profitOrLoss);
      console.log(
        `[DEBUG] Loss added. Total accumulated: ${portfolio.getAccumulatedLoss()}`,
      );
      return 0;
    }

    const totalOperationValue = operation.getTotalValue();
    console.log(`[DEBUG] Total operation value: ${totalOperationValue}`);

    if (totalOperationValue <= this.TAX_FREE_LIMIT) {
      console.log(`[DEBUG] Below tax-free limit, no tax`);
      return 0;
    }

    const taxableProfit = portfolio.deductLoss(profitOrLoss);
    console.log(`[DEBUG] Taxable profit after deduction: ${taxableProfit}`);

    const tax = taxableProfit * this.TAX_RATE;
    console.log(`[DEBUG] Tax calculated: ${tax}`);

    return Math.round(tax * 100) / 100;
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
