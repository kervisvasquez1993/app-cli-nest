import React from 'react';
import { Box, Text } from 'ink';

export const HeaderComponent: React.FC = () => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2}>
        <Text bold color="cyan">
          💰 Capital Gains Tax Calculator
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>
          Calcule impostos sobre ganho de capital em operações de compra e venda
        </Text>
      </Box>
    </Box>
  );
};
