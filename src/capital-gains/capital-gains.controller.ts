import { Controller } from '@nestjs/common';
import { CapitalGainsService } from './capital-gains.service';
import { OperationDto } from './dto/operation.dto';
import { TaxResultDto } from './dto/tax-result.dto';

@Controller()
export class CapitalGainsController {
  constructor(private readonly capitalGainsService: CapitalGainsService) {}

  processLine(line: string): string {
    try {
      const operations: OperationDto[] = JSON.parse(line);
      const results: TaxResultDto[] = this.capitalGainsService.processOperations(operations);
      return JSON.stringify(results);
    } catch (error) {
      console.error('Error processing line:', error.message);
      return '[]';
    }
  }
}