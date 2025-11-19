import React from 'react';
import { Box, Text } from 'ink';
import { useOperations } from '../contexts/operations.context';

interface TaxResultsComposition {
  Header: React.FC;
  List: React.FC;
  Total: React.FC;
  Empty: React.FC;
}

export const TaxResults: React.FC & TaxResultsComposition = () => {
  const { results } = useOperations();

  if (results.length === 0) {
    return <TaxResults.Empty />;
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="magenta"
      paddingX={2}
      paddingY={1}
    >
      <TaxResults.Header />
      <TaxResults.List />
      <TaxResults.Total />
    </Box>
  );
};

TaxResults.Header = () => {
  return (
    <Box marginBottom={1}>
      <Text bold color="magenta">
        💵 Impostos Calculados
      </Text>
    </Box>
  );
};

TaxResults.List = () => {
  const { results } = useOperations();

  return (
    <Box flexDirection="column">
      {results.map((result, index) => (
        <Box key={index}>
          <Text>Operação {index + 1}:</Text>
          <Text bold color={result.tax > 0 ? 'red' : 'green'}>
            {' '}
            R$ {result.tax.toFixed(2)}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

TaxResults.Total = () => {
  const { results } = useOperations();
  const total = results.reduce((sum, result) => sum + result.tax, 0);

  return (
    <Box marginTop={1} borderStyle="single" borderColor="yellow" paddingX={1}>
      <Text bold>Total de Impostos: </Text>
      <Text bold color="yellow">
        R$ {total.toFixed(2)}
      </Text>
    </Box>
  );
};

TaxResults.Empty = () => {
  return (
    <Box borderStyle="round" borderColor="gray" paddingX={2} paddingY={1}>
      <Text dimColor>Nenhuma operação processada ainda</Text>
    </Box>
  );
};
