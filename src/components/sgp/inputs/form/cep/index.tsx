import { RetornoBaseDto } from '@/core/dto/RetornoBaseDto';
import enderecoService from '@/core/services/endereco-service';
import { removerTudoQueNaoEhDigito } from '@/core/utils/functions';
import { Form, FormItemProps, Input, InputProps } from 'antd';
import { AxiosError, HttpStatusCode } from 'axios';
import React, { useState } from 'react';

type InputCEPProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputCEP: React.FC<InputCEPProps> = ({ inputProps, formItemProps }) => {
  const form = Form.useFormInstance();

  const [CEPExistente, setCEPExistente] = useState<string[]>();

  const [loadingCEP, setLoadingCEP] = useState<boolean>(false);

  const maskCEP = (value: string | number | undefined) =>
    `${value}`.replace(/^(\d{5})(\d{3})+?$/, '$1-$2');

  const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removerTudoQueNaoEhDigito(e?.target?.value);
    return value ? maskCEP(value) : value;
  };

  const getCEP = (value: string) => {
    setLoadingCEP(true);
    enderecoService
      .obterDadosCEP(value)
      .then((resposta) => {
        const data = resposta.data;

        form.setFieldValue('estado', data?.uf?.toUpperCase());
        form.setFieldValue('bairro', data?.bairro);
        form.setFieldValue('cidade', data?.localidade);
        form.setFieldValue('endereco', data?.logradouro);
        form.setFieldValue('complemento', data?.complemento);

        form.validateFields(['estado', 'bairro', 'cidade', 'endereco']);

        if (resposta.status === HttpStatusCode.NoContent) {
          form.getFieldInstance('endereco').focus();
        }

        if (data) {
          form.getFieldInstance('numero').focus();
        }
      })
      .catch((erro: AxiosError<RetornoBaseDto>) => {
        const dataErro = erro?.response?.data;

        if (dataErro?.mensagens?.length) {
          setCEPExistente(dataErro.mensagens);
        }
      })
      .finally(() => setLoadingCEP(false));
  };

  return (
    <Form.Item
      name="cep"
      label="CEP"
      {...formItemProps}
      getValueFromEvent={getValueFromEvent}
      help={CEPExistente}
      hasFeedback={loadingCEP}
      validateStatus={CEPExistente?.length ? 'error' : loadingCEP ? 'validating' : ''}
      rules={[
        { required: true },
        {
          message: 'Deve conter 8 caracteres',
          validator: (_, value) => {
            if (!value) return Promise.resolve();

            const valorValidar = removerTudoQueNaoEhDigito(value);

            const regexValido = /^[0-9]{8}/.test(valorValidar);

            const valido = regexValido && valorValidar?.length === 8;

            if (valido) return Promise.resolve();

            return Promise.reject(new Error());
          },
        },
      ]}
    >
      <Input
        placeholder="Informe o CEP"
        maxLength={9}
        {...inputProps}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = removerTudoQueNaoEhDigito(e.target.value);
          if (value?.length === 8) {
            getCEP(value);
          }
        }}
      />
    </Form.Item>
  );
};

export default InputCEP;
