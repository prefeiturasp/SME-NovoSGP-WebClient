import { Dayjs, dayjs } from '@/core/date/dayjs';
import { DatePicker, DatePickerProps, Form, FormItemProps } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { Rule } from 'antd/es/form';
import React, { useMemo } from 'react';
import { SGP_DATE_INICIO } from '~/constantes/ids/date';

type DataInicioProps = {
  datePickerProps?: DatePickerProps;
  formItemProps?: FormItemProps;
  desabilitarDataFutura?: boolean;
  validarInicioMaiorQueFim?: boolean;
  desabilitarData?: (data?: Dayjs) => boolean;
};
const DataInicio: React.FC<DataInicioProps> = ({
  datePickerProps,
  formItemProps,
  desabilitarDataFutura = false,
  validarInicioMaiorQueFim = false,
  desabilitarData,
}) => {
  const form = Form.useFormInstance();

  const dateFormat = 'DD/MM/YYYY';

  const hoje = dayjs();

  const validarDataInicioMaiorQueFim = (mensagem: string, dataInicio?: Dayjs, dataFim?: Dayjs) => {
    let dataInicioMaiorQueFim = false;

    if (dataInicio && dataFim && dataInicio.isValid() && dataFim.isValid()) {
      dataInicioMaiorQueFim = dataInicio.isAfter(dataFim, 'day');
    }

    return dataInicioMaiorQueFim ? Promise.reject(mensagem) : Promise.resolve();
  };

  const validarDataObrigatoria = (mensagem: string, dataInicio?: Dayjs, dataFim?: Dayjs) => {
    if (dataFim && dataFim.isValid() && (!dataInicio || !dataInicio.isValid())) {
      return Promise.reject(mensagem);
    }
    return Promise.resolve();
  };

  const validarDesabilitarDataFutura = (data?: any): boolean => {
    if (desabilitarDataFutura && data) {
      return data.isAfter(hoje, 'day');
    }

    return false;
  };

  const popupContainer = (trigger: HTMLElement) => trigger.parentNode as HTMLElement;

  const rules: Rule[] = useMemo(() => {
    let newRules: Rule[] = [];

    if (validarInicioMaiorQueFim) {
      newRules.push({
        validator() {
          const dataInicio = form.getFieldValue('dataInicio');
          const dataFim = form.getFieldValue('dataFim');

          return validarDataInicioMaiorQueFim(
            'Data inicial não pode ser maior que data final',
            dataInicio,
            dataFim,
          );
        },
      });

      newRules.push({
        validator() {
          const dataInicio = form.getFieldValue('dataInicio');
          const dataFim = form.getFieldValue('dataFim');

          return validarDataObrigatoria('Campo obrigatório', dataInicio, dataFim);
        },
      });
    }

    if (formItemProps?.rules?.length) {
      newRules = [...formItemProps.rules, ...newRules];
    }

    return newRules;
  }, [form, validarInicioMaiorQueFim, formItemProps]);

  return (
    <Form.Item name="dataInicio" label="Data inicial" {...formItemProps} rules={rules}>
      <DatePicker
        id={SGP_DATE_INICIO}
        format={dateFormat}
        locale={localeDatePicker}
        placeholder="Data inicial"
        getPopupContainer={(trigger: HTMLElement) => popupContainer(trigger)}
        disabledDate={desabilitarData || validarDesabilitarDataFutura}
        {...datePickerProps}
      />
    </Form.Item>
  );
};

export default DataInicio;
