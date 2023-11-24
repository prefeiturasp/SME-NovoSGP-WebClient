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
import { erro, erros } from '~/servicos';

type LocalizadorEstudanteProps = {
  inputCodigoProps?: InputProps;
  formItemCodigoProps?: FormItemProps;
  autoCompleteNameProps?: AutoCompleteProps;
  formItemAutoCompleteNameProps?: FormItemProps;
};
const LocalizadorEstudante: React.FC<LocalizadorEstudanteProps> = ({
  inputCodigoProps,
  formItemCodigoProps,
  autoCompleteNameProps,
  formItemAutoCompleteNameProps,
}) => {
  const form = Form.useFormInstance();

  const ueWatch = Form.useWatch('ue', form);

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
  };

  useEffect(() => {
    if (!ueWatch?.codigo) {
      limparDados();
    }
  }, [ueWatch]);

  const obterDados = async (parametros: {
    codigo?: string;
    nome?: string;
    anoLetivo: string;
    codigoUe: string;
    codigoTurma: string;
  }) => {
    const codigo = parametros?.codigo || '';
    const nome = parametros?.nome || '';
    const anoLetivo = parametros.anoLetivo;
    const codigoUe = parametros.codigoUe;
    const codigoTurma = parametros.codigoTurma;

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
    });
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
    });
  };

  return (
    <Row gutter={24}>
      <Col xs={24} md={12} lg={10}>
        <Form.Item shouldUpdate>
          {(form) => {
            const localizadorEstudanteDados: React.ReactNode[] = form.getFieldValue(
              'localizadorEstudanteDados',
            );

            const ue = form.getFieldValue('ue');
            const disabled = !ue?.codigo;
            return (
              <Form.Item
                label="Nome da Criança/Estudante"
                name={['localizadorEstudante', 'nome']}
                {...formItemAutoCompleteNameProps}
              >
                <AutoComplete
                  onSearch={(value: string) => onBuscarPorNome(value, form.getFieldsValue(true))}
                  dataSource={localizadorEstudanteDados?.length ? localizadorEstudanteDados : []}
                  disabled={disabled || desabilitarCampo.nome}
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

      <Col xs={24} md={12} lg={10}>
        <Form.Item shouldUpdate>
          {(form) => {
            const ue = form.getFieldValue('ue');
            const disabled = !ue?.codigo;

            return (
              <Form.Item
                label="Código EOL"
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
                  disabled={disabled || desabilitarCampo.codigo}
                  onChange={(e) => {
                    if (!e?.target?.value?.length) {
                      limparDados();
                    }
                  }}
                  {...inputCodigoProps}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>
    </Row>
  );
};

export default LocalizadorEstudante;
