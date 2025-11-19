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
    if (operation.isBuy()) {
      return {
        tax: Money.zero(),
        updatedPortfolio: portfolio,
      };
    }

    const profitOrLoss = this.calculateProfitOrLoss(operation, portfolio);

    if (profitOrLoss.isNegative()) {
      return {
        tax: Money.zero(),
        updatedPortfolio: portfolio.recordLoss(profitOrLoss.abs().getValue()),
      };
    }
    if (profitOrLoss.isZero()) {
      return {
        tax: Money.zero(),
        updatedPortfolio: portfolio,
      };
    }

    if (operation.getTotalValue().isLessThanOrEqual(this.TAX_FREE_LIMIT)) {
      return {
        tax: Money.zero(),
        updatedPortfolio: portfolio,
      };
    }

    const { portfolio: updatedPortfolio, taxableProfit } = portfolio.deductLoss(
      profitOrLoss.getValue(),
    );

    const tax = Money.from(taxableProfit * this.TAX_RATE);

    return {
      tax: tax.round(),
      updatedPortfolio,
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
