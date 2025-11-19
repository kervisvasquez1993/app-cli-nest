import React, { createContext, useContext, useState, useCallback } from 'react';
import { TaxResultDto } from '../../../capital-gains/dto/tax-result.dto';

export interface Operation {
  operation: 'buy' | 'sell';
  'unit-cost': number;
  quantity: number;
}

export interface PortfolioState {
  totalShares: number;
  weightedAveragePrice: number;
  accumulatedLoss: number;
}

interface OperationsContextValue {
  operations: Operation[];
  results: TaxResultDto[];
  portfolio: PortfolioState;
  addOperation: (operation: Operation) => void;
  addResult: (result: TaxResultDto) => void;
  updatePortfolio: (portfolio: PortfolioState) => void;
  reset: () => void;
  initialize: (initialState?: Partial<OperationsState>) => void;
}

interface OperationsState {
  operations: Operation[];
  results: TaxResultDto[];
  portfolio: PortfolioState;
}

const defaultState: OperationsState = {
  operations: [],
  results: [],
  portfolio: {
    totalShares: 0,
    weightedAveragePrice: 0,
    accumulatedLoss: 0,
  },
};

const OperationsContext = createContext<OperationsContextValue | undefined>(
  undefined,
);

export const OperationsProvider: React.FC<{
  children: React.ReactNode;
  initialState?: Partial<OperationsState>;
}> = ({ children, initialState }) => {
  const [state, setState] = useState<OperationsState>({
    ...defaultState,
    ...initialState,
  });

  const addOperation = useCallback((operation: Operation) => {
    setState((prev) => ({
      ...prev,
      operations: [...prev.operations, operation],
    }));
  }, []);

  const addResult = useCallback((result: TaxResultDto) => {
    setState((prev) => ({
      ...prev,
      results: [...prev.results, result],
    }));
  }, []);

  const updatePortfolio = useCallback((portfolio: PortfolioState) => {
    setState((prev) => ({
      ...prev,
      portfolio,
    }));
  }, []);

  // State Initializer Pattern - permite resetear o reinicializar el estado
  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  const initialize = useCallback(
    (newInitialState?: Partial<OperationsState>) => {
      setState({
        ...defaultState,
        ...newInitialState,
      });
    },
    [],
  );

  return (
    <OperationsContext.Provider
      value={{
        operations: state.operations,
        results: state.results,
        portfolio: state.portfolio,
        addOperation,
        addResult,
        updatePortfolio,
        reset,
        initialize,
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error('useOperations must be used within OperationsProvider');
  }
  return context;
};
