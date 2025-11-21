import { Injectable, Inject } from '@nestjs/common';

import { ProcessBuyOperationUseCase } from './process-buy-operation.use-case';
import { ProcessSellOperationUseCase } from './process-sell-operation.use-case';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from '../../domain/ports/validation.port';
import { Operation } from '../../domain/entities/operation.entity';
import { ILogger, LOGGER } from '../../domain/ports/logger.port';
import { TaxResultDto } from '../../infrastructure/dto/tax-result.dto';
import { OperationDto } from '../../infrastructure/dto/operation.dto';

@Injectable()
export class ProcessOperationsUseCase {
  constructor(
    @Inject(VALIDATION_SERVICE)
    private readonly validator: IValidationService,
    @Inject(LOGGER)
    private readonly logger: ILogger,
    private readonly buyUseCase: ProcessBuyOperationUseCase,
    private readonly sellUseCase: ProcessSellOperationUseCase,
  ) {}

  async execute(operations: unknown): Promise<TaxResultDto[]> {
    this.logger.info('Starting operations processing');

    const validated = await this.validator.validateArray(
      OperationDto,
      operations,
    );

    const results: TaxResultDto[] = [];

    for (const [index, dto] of validated.entries()) {
      this.logger.debug(
        `Processing operation ${index + 1}/${validated.length}`,
      );

      const operation = Operation.create(
        dto.operation,
        dto['unit-cost'],
        dto.quantity,
      );

      const tax = operation.isBuy()
        ? await this.buyUseCase.execute(operation)
        : await this.sellUseCase.execute(operation);

      results.push(new TaxResultDto(tax.getValue()));
    }

    this.logger.info('Operations processing completed', {
      totalOperations: results.length,
    });

    return results;
  }
}
