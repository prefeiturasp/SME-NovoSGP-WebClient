import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CampoData } from './campoData'; // Ajuste o caminho conforme necessário
import { Formik } from 'formik';
import moment from 'moment';

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({})); // Mock de `locale`
jest.mock('@ant-design/icons', () => ({
  LoadingOutlined: () => <div>Loading</div>,
  CalendarOutlined: () => <div>Calendar</div>,
}));

describe('CampoData Component', () => {
  const defaultProps = {
    name: 'testDate',
    formatoData: 'DD/MM/YYYY',
    placeholder: 'Select Date',
    onChange: jest.fn(),
    valor: null,
    carregando: false,
    temErro: false,
    diasParaHabilitar: [],
    diasParaSinalizar: [],
    desabilitado: false,
  };

  const renderComponent = (props = {}) => {
    return render(
      <Formik
        initialValues={{ testDate: moment() }}
        onSubmit={jest.fn()}
      >
        <CampoData {...defaultProps} {...props} />
      </Formik>
    );
  };

  test('should render CampoData correctly', () => {
    renderComponent();

    // Verifique se o campo de data está sendo renderizado com o placeholder correto
    expect(screen.getByPlaceholderText('Select Date')).toBeInTheDocument();
  });

  test('should display an error message when there is a validation error', async () => {
    renderComponent({ temErro: true, mensagemErro: 'Invalid date' });

    // Verifica se a mensagem de erro é exibida
    expect(screen.getByText('Invalid date')).toBeInTheDocument();
  });

  test('should show loading icon when loading is true', () => {
    renderComponent({ carregando: true });

    // Verifica se o ícone de carregamento está presente
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  test('should disable the input field when desabilitado is true', () => {
    renderComponent({ desabilitado: true });

    // Verifica se o campo de data está desabilitado
    expect(screen.getByPlaceholderText('Select Date')).toBeDisabled();
  });
});
