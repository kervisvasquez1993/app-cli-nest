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
    // ✅ AGREGAR ESTAS VALIDACIONES
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (unitCost <= 0) {
      throw new Error('Unit cost must be greater than zero');
    }

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
    // ✅ AGREGAR ESTAS VALIDACIONES
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (quantity > this.totalShares) {
      throw new Error(
        `Cannot sell ${quantity} shares. Only ${this.totalShares} shares available`,
      );
    }

    return new Portfolio(
      this.totalShares - quantity,
      this.weightedAveragePrice,
      this.accumulatedLoss,
    );
  }

  recordLoss(loss: number): Portfolio {
    // ✅ AGREGAR ESTA VALIDACIÓN
    if (loss < 0) {
      throw new Error('Loss must be a positive number');
    }

    return new Portfolio(
      this.totalShares,
      this.weightedAveragePrice,
      this.accumulatedLoss + loss, // ✅ Cambié Math.abs(loss) por solo loss
    );
  }

  deductLoss(profit: number): { portfolio: Portfolio; taxableProfit: number } {
    // ✅ AGREGAR ESTA VALIDACIÓN
    if (profit < 0) {
      throw new Error('Profit must be a positive number');
    }

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
