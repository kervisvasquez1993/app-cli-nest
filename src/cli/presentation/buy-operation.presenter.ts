// src/presentation/buy-operation.presenter.ts
import { Injectable } from '@nestjs/common';
import { IInteractiveUI } from '../domain/ports/interactive-ui.port';

export interface BuyOperationInput {
  quantity: number;
  unitCost: number;
  confirmed: boolean;
}

@Injectable()
export class BuyOperationPresenter {
  async collectInput(ui: IInteractiveUI): Promise<BuyOperationInput> {
    ui.clear();
    console.log('\n🛒 REGISTRAR COMPRA DE AÇÕES\n');

    const quantity = await this.promptQuantity(ui);
    const unitCost = await this.promptPrice(ui);

    this.showSummary(quantity, unitCost);

    const confirmed = await ui.promptConfirm({
      message: '\nConfirmar operação?',
      default: true,
    });

    return { quantity, unitCost, confirmed };
  }

  async showResult(
    portfolio: any,
    result: any,
    ui: IInteractiveUI,
  ): Promise<void> {
    console.log('\n✅ Compra registrada com sucesso!\n');
    console.log('📊 Portafolio Atualizado:');
    console.log('═'.repeat(50));
    console.log(`   Total de ações:         ${portfolio.totalShares}`);
    console.log(
      `   Preço médio ponderado:  R$ ${portfolio.weightedAveragePrice.toFixed(2)}`,
    );
    console.log(
      `   Prejuízo acumulado:     R$ ${portfolio.accumulatedLoss.toFixed(2)}`,
    );
    console.log(`   Imposto pago:           R$ ${result.tax.toFixed(2)}`);
    console.log('═'.repeat(50));

    await ui.pause();
  }

  private async promptQuantity(ui: IInteractiveUI): Promise<number> {
    return ui.promptNumber({
      message: 'Quantidade de ações (número inteiro):',
      validate: (input) => {
        if (!Number.isInteger(input)) {
          return 'A quantidade deve ser um número inteiro';
        }
        if (input <= 0) {
          return 'A quantidade deve ser maior que 0';
        }
        if (input > 1000000) {
          return 'Quantidade máxima: 1.000.000 ações';
        }
        return true;
      },
    });
  }

  private async promptPrice(ui: IInteractiveUI): Promise<number> {
    return ui.promptNumber({
      message: 'Preço unitário (R$):',
      validate: (input) => {
        if (input <= 0) {
          return 'O preço deve ser maior que 0';
        }
        if (input > 1000000) {
          return 'Preço máximo: R$ 1.000.000';
        }
        return true;
      },
    });
  }

  private showSummary(quantity: number, unitCost: number): void {
    const totalValue = quantity * unitCost;

    console.log('\n📋 Resumo da Operação:');
    console.log('═'.repeat(50));
    console.log(`   Operação:      COMPRA`);
    console.log(`   Quantidade:    ${quantity} ações`);
    console.log(`   Preço unit.:   R$ ${unitCost.toFixed(2)}`);
    console.log(`   Valor total:   R$ ${totalValue.toFixed(2)}`);
    console.log('═'.repeat(50));
  }
}
