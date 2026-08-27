import React from 'react';
import { render, screen } from '@testing-library/react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { CampoData, momentSchema } from './campoData';
import { dayjs } from '@/core/date/dayjs';

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
      <Formik initialValues={{ testDate: dayjs() }} onSubmit={jest.fn()}>
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

describe('momentSchema com dayjs', () => {
  const schema = Yup.object().shape({
    primeiroBimestreDataFinal: momentSchema.required('Data final obrigatória'),
    segundoBimestreDataInicial: momentSchema
      .required('Data inicial obrigatória')
      .dataMenorIgualQue(
        'primeiroBimestreDataFinal',
        'segundoBimestreDataInicial',
        'Data inválida'
      ),
  });

  test('aceita inicio do proximo bimestre posterior ao fim do anterior', async () => {
    await expect(
      schema.validate({
        primeiroBimestreDataFinal: dayjs('2026-04-30T00:00:00'),
        segundoBimestreDataInicial: dayjs('2026-05-05T00:00:00'),
      })
    ).resolves.toMatchObject({});
  });

  test('rejeita inicio do proximo bimestre anterior ao fim do anterior', async () => {
    await expect(
      schema.validate({
        primeiroBimestreDataFinal: dayjs('2026-05-10T00:00:00'),
        segundoBimestreDataInicial: dayjs('2026-05-05T00:00:00'),
      })
    ).rejects.toThrow('Data inválida');
  });
});
