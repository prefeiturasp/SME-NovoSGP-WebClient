import React from 'react';
import { Container } from './moduleFederation.css';

const ModuleFederation = () => {
  return (
    <Container>
      <iframe
        src="http://localhost:5173/"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Module Federation"
      />
    </Container>
  );
};

export default ModuleFederation;
