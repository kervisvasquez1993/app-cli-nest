export class Portfolio {
  private constructor(
    private totalShares: number = 0,
    private weightedAveragePrice: number = 0,
    private accumulatedLoss: number = 0,
  ) {}

  static create(): Portfolio {
    return new Portfolio(0, 0, 0);
  }

  static reconstitute(
    totalShares: number,
    weightedAveragePrice: number,
    accumulatedLoss: number,
  ): Portfolio {
    return new Portfolio(totalShares, weightedAveragePrice, accumulatedLoss);
  }

  getTotalShares(): number {
    return this.totalShares;
  }

  getWeightedAveragePrice(): number {
    return this.weightedAveragePrice;
  }

  getAccumulatedLoss(): number {
    return this.accumulatedLoss;
  }

  buyShares(quantity: number, unitCost: number): Portfolio {
    const currentTotal = this.totalShares * this.weightedAveragePrice;
    const newTotal = quantity * unitCost;
    const newTotalShares = this.totalShares + quantity;
    const newWeightedAverage = (currentTotal + newTotal) / newTotalShares;

    return new Portfolio(
      newTotalShares,
      this.roundToTwoDecimals(newWeightedAverage),
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
    return new Portfolio(
      this.totalShares,
      this.weightedAveragePrice,
      this.accumulatedLoss + Math.abs(loss),
    );
  }

  deductLoss(profit: number): { portfolio: Portfolio; taxableProfit: number } {
    if (this.accumulatedLoss === 0) {
      return { portfolio: this, taxableProfit: profit };
    }

    if (profit <= this.accumulatedLoss) {
      return {
        portfolio: new Portfolio(
          this.totalShares,
          this.weightedAveragePrice,
          this.accumulatedLoss - profit,
        ),
        taxableProfit: 0,
      };
    }

    const remainingProfit = profit - this.accumulatedLoss;
    return {
      portfolio: new Portfolio(this.totalShares, this.weightedAveragePrice, 0),
      taxableProfit: remainingProfit,
    };
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
