// src/presentation/history.presenter.ts
import { Injectable } from '@nestjs/common';
import { IInteractiveUI } from '../domain/ports/interactive-ui.port';
import { OperationHistory } from '../application/services/operation-history.service';

@Injectable()
export class HistoryPresenter {
  async show(history: OperationHistory[], ui: IInteractiveUI): Promise<void> {
    ui.clear();

    if (history.length === 0) {
      ui.showMessage('\nℹ️  Nenhuma operação registrada ainda', 'info');
      await ui.pause();
      return;
    }

    console.log('\n📜 HISTORIAL DE OPERAÇÕES\n');
    this.showTable(history);

    const totalTax = history.reduce((sum, op) => sum + op.tax, 0);
    console.log(`\n💰 Total de impostos pagos: R$ ${totalTax.toFixed(2)}`);

    await ui.pause();
  }

  private showTable(history: OperationHistory[]): void {
    console.log(
      '┌────┬──────────┬────────────┬─────────────┬──────────────┬─────────────────────┐',
    );
    console.log(
      '│ #  │ Tipo     │ Quantidade │ Preço Unit  │ Imposto      │ Data/Hora           │',
    );
    console.log(
      '├────┼──────────┼────────────┼─────────────┼──────────────┼─────────────────────┤',
    );

    history.forEach((op, index) => {
      const num = String(index + 1).padStart(2);
      const type = op.operation === 'buy' ? '🛒 COMPRA' : '💸 VENDA ';
      const qty = String(op.quantity).padStart(10);
      const price = `R$ ${op.unitCost.toFixed(2)}`.padStart(11);
      const tax = `R$ ${op.tax.toFixed(2)}`.padStart(12);
      const date = op.timestamp
        .toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        })
        .padStart(19);

      console.log(
        `│ ${num} │ ${type} │ ${qty} │ ${price} │ ${tax} │ ${date} │`,
      );
    });

    console.log(
      '└────┴──────────┴────────────┴─────────────┴──────────────┴─────────────────────┘',
    );
  }
}
