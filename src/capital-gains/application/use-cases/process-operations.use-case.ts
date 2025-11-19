import { Injectable, Inject } from '@nestjs/common';
import { OperationDto } from '../../dto/operation.dto';
import { TaxResultDto } from '../../dto/tax-result.dto';

import { ProcessBuyOperationUseCase } from './process-buy-operation.use-case';
import { ProcessSellOperationUseCase } from './process-sell-operation.use-case';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from '../../domain/ports/validation.port';
import { Operation } from '../../domain/entities/operation.entity';

@Injectable()
export class ProcessOperationsUseCase {
  constructor(
    @Inject(VALIDATION_SERVICE)
    private readonly validator: IValidationService,

    private readonly buyUseCase: ProcessBuyOperationUseCase,
    private readonly sellUseCase: ProcessSellOperationUseCase,
  ) {}

  async execute(operations: unknown): Promise<TaxResultDto[]> {
    const validated = await this.validator.validateArray(
      OperationDto,
      operations,
    );
    const results: TaxResultDto[] = [];

    for (const dto of validated) {
      const operation = new Operation(
        dto.operation,
        dto['unit-cost'],
        dto.quantity,
      );

      const tax = operation.isBuy()
        ? await this.buyUseCase.execute(operation)
        : await this.sellUseCase.execute(operation);

      results.push(new TaxResultDto(tax));
    }

    return results;
  }
}
