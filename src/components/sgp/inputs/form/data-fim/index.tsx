import { Dayjs, dayjs } from '@/core/date/dayjs';
import { DatePicker, DatePickerProps, Form, FormItemProps } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { Rule } from 'antd/es/form';
import React, { useMemo } from 'react';
import { SGP_DATE_FIM } from '~/constantes/ids/date';

type DataFimProps = {
  datePickerProps?: DatePickerProps;
  formItemProps?: FormItemProps;
  desabilitarDataFutura?: boolean;
  validarFimMenorQueInicio?: boolean;
  desabilitarData?: (data?: Dayjs) => boolean;
};
const DataFim: React.FC<DataFimProps> = ({
  datePickerProps,
  formItemProps,
  desabilitarDataFutura = false,
  validarFimMenorQueInicio = false,
  desabilitarData,
}) => {
  const form = Form.useFormInstance();

  const dateFormat = 'DD/MM/YYYY';

  const hoje = dayjs();

  const validarDataFimMenorQueInicio = (mensagem: string, dataInicio?: Dayjs, dataFim?: Dayjs) => {
    let dataInicioMaiorQueFim = false;

    if (dataInicio && dataFim && dataInicio.isValid() && dataFim.isValid()) {
      dataInicioMaiorQueFim = dataInicio.isAfter(dataFim, 'day');
    }

    return dataInicioMaiorQueFim ? Promise.reject(mensagem) : Promise.resolve();
  };

  const validarDataObrigatoria = (mensagem: string, dataInicio?: Dayjs, dataFim?: Dayjs) => {
    if (dataInicio && dataInicio.isValid() && (!dataFim || !dataFim.isValid())) {
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

    if (validarFimMenorQueInicio) {
      newRules.push({
        validator() {
          const dataInicio = form.getFieldValue('dataInicio');
          const dataFim = form.getFieldValue('dataFim');

          return validarDataFimMenorQueInicio(
            'Data final não pode ser menor que data inicial',
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
  }, [form, validarFimMenorQueInicio, formItemProps]);

  return (
    <Form.Item name="dataFim" label="Data final" {...formItemProps} rules={rules}>
      <DatePicker
        id={SGP_DATE_FIM}
        format={dateFormat}
        placeholder="Data final"
        locale={localeDatePicker}
        getPopupContainer={(trigger: HTMLElement) => popupContainer(trigger)}
        disabledDate={desabilitarData || validarDesabilitarDataFutura}
        {...datePickerProps}
      />
    </Form.Item>
  );
};

export default DataFim;
