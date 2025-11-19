import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

import { InteractiveProcessorService } from '../../application/services/interactive-processor.service';
import { useOperationProcessor } from '../hooks/use-operation-processor.hooks';

type InputStep = 'operation' | 'unitCost' | 'quantity' | 'confirm';

interface OperationInputProps {
  processorService: InteractiveProcessorService;
}

export const OperationInput: React.FC<OperationInputProps> = ({
  processorService,
}) => {
  const [step, setStep] = useState<InputStep>('operation');
  const [operationInput, setOperationInput] = useState<string>('buy');
  const [unitCost, setUnitCost] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const { processOperation, isProcessing, error } = useOperationProcessor({
    processorService,
    onSuccess: () => {
      // Resetear formulario después de procesar
      setStep('operation');
      setOperationInput('buy');
      setUnitCost('');
      setQuantity('');
    },
  });

  const handleOperationSubmit = (value: string) => {
    const normalized = value.toLowerCase();
    if (normalized === 'buy' || normalized === 'sell') {
      setOperationInput(normalized);
      setStep('unitCost');
    }
  };

  const handleUnitCostSubmit = (value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed > 0) {
      setUnitCost(value);
      setStep('quantity');
    }
  };

  const handleQuantitySubmit = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantity(value);

      const operation = operationInput as 'buy' | 'sell';

      // Procesar la operación
      processOperation({
        operation,
        'unit-cost': parseFloat(unitCost),
        quantity: parsed,
      });
    }
  };

  if (isProcessing) {
    return (
      <Box>
        <Text color="yellow">⏳ Processando operação...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column">
        <Text color="red">❌ Erro: {error}</Text>
        <Text dimColor>Pressione Enter para continuar...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" borderStyle="round" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text bold color="blue">
          ➕ Nova Operação
        </Text>
      </Box>

      {step === 'operation' && (
        <Box>
          <Text>Tipo de operação (buy/sell): </Text>
          <TextInput
            value={operationInput}
            onChange={setOperationInput}
            onSubmit={handleOperationSubmit}
          />
        </Box>
      )}

      {step === 'unitCost' && (
        <Box flexDirection="column">
          <Box>
            <Text color="green">✓ Operação: {operationInput}</Text>
          </Box>
          <Box>
            <Text>Custo unitário (R$): </Text>
            <TextInput
              value={unitCost}
              onChange={setUnitCost}
              onSubmit={handleUnitCostSubmit}
            />
          </Box>
        </Box>
      )}

      {step === 'quantity' && (
        <Box flexDirection="column">
          <Box>
            <Text color="green">✓ Operação: {operationInput}</Text>
          </Box>
          <Box>
            <Text color="green">✓ Custo: R$ {unitCost}</Text>
          </Box>
          <Box>
            <Text>Quantidade: </Text>
            <TextInput
              value={quantity}
              onChange={setQuantity}
              onSubmit={handleQuantitySubmit}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
