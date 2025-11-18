import { Injectable } from '@nestjs/common';
import { Operation } from '../entities/operation.entity';
import { Portfolio } from '../entities/portfolio.entity';

@Injectable()
export class TaxCalculatorService {
  private readonly TAX_RATE = 0.2; // 20%
  private readonly TAX_FREE_LIMIT = 20000; // R$ 20,000

  calculateTax(operation: Operation, portfolio: Portfolio): number {
    // Operaciones de compra no pagan impuesto
    if (operation.isBuy()) {
      return 0;
    }

    // Calcular profit o loss
    const profitOrLoss = this.calculateProfitOrLoss(operation, portfolio);

    // Si hay pérdida, acumularla SIEMPRE (independiente del límite)
    if (profitOrLoss < 0) {
      portfolio.addLoss(profitOrLoss);
      return 0;
    }

    // Si el valor total es <= R$ 20,000 no paga impuesto
    // PERO ya manejamos las pérdidas arriba
    const totalOperationValue = operation.getTotalValue();
    if (totalOperationValue <= this.TAX_FREE_LIMIT) {
      return 0;
    }

    // Si hay lucro, deducir pérdidas acumuladas
    const taxableProfit = portfolio.deductLoss(profitOrLoss);

    // Calcular impuesto sobre el lucro restante
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
