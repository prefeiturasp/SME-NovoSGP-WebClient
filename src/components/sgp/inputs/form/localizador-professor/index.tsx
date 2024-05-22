import { ProfessorResumoDto } from '@/core/dto/ProfessorResumoDto';
import professoresService from '@/core/services/professores-service';
import { removerNumeros, removerTudoQueNaoEhDigito } from '@/core/utils/functions';
import { SearchOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  AutoCompleteProps,
  Col,
  Form,
  FormItemProps,
  Input,
  InputProps,
  Row,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Base } from '~/componentes';
import { erro } from '~/servicos';

type LocalizadorProfessorProps = {
  inputCodigoProps?: InputProps;
  formItemCodigoProps?: FormItemProps;
  autoCompleteNameProps?: AutoCompleteProps;
  formItemAutoCompleteNameProps?: FormItemProps;
};
export const LocalizadorProfessor: React.FC<LocalizadorProfessorProps> = ({
  inputCodigoProps,
  formItemCodigoProps,
  autoCompleteNameProps,
  formItemAutoCompleteNameProps,
}) => {
  const form = Form.useFormInstance();

  const ueWatch = Form.useWatch('ue', form);

  const [loading, setLoading] = useState(false);

  const [desabilitarCampo, setDesabilitarCampo] = useState({
    codigoRF: false,
    nome: false,
  });

  const nomeCampo = 'localizadorProfessor';
  const nomeCampoDados = 'localizadorProfessorDados';

  const limparDados = () => {
    form.setFieldValue(nomeCampoDados, []);
    form.setFieldValue(nomeCampo, undefined);
    setDesabilitarCampo({
      nome: false,
      codigoRF: false,
    });
  };

  useEffect(() => {
    if (form.isFieldsTouched() && !ueWatch?.id) {
      limparDados();
    }
  }, [ueWatch]);

  const aposObterDados = (dados: ProfessorResumoDto[]) => {
    const options = dados.map((item) => (
      <AutoComplete.Option key={item.codigoRF} value={item.nome} allowClear>
        {item.nome}
      </AutoComplete.Option>
    ));

    form.setFieldValue(nomeCampoDados, options);
    if (dados?.length === 1) form.setFieldValue(nomeCampo, dados[0]);
  };

  const onBuscarPorNome = async (nome: string, values: any) => {
    if (!values?.ue?.codigo) return;

    const valorNome = removerNumeros(nome);
    if (!valorNome?.length) {
      limparDados();
      return;
    }

    if (valorNome?.length < 3) return;

    setLoading(true);
    const retorno = await professoresService
      .obterProfessorAutoComplete(values?.anoLetivo, values?.dre?.codigo, values?.ue?.codigo, nome)
      .finally(() => setLoading(false));

    if (retorno?.sucesso) {
      const temDados = retorno?.dados?.length;

      if (!temDados) {
        erro('Professor não foi encontrado!');
        return;
      }

      aposObterDados(retorno.dados);

      setDesabilitarCampo({
        codigoRF: true,
        nome: false,
      });
    } else {
      limparDados();
    }
  };

  const onBuscarPorCodigo = async (codigoRF: string, values: any) => {
    if (!values?.ue?.codigo) return;

    const codigoSomenteNumero = removerTudoQueNaoEhDigito(codigoRF);

    if (!codigoSomenteNumero) {
      limparDados();
      return;
    }

    setLoading(true);
    const retorno = await professoresService
      .obterResumoPorRFUeDreAnoLetivo(
        codigoRF,
        values?.anoLetivo,
        values?.dre?.codigo,
        values?.ue?.codigo,
      )
      .finally(() => setLoading(false));

    if (retorno?.sucesso) {
      const temDados = retorno?.dados;

      if (!temDados) {
        erro('RF/CPF não foi encontrado!');
        return;
      }

      aposObterDados([retorno.dados]);

      setDesabilitarCampo({
        codigoRF: false,
        nome: true,
      });
    } else {
      limparDados();
    }
  };

  const onSelectNome = (value: string, option: any) => {
    form.setFieldValue(nomeCampo, { codigoRF: option.key, nome: value });
  };

  return (
    <Row gutter={24}>
      <Col xs={24} md={12} lg={8}>
        <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
          {(form) => {
            const ue = form.getFieldValue('ue');
            const disabled = !ue?.codigo;

            return (
              <Form.Item
                label="RF/CPF"
                name={[nomeCampo, 'codigoRF']}
                getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) =>
                  removerTudoQueNaoEhDigito(e?.target?.value)
                }
                {...formItemCodigoProps}
              >
                <Input.Search
                  id="INPUT_RF"
                  allowClear
                  loading={loading}
                  placeholder="Digite o RF/CPF"
                  onSearch={(value: string) => onBuscarPorCodigo(value, form.getFieldsValue(true))}
                  onChange={(e) => {
                    if (!e?.target?.value?.length) {
                      limparDados();
                    }
                  }}
                  {...inputCodigoProps}
                  disabled={disabled || desabilitarCampo.codigoRF || inputCodigoProps?.disabled}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={16}>
        <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
          {(form) => {
            const localizadorProfessorDados: React.ReactNode[] = form.getFieldValue(nomeCampoDados);

            const ue = form.getFieldValue('ue');
            const disabled = !ue?.codigo;

            return (
              <Form.Item label="Nome" name={[nomeCampo, 'nome']} {...formItemAutoCompleteNameProps}>
                <AutoComplete
                  onSearch={(value: string) => onBuscarPorNome(value, form.getFieldsValue(true))}
                  dataSource={localizadorProfessorDados?.length ? localizadorProfessorDados : []}
                  onSelect={onSelectNome}
                  {...autoCompleteNameProps}
                  disabled={disabled || desabilitarCampo.nome || autoCompleteNameProps?.disabled}
                >
                  <Input
                    allowClear
                    type="text"
                    id="AUTOCOMPLETE_NOME"
                    placeholder="Digite o nome da pessoa"
                    prefix={<SearchOutlined style={{ fontSize: 16, color: Base.CinzaMenu }} />}
                  />
                </AutoComplete>
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>
    </Row>
  );
};
