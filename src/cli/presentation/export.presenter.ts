// src/presentation/export.presenter.ts
import { Injectable } from '@nestjs/common';
import { IInteractiveUI } from '../domain/ports/interactive-ui.port';
import { OperationHistory } from '../application/services/operation-history.service';

@Injectable()
export class ExportPresenter {
  async show(history: OperationHistory[], ui: IInteractiveUI): Promise<void> {
    ui.clear();

    if (history.length === 0) {
      ui.showMessage('\n⚠️  Nenhuma operação para exportar', 'error');
      await ui.pause();
      return;
    }

    const operations = history.map((op) => ({
      operation: op.operation,
      'unit-cost': op.unitCost,
      quantity: op.quantity,
    }));

    const results = history.map((op) => ({ tax: op.tax }));

    console.log('\n📄 FORMATO DE EXPORTAÇÃO:\n');
    console.log('═'.repeat(62));
    console.log('\n✅ Entrada (operations):');
    console.log(JSON.stringify(operations));
    console.log('\n✅ Saída (results):');
    console.log(JSON.stringify(results));
    console.log('\n');
    console.log('═'.repeat(62));
    console.log(
      '\n💡 Dica: Copie e cole no arquivo input.txt para testar novamente\n',
    );

    await ui.pause();
  }
}
