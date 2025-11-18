import { Injectable } from '@nestjs/common';

@Injectable()
export class WeightedAverageService {
  calculate(
    currentShares: number,
    currentAverage: number,
    newShares: number,
    newPrice: number,
  ): number {
    if (currentShares + newShares === 0) {
      return 0;
    }

    const currentTotal = currentShares * currentAverage;
    const newTotal = newShares * newPrice;
    
    return (currentTotal + newTotal) / (currentShares + newShares);
  }
}