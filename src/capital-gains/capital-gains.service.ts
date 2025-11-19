import { Injectable } from '@nestjs/common';
import { TaxResultDto } from './dto/tax-result.dto';
import { ProcessOperationsUseCase } from './application/use-cases/process-operations.use-case';

@Injectable()
export class CapitalGainsService {
  constructor(private readonly processOperations: ProcessOperationsUseCase) {}

  async processOperationsWithValidation(
    operations: unknown,
  ): Promise<TaxResultDto[]> {
    return this.processOperations.execute(operations);
  }
}
