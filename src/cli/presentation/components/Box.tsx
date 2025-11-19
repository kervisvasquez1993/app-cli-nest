import React, { useEffect } from 'react';
import { Text, Box } from 'ink';

export const Boxt: React.FC = () => {
  useEffect(() => {
    console.log('hola');
  }, []);

  return (
    <Box width="100%" borderStyle="double" padding={2}>
      <Text>Your command: </Text>
    </Box>
  );
};
