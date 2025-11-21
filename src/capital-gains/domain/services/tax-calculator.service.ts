import { Operation } from '../entities/operation.entity';
import { Portfolio } from '../entities/portfolio.entity';
import { Money } from '../value-objects/money.vo';

export class TaxCalculationService {
  private static readonly TAX_RATE = 0.2;
  private static readonly TAX_FREE_LIMIT = Money.from(20000);

  static calculateTax(
    operation: Operation,
    portfolio: Portfolio,
  ): { tax: Money; updatedPortfolio: Portfolio } {
    // 1. Buy operations never pay tax
    if (operation.isBuy()) {
      return {
        tax: Money.zero(),
        updatedPortfolio: portfolio,
      };
    }

    // 2. Calculate profit or loss
    const profitOrLoss = this.calculateProfitOrLoss(operation, portfolio);

    // 3. If loss, accumulate it (regardless of operation value)
    if (profitOrLoss.isNegative()) {
      return {
        tax: Money.zero(),
        updatedPortfolio: portfolio.recordLoss(profitOrLoss.abs().getValue()),
      };
    }

    // 4. If no profit/loss, no tax
    if (profitOrLoss.isZero()) {
      return {
        tax: Money.zero(),
        updatedPortfolio: portfolio,
      };
    }

    // 5. Check tax-free limit FIRST (before deducting losses)
    // If operation ≤ 20k: no tax, no loss deduction
    if (operation.getTotalValue().isLessThanOrEqual(this.TAX_FREE_LIMIT)) {
      return {
        tax: Money.zero(),
        updatedPortfolio: portfolio, // ✅ NO deduce pérdidas
      };
    }

    // 6. Deduct accumulated losses from profit (only if operation > 20k)
    const { portfolio: portfolioAfterDeduction, taxableProfit } =
      portfolio.deductLoss(profitOrLoss.getValue());

    // 7. Calculate tax on taxable profit
    const tax = Money.from(taxableProfit * this.TAX_RATE);

    return {
      tax: tax.round(),
      updatedPortfolio: portfolioAfterDeduction,
    };
  }

  private static calculateProfitOrLoss(
    operation: Operation,
    portfolio: Portfolio,
  ): Money {
    const weightedAverage = Money.from(portfolio.getWeightedAveragePrice());
    const profitPerShare = operation.getUnitCost().subtract(weightedAverage);
    const totalProfit = profitPerShare.multiply(
      operation.getQuantity().getValue(),
    );

    return totalProfit;
  }
}
