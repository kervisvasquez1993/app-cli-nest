import { Injectable } from '@nestjs/common';

import { ProcessOperationsUseCase } from './application/use-cases/process-operations.use-case';
import { TaxResultDto } from './infrastructure/dto/tax-result.dto';

@Injectable()
export class CapitalGainsService {
  constructor(private readonly processOperations: ProcessOperationsUseCase) {}

  async processOperationsWithValidation(
    operations: unknown,
  ): Promise<TaxResultDto[]> {
    return this.processOperations.execute(operations);
  }
}
