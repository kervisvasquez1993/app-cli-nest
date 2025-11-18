import { Injectable } from '@nestjs/common';
import { Operation } from './entities/operation.entity';
import { Portfolio } from './entities/portfolio.entity';
import { OperationDto } from './dto/operation.dto';
import { TaxResultDto } from './dto/tax-result.dto';
import { TaxCalculatorService } from './services/tax-calculator.service';
import { ValidationService } from './services/validation.service';

@Injectable()
export class CapitalGainsService {
  private portfolio: Portfolio;

  constructor(
    private readonly taxCalculatorService: TaxCalculatorService,
    private readonly validationService: ValidationService,
  ) {
    this.portfolio = new Portfolio();
  }

  async processOperationsWithValidation(
    operations: any[],
  ): Promise<TaxResultDto[]> {
    const validatedOperations = await this.validationService.validateArray(
      OperationDto,
      operations,
    );
    return this.processOperations(validatedOperations);
  }

  processOperations(operations: OperationDto[]): TaxResultDto[] {
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
      this.portfolio.updateWeightedAverage(
        operation.quantity,
        operation.unitCost,
      );
      return 0;
    }

    const tax = this.taxCalculatorService.calculateTax(
      operation,
      this.portfolio,
    );

    this.portfolio.reduceShares(operation.quantity);

    return tax;
  }

  private mapToOperation(dto: OperationDto): Operation {
    return new Operation(dto.operation, dto['unit-cost'], dto.quantity);
  }
}
