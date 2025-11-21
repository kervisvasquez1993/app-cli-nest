import { Injectable } from '@nestjs/common';
import { ProcessOperationsUseCase } from '../../../capital-gains/application/use-cases/process-operations.use-case';
import { InputLine } from '../../domain/value-objects/input-line.vo';
import { OutputLine } from '../../domain/value-objects/output-line.vo';
import { JsonPresenter } from '../../infrastructure/presenters/json-presenter';

@Injectable()
export class ProcessSingleLineUseCase {
  constructor(
    private readonly processOperations: ProcessOperationsUseCase,
    private readonly jsonPresenter: JsonPresenter,
  ) {}

  async execute(inputLine: InputLine): Promise<OutputLine> {
    const operations = inputLine.parseAsJSON();
    const results = await this.processOperations.execute(operations);
    const formatted = this.jsonPresenter.format(results);

    return OutputLine.fromString(formatted);
  }
}
