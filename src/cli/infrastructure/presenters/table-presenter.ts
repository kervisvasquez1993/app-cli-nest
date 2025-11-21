// src/cli/infrastructure/presenters/table-presenter.ts
import { Injectable } from '@nestjs/common';
import { TaxResultDto } from '../../../capital-gains/infrastructure/dto/tax-result.dto';

@Injectable()
export class TablePresenter {
  /**
   * Formatea resultados como tabla ASCII
   */
  format(results: TaxResultDto[]): string {
    const rows: string[] = [];

    // Header
    rows.push('┌──────────┬─────────────┐');
    rows.push('│ Operação │ Imposto (R$)│');
    rows.push('├──────────┼─────────────┤');

    // Data
    results.forEach((result, index) => {
      const operationNum = String(index + 1).padStart(8);
      const tax = result.tax.toFixed(2).padStart(11);
      rows.push(`│ ${operationNum} │ ${tax} │`);
    });

    // Footer
    rows.push('└──────────┴─────────────┘');

    // Total
    const totalTax = results.reduce((sum, r) => sum + r.tax, 0);
    rows.push(`Total de Impostos: R$ ${totalTax.toFixed(2)}`);

    return rows.join('\n');
  }

  /**
   * Formatea múltiples líneas con separadores
   */
  formatMultiple(resultsArray: TaxResultDto[][]): string {
    return resultsArray
      .map((results, index) => {
        return `\n=== Linha ${index + 1} ===\n${this.format(results)}`;
      })
      .join('\n\n');
  }

  /**
   * Formatea una sola línea compacta (sin tablas)
   */
  formatCompact(results: TaxResultDto[]): string {
    return results.map((r) => `{ tax: ${r.tax.toFixed(1)} }`).join(', ');
  }
}
