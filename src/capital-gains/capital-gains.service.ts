import { Injectable } from '@nestjs/common';
import { Operation, OperationType } from './entities/operation.entity';
import { Portfolio } from './entities/portfolio.entity';
import { OperationDto } from './dto/operation.dto';
import { TaxResultDto } from './dto/tax-result.dto';
import { TaxCalculatorService } from './services/tax-calculator.service';
import { WeightedAverageService } from './services/weighted-average.service';

@Injectable()
export class CapitalGainsService {
  private portfolio: Portfolio;

  constructor(
    private readonly taxCalculatorService: TaxCalculatorService,
    private readonly weightedAverageService: WeightedAverageService,
  ) {
    this.portfolio = new Portfolio();
  }

  processOperations(operations: OperationDto[]): TaxResultDto[] {
    // Resetear portfolio para cada nueva línea
    this.portfolio.reset();
    
    const results: TaxResultDto[] = [];

    for (const operationDto of operations) {
      const operation = this.mapToOperation(operationDto);
      const tax = this.processOperation(operation);
      results.push(new TaxResultDto(tax));
    }

    return results;
  }

  private processOperation(operation: Operation): number {
    if (operation.isBuy()) {
      // Actualizar promedio ponderado
      this.portfolio.updateWeightedAverage(
        operation.quantity,
        operation.unitCost,
      );
      return 0;
    }

    // Calcular impuesto para venta
    const tax = this.taxCalculatorService.calculateTax(
      operation,
      this.portfolio,
    );

    // Reducir cantidad de acciones en el portfolio
    this.portfolio.reduceShares(operation.quantity);

    return tax;
  }

  private mapToOperation(dto: OperationDto): Operation {
    return new Operation(
      dto.operation as unknown as OperationType,
      dto['unit-cost'],
      dto.quantity,
    );
  }
}