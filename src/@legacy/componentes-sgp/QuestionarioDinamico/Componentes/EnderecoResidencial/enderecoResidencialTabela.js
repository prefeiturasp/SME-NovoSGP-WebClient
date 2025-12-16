import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DataTable } from '~/componentes';
import { Base } from '~/componentes/colors';
import Label from '~/componentes/label';
import ModalCadastroEnderecoResidencial from './modalCadastroEnderecoResidencial';
import { SGP_TABLE_ENDERECO_RESIDENCIAL } from '~/constantes/ids/table';
import ColunaDimensionavel from '../ColunaDimensionavel/colunaDimensionavel';
import { Col, Row, Typography } from 'antd';

const EnderecoResidencialTabela = props => {
  const { label, questaoAtual, form, onChange, disabled } = props;

  const [exibirModal, setExibirModal] = useState(false);
  const [dadosIniciais, setDadosIniciais] = useState();

  const valoresFormulario = form?.values?.[questaoAtual.id];
  const dadosTabela = valoresFormulario?.length ? valoresFormulario : [];

  const onCloseModal = novosDados => {
    setExibirModal(false);
    setDadosIniciais();

    if (novosDados) {
      let dadosAtuais = form?.values?.[questaoAtual.id]?.length
        ? form?.values?.[questaoAtual.id]
        : [];

      dadosAtuais = [{ ...novosDados }];

      if (form) {
        form.setFieldValue(questaoAtual.id, dadosAtuais);
        onChange();
      }
    }
  };

  const onClickRow = row => {
    setDadosIniciais({ ...row });
    setExibirModal(true);
  };

  const colunas = [
    {
      title: 'CEP',
      dataIndex: 'cep',
    },
    {
      title: 'Tipo de logradouro',
      dataIndex: 'tipoLogradouro',
    },
    {
      title: 'Logradouro',
      dataIndex: 'logradouro',
    },
    {
      title: 'Número',
      dataIndex: 'numero',
    },
    {
      title: 'Bairro',
      dataIndex: 'bairro',
    },
    {
      title: 'Complemento',
      dataIndex: 'complemento',
    },
  ];

  const Erro = styled.span`
    color: ${Base.Vermelho};
  `;

  const possuiErro = () => {
    return (
      form &&
      form.errors[String(questaoAtual.id)] &&
      form.touched[String(questaoAtual.id)]
    );
  };

  const obterErros = () => {
    return form &&
      form.touched[String(questaoAtual.id)] &&
      form.errors[String(questaoAtual.id)] ? (
      <Erro>{form.errors[String(questaoAtual.id)]}</Erro>
    ) : (
      ''
    );
  };

  let opcionais = {};

  try {
    opcionais = JSON.parse(questaoAtual?.opcionais || '{}');
  } catch {
    opcionais = {};
  }

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <ModalCadastroEnderecoResidencial
        onClose={onCloseModal}
        exibirModal={exibirModal}
        dadosIniciais={dadosIniciais}
        disabled={disabled}
      />

      <Label text={label} />

      {opcionais?.titulo && (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Typography.Title className="mb-3" level={4}>
              {opcionais.titulo}
            </Typography.Title>
          </Col>
        </Row>
      )}
      {opcionais?.subtitulo && (
        <Row gutter={[16, 24]} className="mb-32">
          <Col xs={24}>
            <Typography.Text>{opcionais.subtitulo}</Typography.Text>
          </Col>
        </Row>
      )}

      <div className={possuiErro() ? 'tabela-invalida' : ''}>
        <DataTable
          gerarIdUnico
          columns={colunas}
          pagination={false}
          onClickRow={onClickRow}
          dataSource={questaoAtual.resposta}
          id={SGP_TABLE_ENDERECO_RESIDENCIAL}
        />
      </div>

      {form ? obterErros() : ''}
    </ColunaDimensionavel>
  );
};

EnderecoResidencialTabela.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

EnderecoResidencialTabela.defaultProps = {
  label: '',
  form: null,
  disabled: false,
  onChange: () => {},
  questaoAtual: null,
};

export default EnderecoResidencialTabela;
