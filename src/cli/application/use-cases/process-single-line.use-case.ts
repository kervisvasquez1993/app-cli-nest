import { Injectable } from '@nestjs/common';
import { ProcessOperationsUseCase } from '../../../capital-gains/application/use-cases/process-operations.use-case';
import { InputLine } from '../../domain/value-objects/input-line.vo';
import { OutputLine } from '../../domain/value-objects/output-line.vo';

@Injectable()
export class ProcessSingleLineUseCase {
  constructor(private readonly processOperations: ProcessOperationsUseCase) {}

  async execute(inputLine: InputLine): Promise<OutputLine> {
    const operations = inputLine.parseAsJSON();
    const results = await this.processOperations.execute(operations);
    return OutputLine.fromJSON(results);
  }
}
