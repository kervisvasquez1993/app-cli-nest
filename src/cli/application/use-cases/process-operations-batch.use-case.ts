import { Injectable, Inject } from '@nestjs/common';
import { ProcessSingleLineUseCase } from './process-single-line.use-case';
import { InputLine } from '../../domain/value-objects/input-line.vo';
import { OutputLine } from '../../domain/value-objects/output-line.vo';
import {
  IPortfolioRepository,
  PORTFOLIO_REPOSITORY,
} from '../../../capital-gains/domain/ports/portfolio-repository.port';

@Injectable()
export class ProcessOperationsBatchUseCase {
  constructor(
    private readonly processSingleLine: ProcessSingleLineUseCase,
    @Inject(PORTFOLIO_REPOSITORY)
    private readonly portfolioRepo: IPortfolioRepository,
  ) {}

  async execute(inputLines: InputLine[]): Promise<OutputLine[]> {
    const results: OutputLine[] = [];

    for (const line of inputLines) {
      await this.portfolioRepo.reset();
      const result = await this.processSingleLine.execute(line);
      results.push(result);
    }

    return results;
  }
}
