import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DataTable } from '~/componentes';
import { Base } from '~/componentes/colors';
import Label from '~/componentes/label';
import { erros } from '~/servicos';
import ServicoEstudante from '~/servicos/Paginas/Estudante/ServicoEstudante';
import ModalCadastroEnderecoResidencial from './modalCadastroEnderecoResidencial';

const EnderecoResidencialTabela = props => {
  const { label, questaoAtual, form, onChange, codigoAluno } = props;

  const [exibirModal, setExibirModal] = useState(false);
  const [dadosIniciais, setDadosIniciais] = useState();
  const [dadosAluno, setDadosAluno] = useState();

  const valoresFormulario = form?.values?.[questaoAtual.id];
  const dadosTabela = valoresFormulario?.length
    ? [...valoresFormulario, dadosAluno]
    : [];

  const obterEnderecoResidencial = async () => {
    const resposta = await ServicoEstudante.obterInformacoesAlunoPorCodigo(
      codigoAluno
    ).catch(e => erros(e));

    if (resposta?.data) {
      const lista = resposta.data.map(item => ({
        numero: item.nro,
        bairro: item.bairro,
        complemento: item.complemento,
        logradouro: item.tipoLogradouro,
        tipoLogradouro: item.tipoLogradouro,
      }));

      setDadosAluno(lista);
    } else {
      setDadosAluno([]);
    }
  };

  const onCloseModal = novosDados => {
    setExibirModal(false);
    setDadosIniciais();

    if (novosDados) {
      const dadosAtuais = form?.values?.[questaoAtual.id]?.length
        ? form?.values?.[questaoAtual.id]
        : [];
      if (novosDados?.id) {
        const indexItemAnterior = dadosAtuais.findIndex(
          x => x.id === novosDados.id
        );
        dadosAtuais[indexItemAnterior] = novosDados;
      } else {
        novosDados.id = dadosAtuais.length + 1;
        dadosAtuais.push(novosDados);
      }
      if (form) {
        form.setFieldValue(questaoAtual.id, dadosAtuais);
        onChange();
      }
    }
  };

  const onClickRow = row => {
    setDadosIniciais(row);
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

  useEffect(() => {
    obterEnderecoResidencial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ModalCadastroEnderecoResidencial
        onClose={onCloseModal}
        exibirModal={exibirModal}
        dadosIniciais={dadosIniciais}
      />

      <Label text={label} />

      <div className={possuiErro() ? 'tabela-invalida' : ''}>
        <DataTable
          columns={colunas}
          pagination={false}
          onClickRow={onClickRow}
          dataSource={dadosTabela}
        />
      </div>

      {form ? obterErros() : ''}
    </>
  );
};

EnderecoResidencialTabela.propTypes = {
  label: PropTypes.string,
  form: PropTypes.oneOfType([PropTypes.any]),
  codigoAluno: PropTypes.number,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

EnderecoResidencialTabela.defaultProps = {
  label: '',
  form: null,
  codigoAluno: 0,
  onChange: () => {},
  questaoAtual: null,
};

export default EnderecoResidencialTabela;
