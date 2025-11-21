import { Money } from '../value-objects/money.vo';

export class Portfolio {
  private constructor(
    private totalShares: number = 0,
    private weightedAveragePrice: Money = Money.zero(),
    private accumulatedLoss: Money = Money.zero(),
  ) {}

  static create(): Portfolio {
    return new Portfolio(0, Money.zero(), Money.zero());
  }

  static reconstitute(
    totalShares: number,
    weightedAveragePrice: number,
    accumulatedLoss: number,
  ): Portfolio {
    return new Portfolio(
      totalShares,
      Money.from(weightedAveragePrice),
      Money.from(accumulatedLoss),
    );
  }

  getTotalShares(): number {
    return this.totalShares;
  }

  getWeightedAveragePrice(): number {
    return this.weightedAveragePrice.getValue();
  }

  getAccumulatedLoss(): number {
    return this.accumulatedLoss.getValue();
  }

  buyShares(quantity: number, unitCost: number): Portfolio {
    if (this.totalShares === 0) {
      // primer compra: media = unitCost directamente
      return new Portfolio(
        quantity,
        Money.from(unitCost).round(),
        this.accumulatedLoss,
      );
    }

    const currentTotal = this.weightedAveragePrice.multiply(this.totalShares);
    const newTotal = Money.from(unitCost).multiply(quantity);
    const newTotalShares = this.totalShares + quantity;

    const newWeightedAverageValue =
      (currentTotal.getValue() + newTotal.getValue()) / newTotalShares;

    const newWeightedAverage = Money.from(newWeightedAverageValue).round();

    return new Portfolio(
      newTotalShares,
      newWeightedAverage,
      this.accumulatedLoss,
    );
  }

  sellShares(quantity: number): Portfolio {
    return new Portfolio(
      this.totalShares - quantity,
      this.weightedAveragePrice,
      this.accumulatedLoss,
    );
  }

  recordLoss(loss: number): Portfolio {
    const lossMoney = Money.from(Math.abs(loss));
    return new Portfolio(
      this.totalShares,
      this.weightedAveragePrice,
      this.accumulatedLoss.add(lossMoney),
    );
  }

  deductLoss(profit: number): { portfolio: Portfolio; taxableProfit: number } {
    const profitMoney = Money.from(profit);

    if (this.accumulatedLoss.isZero()) {
      return { portfolio: this, taxableProfit: profit };
    }

    if (profitMoney.isLessThanOrEqual(this.accumulatedLoss)) {
      const remainingLoss = this.accumulatedLoss.subtract(profitMoney);
      return {
        portfolio: new Portfolio(
          this.totalShares,
          this.weightedAveragePrice,
          remainingLoss,
        ),
        taxableProfit: 0,
      };
    }

    const remainingProfit = profitMoney.subtract(this.accumulatedLoss);
    return {
      portfolio: new Portfolio(
        this.totalShares,
        this.weightedAveragePrice,
        Money.zero(),
      ),
      taxableProfit: remainingProfit.getValue(),
    };
  }
}
