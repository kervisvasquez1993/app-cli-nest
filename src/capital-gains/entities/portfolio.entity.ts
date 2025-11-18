export class Portfolio {
  private totalShares: number = 0;
  private weightedAveragePrice: number = 0;
  private accumulatedLoss: number = 0;

  getTotalShares(): number {
    return this.totalShares;
  }

  getWeightedAveragePrice(): number {
    return this.weightedAveragePrice;
  }

  getAccumulatedLoss(): number {
    return this.accumulatedLoss;
  }

  // Actualizar el promedio ponderado cuando compramos acciones
  updateWeightedAverage(quantity: number, unitCost: number): void {
    const currentTotal = this.totalShares * this.weightedAveragePrice;
    const newTotal = quantity * unitCost;
    
    this.totalShares += quantity;
    // ✅ Redondear a 2 decimales
    this.weightedAveragePrice = Math.round(((currentTotal + newTotal) / this.totalShares) * 100) / 100;
  }

  // Reducir cantidad de acciones cuando vendemos
  reduceShares(quantity: number): void {
    this.totalShares -= quantity;
  }

  // Acumular pérdida
  addLoss(loss: number): void {
    this.accumulatedLoss += Math.abs(loss);
  }

  // Deducir pérdida acumulada del lucro
  deductLoss(profit: number): number {
    if (this.accumulatedLoss === 0) {
      return profit;
    }

    if (profit <= this.accumulatedLoss) {
      this.accumulatedLoss -= profit;
      return 0;
    }

    const remainingProfit = profit - this.accumulatedLoss;
    this.accumulatedLoss = 0;
    return remainingProfit;
  }

  // Resetear portfolio (para nueva línea de entrada)
  reset(): void {
    this.totalShares = 0;
    this.weightedAveragePrice = 0;
    this.accumulatedLoss = 0;
  }
}