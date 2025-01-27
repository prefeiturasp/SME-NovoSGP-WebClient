import { FiltroBuscaEstudanteDto } from '@/core/dto/FiltroBuscaEstudanteDto';
import { HttpStatusCode } from '@/core/enum/http-status-code';
import estudanteService from '@/core/services/estudante-service';
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
import { OPCAO_TODOS } from '~/constantes';
import { erro, erros } from '~/servicos';

type LocalizadorEstudanteProps = {
  inputCodigoProps?: InputProps;
  formItemCodigoProps?: FormItemProps;
  autoCompleteNameProps?: AutoCompleteProps;
  formItemAutoCompleteNameProps?: FormItemProps;
  onChange?: (field: string, value: any) => void; 
};
const LocalizadorEstudante: React.FC<LocalizadorEstudanteProps> = ({
  inputCodigoProps,
  formItemCodigoProps,
  autoCompleteNameProps,
  formItemAutoCompleteNameProps,
  onChange,
}) => {
  const form = Form.useFormInstance();

  const ueWatch = Form.useWatch('ue', form);
  const turmaWatch = Form.useWatch('turma', form);

  const [loading, setLoading] = useState(false);

  const [desabilitarCampo, setDesabilitarCampo] = useState({
    codigo: false,
    nome: false,
  });

  const limparDados = () => {
    form.setFieldValue('localizadorEstudanteDados', []);
    form.setFieldValue('localizadorEstudante', undefined);
    setDesabilitarCampo({
      nome: false,
      codigo: false,
    });
    if (onChange) onChange('localizadorEstudante', undefined);
  };

  useEffect(() => {
    if (form.isFieldsTouched() && !ueWatch?.codigo) {
      limparDados();
    }
  }, [ueWatch]);

  useEffect(() => {
    if (form.isFieldsTouched()) {
      limparDados();
    }
  }, [turmaWatch]);

  const obterDados = async (parametros: {
    codigo?: string;
    nome?: string;
    anoLetivo: string;
    codigoUe: string;
    codigoTurma: string;
    codigoTurmas: string[];
  }) => {
    const codigo = parametros?.codigo || '';
    const nome = parametros?.nome || '';
    const anoLetivo = parametros.anoLetivo;
    const codigoUe = parametros.codigoUe;
    const codigoTurma = parametros.codigoTurma;
    const codigoTurmas = parametros.codigoTurmas;

    const params: FiltroBuscaEstudanteDto = {
      codigoUe,
      anoLetivo,
    };

    if (codigo) {
      params.codigo = codigo;
    }

    if (nome) {
      params.nome = nome;
    }

    if (codigoTurma) {
      params.codigoTurma = codigoTurma;
    }
    if (codigoTurmas?.length) {
      params.codigoTurmas = codigoTurmas;
    }

    setLoading(true);
    const retorno = await estudanteService
      .obterDadosEstudantesPaginado(params)
      .catch((e) => {
        if (e?.response?.status === HttpStatusCode.NegocioException) {
          erro('Estudante/Criança não encontrado no EOL');
        } else {
          erros(e);
        }
        limparDados();
      })
      .finally(() => setLoading(false));

    if (retorno?.data?.items?.length) {
      const primeiroEstudante = retorno.data.items[0];

      const options = retorno.data.items.map((item) => (
        <AutoComplete.Option key={item.codigo} value={item.nome} allowClear>
          {item.nome}
        </AutoComplete.Option>
      ));

      form.setFieldValue('localizadorEstudanteDados', options);
      if (retorno?.data?.items?.length === 1)
        form.setFieldValue('localizadorEstudante', primeiroEstudante);

      if (codigo) {
        setDesabilitarCampo({
          codigo: false,
          nome: true,
        });
      } else {
        setDesabilitarCampo({
          codigo: true,
          nome: false,
        });
      }
    } else {
      limparDados();
    }
  };

  const onBuscarPorNome = async (nome: string, values: any) => {
    if (!values?.ue?.codigo) return;

    const valorNome = removerNumeros(nome);
    if (!valorNome?.length) {
      limparDados();
      return;
    }

    if (valorNome?.length < 3) return;
    obterDados({
      nome: valorNome,
      codigoTurma: values?.turma?.codigo,
      codigoUe: values?.ue?.codigo,
      anoLetivo: values?.anoLetivo,
      codigoTurmas: values?.turmas?.find((item: any) => item.value === OPCAO_TODOS)
        ? null
        : values?.turmas?.map((item: any) => item.codigo),
    });

    if (onChange) onChange('nome', nome);
  };

  const onBuscarPorCodigo = async (codigo: string, values: any) => {
    if (!values?.ue?.codigo) return;

    const codigoSomenteNumero = removerTudoQueNaoEhDigito(codigo);

    if (!codigoSomenteNumero) {
      limparDados();
      return;
    }

    obterDados({
      codigo,
      codigoTurma: values?.turma?.codigo,
      codigoUe: values?.ue?.codigo,
      anoLetivo: values?.anoLetivo,
      codigoTurmas: values?.turmas?.find((item: any) => item.value === OPCAO_TODOS)
        ? null
        : values?.turmas?.map((item: any) => item.codigo),
    });

    if (onChange) onChange('codigo', codigo);
  };

  const onSelectNome = (value: string, option: any) => {
    form.setFieldValue('localizadorEstudante', { codigo: option.key, nome: value });
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
                label="* Código EOL"
                name={['localizadorEstudante', 'codigo']}
                getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) =>
                  removerTudoQueNaoEhDigito(e?.target?.value)
                }
                {...formItemCodigoProps}
              >
                <Input.Search
                  id="INPUT_RF"
                  allowClear
                  loading={loading}
                  placeholder="Digite o Código EOL"
                  onSearch={(value: string) => onBuscarPorCodigo(value, form.getFieldsValue(true))}
                  disabled={disabled || desabilitarCampo.codigo || inputCodigoProps?.disabled}
                  onChange={(e) => {
                    if (!e?.target?.value?.length) {
                      limparDados();
                    }
                    if (onChange) onChange('codigo', e.target.value);
                  }}
                  {...inputCodigoProps}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={16}>
        <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
          {(form) => {
            const localizadorEstudanteDados: React.ReactNode[] = form.getFieldValue(
              'localizadorEstudanteDados',
            );

            const ue = form.getFieldValue('ue');
            const disabled = !ue?.codigo;

            return (
              <Form.Item
                label="* Nome da Criança/Estudante"
                name={['localizadorEstudante', 'nome']}
                {...formItemAutoCompleteNameProps}
              >
                <AutoComplete
                  onSearch={(value: string) => onBuscarPorNome(value, form.getFieldsValue(true))}
                  dataSource={localizadorEstudanteDados?.length ? localizadorEstudanteDados : []}
                  disabled={disabled || desabilitarCampo.nome || autoCompleteNameProps?.disabled}
                  onSelect={onSelectNome}
                  {...autoCompleteNameProps}
                >
                  <Input
                    allowClear
                    type="text"
                    id="AUTOCOMPLETE_NOME"
                    placeholder="Digite o nome da Criança/Estudante"
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

export default LocalizadorEstudante;
