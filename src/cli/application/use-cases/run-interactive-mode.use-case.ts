import { Injectable } from '@nestjs/common';
import { render } from 'ink';
import React from 'react';
import { InteractiveProcessorService } from '../services/interactive-processor.service';
import { App } from '../../presentation/components/App';

@Injectable()
export class RunInteractiveModeUseCase {
  constructor(
    private readonly interactiveProcessor: InteractiveProcessorService,
  ) {}

  async execute(): Promise<void> {
    // Renderizamos el componente de React en la terminal
    const { waitUntilExit } = render(
      React.createElement(App, { processorService: this.interactiveProcessor }),
    );

    // Esperamos hasta que el usuario salga (Ctrl+C)
    await waitUntilExit();
  }
}
