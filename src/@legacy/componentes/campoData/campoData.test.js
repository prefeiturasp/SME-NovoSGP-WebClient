import React from 'react';
import { render, screen } from '@testing-library/react';
import { CampoData } from './campoData';
import { Formik } from 'formik';
import moment from 'moment';

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({}));
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
      <Formik initialValues={{ testDate: moment() }} onSubmit={jest.fn()}>
        <CampoData {...defaultProps} {...props} />
      </Formik>
    );
  };

  test('should render CampoData correctly', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Select Date')).toBeInTheDocument();
  });

  test('should display an error message when there is a validation error', async () => {
    renderComponent({ temErro: true, mensagemErro: 'Invalid date' });

    expect(screen.getByText('Invalid date')).toBeInTheDocument();
  });

  test('should show loading icon when loading is true', () => {
    renderComponent({ carregando: true });

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  test('should disable the input field when desabilitado is true', () => {
    renderComponent({ desabilitado: true });

    expect(screen.getByPlaceholderText('Select Date')).toBeDisabled();
  });
});
