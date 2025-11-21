// src/cli/infrastructure/presenters/json-presenter.ts
import { Injectable } from '@nestjs/common';
import { TaxResultDto } from '../../../capital-gains/infrastructure/dto/tax-result.dto';

export interface PresenterOptions {
  pretty?: boolean;
  indent?: number;
}

@Injectable()
export class JsonPresenter {
  /**
   * Formatea un array de resultados de impuestos como JSON
   */
  format(results: TaxResultDto[], options?: PresenterOptions): string {
    if (options?.pretty) {
      return JSON.stringify(results, null, options.indent || 2);
    }
    return JSON.stringify(results);
  }

  /**
   * Formatea múltiples líneas de resultados
   */
  formatMultiple(
    resultsArray: TaxResultDto[][],
    options?: PresenterOptions,
  ): string[] {
    return resultsArray.map((results) => this.format(results, options));
  }

  /**
   * Formatea con metadatos adicionales
   */
  formatWithMetadata(
    results: TaxResultDto[],
    metadata: {
      processedAt?: Date;
      totalOperations?: number;
      totalTax?: number;
    },
  ): string {
    const totalTax = results.reduce((sum, result) => sum + result.tax, 0);

    return JSON.stringify(
      {
        metadata: {
          processedAt: metadata.processedAt || new Date(),
          totalOperations: metadata.totalOperations || results.length,
          totalTax: metadata.totalTax || totalTax,
        },
        results,
      },
      null,
      2,
    );
  }
}
