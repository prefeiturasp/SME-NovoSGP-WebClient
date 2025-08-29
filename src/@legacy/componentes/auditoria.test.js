import React from 'react';
import { render, screen } from '@testing-library/react';
import Auditoria from './auditoria';
import moment from 'moment';

beforeAll(() => {
  global.window.moment = moment;
});

describe('Auditoria', () => {
  it('renderiza informações de criação com dados básicos', () => {
    render(
      <Auditoria
        criadoPor="João"
        criadoEm="2024-08-01T12:30:00Z"
        criadoRf="12345"
      />
    );
    expect(screen.getByText(/INSERIDO por João/)).toBeInTheDocument();
    expect(screen.getByText(/12345/)).toBeInTheDocument();
    expect(screen.getByText(/01\/08\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/às 12:30/)).toBeInTheDocument();
  });

  it('renderiza informações de alteração com dados básicos', () => {
    render(
      <Auditoria
        alteradoPor="Maria"
        alteradoEm="2024-08-10T18:00:00Z"
        alteradoRf="67890"
      />
    );
    expect(screen.getByText(/ALTERADO por Maria/)).toBeInTheDocument();
    expect(screen.getByText(/67890/)).toBeInTheDocument();
    expect(screen.getByText(/10\/08\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/às 18:00/)).toBeInTheDocument();
  });

  it('prioriza criadoRF e alteradoRF se ambos rf e RF forem passados', () => {
    render(
      <Auditoria
        criadoPor="Lucas"
        criadoEm="2024-07-20T09:15:00Z"
        criadoRf="111"
        criadoRF="999"
        alteradoPor="Ana"
        alteradoEm="2024-07-21T10:20:00Z"
        alteradoRf="222"
        alteradoRF="888"
      />
    );
    expect(screen.getByText(/Lucas \(111\)/)).toBeInTheDocument();
    expect(screen.getByText(/Ana \(222\)/)).toBeInTheDocument();
  });

  it('renderiza com novaEstrutura usando <Col>', () => {
    const { container } = render(
      <Auditoria
        novaEstrutura
        criadoPor="Eduarda"
        criadoEm="2024-07-15T10:00:00Z"
        criadoRf="555"
      />
    );
    expect(container.querySelectorAll('.ant-col')).toHaveLength(1);
    expect(screen.getByText(/INSERIDO por Eduarda/)).toBeInTheDocument();
  });
});
