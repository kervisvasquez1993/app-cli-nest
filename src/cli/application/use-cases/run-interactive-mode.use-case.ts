import { Injectable, Inject } from '@nestjs/common';
import { InteractiveProcessorService } from '../services/interactive-processor.service';
import {
  IInteractiveUI,
  INTERACTIVE_UI,
} from '../../domain/ports/interactive-ui.port';

@Injectable()
export class RunInteractiveModeUseCase {
  constructor(
    private readonly interactiveProcessor: InteractiveProcessorService,
    @Inject(INTERACTIVE_UI)
    private readonly ui: IInteractiveUI,
  ) {}

  async execute(): Promise<void> {
    this.ui.clear();
    this.showWelcome();

    let running = true;

    while (running) {
      const action = await this.ui.showMenu([
        { name: '🛒 Registrar compra', value: 'buy' },
        { name: '💸 Registrar venta', value: 'sell' },
        { name: '📊 Ver portafolio', value: 'view' },
        { name: '❌ Salir', value: 'exit' },
      ]);

      try {
        switch (action) {
          case 'buy':
            await this.handleBuy();
            break;
          case 'sell':
            await this.handleSell();
            break;
          case 'view':
            await this.handleView();
            break;
          case 'exit':
            running = false;
            this.ui.showMessage('¡Hasta luego!', 'success');
            break;
        }
      } catch (error) {
        this.ui.showMessage(
          error instanceof Error ? error.message : 'Error desconocido',
          'error',
        );
        await this.ui.pause();
      }
    }
  }

  private showWelcome(): void {
    console.log(
      '╔════════════════════════════════════════════════════════════╗',
    );
    console.log(
      '║        🏦 Capital Gains Calculator - Interactive Mode      ║',
    );
    console.log(
      '╚════════════════════════════════════════════════════════════╝\n',
    );
  }

  private async handleBuy(): Promise<void> {
    const quantity = await this.ui.promptNumber({
      message: 'Cantidad de acciones:',
      validate: (input) => input > 0 || 'Debe ser mayor a 0',
    });

    const unitCost = await this.ui.promptNumber({
      message: 'Precio unitario:',
      validate: (input) => input > 0 || 'Debe ser mayor a 0',
    });

    const result = await this.interactiveProcessor.processOperation({
      operation: 'buy',
      quantity,
      'unit-cost': unitCost,
    });

    this.ui.showMessage(
      `Compra procesada - Impuesto: $${result.tax.toFixed(2)}`,
      'success',
    );
    await this.ui.pause();
  }

  private async handleSell(): Promise<void> {
    const quantity = await this.ui.promptNumber({
      message: 'Cantidad de acciones:',
      validate: (input) => input > 0 || 'Debe ser mayor a 0',
    });

    const unitCost = await this.ui.promptNumber({
      message: 'Precio unitario:',
      validate: (input) => input > 0 || 'Debe ser mayor a 0',
    });

    const result = await this.interactiveProcessor.processOperation({
      operation: 'sell',
      quantity,
      'unit-cost': unitCost,
    });

    this.ui.showMessage(
      `Venta procesada - Impuesto: $${result.tax.toFixed(2)}`,
      'success',
    );
    await this.ui.pause();
  }

  private async handleView(): Promise<void> {
    const portfolio = await this.interactiveProcessor.getCurrentPortfolio();

    console.log('\n📊 Estado del Portafolio');
    console.log('═'.repeat(50));
    console.log(`   Total de acciones:         ${portfolio.totalShares}`);
    console.log(
      `   Precio promedio ponderado: $${portfolio.weightedAveragePrice.toFixed(2)}`,
    );
    console.log(
      `   Pérdida acumulada:         $${portfolio.accumulatedLoss.toFixed(2)}\n`,
    );

    await this.ui.pause();
  }
}
