const mockMomentGenerateConfig = {
  name: 'MockMomentConfig',
};

const mockGeneratePicker = jest.fn(() => () => <div>MockedDatePicker</div>);

jest.mock('rc-picker/lib/generate/moment', () => ({
  __esModule: true,
  default: mockMomentGenerateConfig,
}));

jest.mock('antd/es/date-picker/generatePicker', () => ({
  __esModule: true,
  default: mockGeneratePicker,
}));

describe('DatePickerMoment', () => {
  beforeEach(() => {
    mockGeneratePicker.mockClear();
  });

  it('deve chamar generatePicker com a configuração do moment para criar o componente', () => {
    require('./DatePickerMoment');

    expect(mockGeneratePicker).toHaveBeenCalledTimes(1);

    expect(mockGeneratePicker).toHaveBeenCalledWith(mockMomentGenerateConfig);
  });
});
