import React from 'react';
import { Box, Text } from 'ink';

import { InteractiveProcessorService } from '../../application/services/interactive-processor.service';
import { HeaderComponent } from './header.components';
import { PortfolioStatus } from './portfoliostatus.components';
import { TaxResults } from './tax-results.component';
import { useOperations } from '../contexts/operations.context';
import { OperationInput } from './operationinput.components';

interface InteractiveModeProps {
  processorService: InteractiveProcessorService;
}

export const InteractiveMode: React.FC<InteractiveModeProps> = ({
  processorService,
}) => {
  const { operations } = useOperations();

  return (
    <Box flexDirection="column" padding={1}>
      <HeaderComponent />

      <Box flexDirection="row" marginTop={1}>
        {/* Coluna esquerda - Portfolio e Resultados */}
        <Box flexDirection="column" width="50%" marginRight={2}>
          <PortfolioStatus />
          <Box marginTop={1}>
            <TaxResults />
          </Box>
        </Box>

        {/* Coluna direita - Input de operações */}
        <Box flexDirection="column" width="50%">
          <OperationInput processorService={processorService} />

          {operations.length > 0 && (
            <Box marginTop={1} borderStyle="round" paddingX={2} paddingY={1}>
              <Text bold color="gray">
                📝 Operações: {operations.length}
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer com atalhos */}
      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={2}>
        <Text dimColor>Atalhos: [Ctrl+C] Sair | [Ctrl+R] Resetar</Text>
      </Box>
    </Box>
  );
};
