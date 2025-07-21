// SelectEntrouContatoFamiliaPor.test.tsx

import { render, screen } from '@testing-library/react';
import SelectEntrouContatoFamiliaPor from './index';

// Mocks dos enums e constantes
jest.mock('@/core/enum/ordem-procedimento-realizado-enum', () => ({
  OrdemProcedimentoRealizadoEnum: {
    Telefone: 'TELEFONE',
    VisitaDomiciliar: 'VISITA_DOMICILIAR',
  },
  OrdemProcedimentoRealizadoEnumDisplay: {
    TELEFONE: 'Telefone',
    VISITA_DOMICILIAR: 'Visita domiciliar',
  },
}));

jest.mock('~/constantes/ids/select', () => ({
  SGP_SELECT_ENTROU_CONTATO_FAMILIA_POR: 'select-entrou-contato-familia-por',
}));

// Mock do Select e Form.Item do antd
jest.mock('@/components/lib/inputs/select', () => (props: any) => (
  <div data-testid="select" {...props} />
));
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Form: {
      ...originalAntd.Form,
      Item: ({ children, ...props }: any) => (
        <div data-testid="form-item" {...props}>
          {children}
        </div>
      ),
    },
  };
});

describe('SelectEntrouContatoFamiliaPor', () => {
  it('passa as props extras para o Form.Item', () => {
    render(
      <SelectEntrouContatoFamiliaPor
        formItemProps={{ label: 'Contato', name: 'contato', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'Contato');
    expect(formItem).toHaveAttribute('name', 'contato');
  });
});
