import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DataTable } from '~/componentes';
import { Base } from '~/componentes/colors';
import Label from '~/componentes/label';
import ModalCadastroEnderecoResidencial from './modalCadastroEnderecoResidencial';
import ColunaDimensionavel from '../ColunaDimensionavel/colunaDimensionavel';
import { SGP_TABLE_ENDERECO_RESIDENCIAL } from '~/constantes/ids/table';

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
      title: 'Complemento',
      dataIndex: 'complemento',
    },
    {
      title: 'Bairro',
      dataIndex: 'bairro',
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

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <ModalCadastroEnderecoResidencial
        onClose={onCloseModal}
        exibirModal={exibirModal}
        dadosIniciais={dadosIniciais}
        disabled={disabled}
      />

      <Label text={label} />

      <div className={possuiErro() ? 'tabela-invalida' : ''}>
        <DataTable
          gerarIdUnico
          columns={colunas}
          pagination={false}
          onClickRow={onClickRow}
          dataSource={dadosTabela}
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
