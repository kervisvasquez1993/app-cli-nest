import React from 'react';

import { InteractiveProcessorService } from '../../application/services/interactive-processor.service';
import { OperationsProvider } from '../contexts/operations.context';
import { InteractiveMode } from './interactivemode.components';

interface AppProps {
  processorService: InteractiveProcessorService;
}

export const App: React.FC<AppProps> = ({ processorService }) => {
  return (
    <OperationsProvider>
      <InteractiveMode processorService={processorService} />
    </OperationsProvider>
  );
};
