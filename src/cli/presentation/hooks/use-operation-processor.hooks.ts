import { useState, useCallback } from 'react';

import { InteractiveProcessorService } from '../../application/services/interactive-processor.service';
import { Operation, useOperations } from '../contexts/operations.context';

interface UseOperationProcessorOptions {
  processorService: InteractiveProcessorService;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useOperationProcessor = (
  options: UseOperationProcessorOptions,
) => {
  const { addOperation, addResult, updatePortfolio } = useOperations();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processOperation = useCallback(
    async (operation: Operation) => {
      setIsProcessing(true);
      setError(null);

      try {
        // Agregar operación al estado local
        addOperation(operation);

        // Procesar operación usando el servicio real
        const result =
          await options.processorService.processOperation(operation);
        addResult(result);

        // Obtener el portfolio actualizado
        const portfolio = await options.processorService.getCurrentPortfolio();
        updatePortfolio(portfolio);

        options?.onSuccess?.();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        options?.onError?.(
          err instanceof Error ? err : new Error(errorMessage),
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [addOperation, addResult, updatePortfolio, options],
  );

  return {
    processOperation,
    isProcessing,
    error,
  };
};
