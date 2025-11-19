import React from 'react';
import { Box, Text } from 'ink';
import { useOperations } from '../contexts/operations.context';

// Compound Component Pattern
interface PortfolioStatusComposition {
  Shares: React.FC;
  AveragePrice: React.FC;
  AccumulatedLoss: React.FC;
}

export const PortfolioStatus: React.FC & PortfolioStatusComposition = () => {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="green"
      paddingX={2}
      paddingY={1}
    >
      <Box marginBottom={1}>
        <Text bold color="green">
          📊 Portfolio Status
        </Text>
      </Box>

      <PortfolioStatus.Shares />
      <PortfolioStatus.AveragePrice />
      <PortfolioStatus.AccumulatedLoss />
    </Box>
  );
};

PortfolioStatus.Shares = () => {
  const { portfolio } = useOperations();

  return (
    <Box>
      <Text>Total de Ações: </Text>
      <Text bold color="yellow">
        {portfolio.totalShares}
      </Text>
    </Box>
  );
};

PortfolioStatus.AveragePrice = () => {
  const { portfolio } = useOperations();

  return (
    <Box>
      <Text>Preço Médio Ponderado: </Text>
      <Text bold color="cyan">
        R$ {portfolio.weightedAveragePrice.toFixed(2)}
      </Text>
    </Box>
  );
};

PortfolioStatus.AccumulatedLoss = () => {
  const { portfolio } = useOperations();

  return (
    <Box>
      <Text>Prejuízo Acumulado: </Text>
      <Text bold color={portfolio.accumulatedLoss > 0 ? 'red' : 'green'}>
        R$ {portfolio.accumulatedLoss.toFixed(2)}
      </Text>
    </Box>
  );
};
