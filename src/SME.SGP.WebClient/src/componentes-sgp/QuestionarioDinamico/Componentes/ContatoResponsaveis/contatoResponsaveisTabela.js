import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DataTable } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import Button from '~/componentes/button';
import { Base, Colors } from '~/componentes/colors';
import Label from '~/componentes/label';
import {
  SGP_BUTTON_ABRIR_CONTATO_RESPONSAVEIS_MODAL,
  SGP_BUTTON_EXCLUIR_ATIVIDADE_CONTRATURNO,
} from '~/constantes/ids/button';
import ModalCadastroContatoResponsaveis from './modalCadastroContatoResponsaveis';
import ColunaDimensionavel from '../ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../../Funcoes/QuestionarioDinamicoFuncoes';
import { SGP_TABLE_CONTATO_RESPONSAVEIS } from '~/constantes/ids/table';

const ContatoResponsaveisTabela = props => {
  const { label, questaoAtual, form, disabled, onChange } = props;

  const [exibirModal, setExibirModal] = useState(false);
  const [dadosIniciais, setDadosIniciais] = useState();

  const valoresFormulario = form?.values?.[questaoAtual.id];
  const dadosTabela = valoresFormulario?.length ? valoresFormulario : [];

  const onClickNovoContato = () => {
    setExibirModal(true);
  };

  const onCloseModal = novosDados => {
    setExibirModal(false);
    setDadosIniciais();

    if (novosDados) {
      QuestionarioDinamicoFuncoes.adicionarLinhaTabela(
        form,
        questaoAtual,
        novosDados,
        onChange
      );
    }
  };

  const onClickRow = row => {
    setDadosIniciais(row);
    setExibirModal(true);
  };

  const onClickRemover = async (e, linha) => {
    QuestionarioDinamicoFuncoes.removerLinhaTabela(
      e,
      form,
      questaoAtual,
      linha,
      onChange,
      disabled
    );
  };

  const colunas = [
    {
      title: 'Nome completo',
      dataIndex: 'nomeCompleto',
    },
    {
      title: 'Grau de parentesco/afetividade',
      dataIndex: 'grauParentescoAfetividadeDescricao',
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone',
    },
    {
      title: 'Ação',
      width: '65px',
      align: 'center',
      dataIndex: 'acaoRemover',
      render: (_, linha) => {
        return (
          <BotaoExcluirPadrao
            id={`${SGP_BUTTON_EXCLUIR_ATIVIDADE_CONTRATURNO}_LINHA_${linha?.id}`}
            disabled={disabled || questaoAtual.somenteLeitura}
            onClick={e => onClickRemover(e, linha)}
          />
        );
      },
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
      {exibirModal && (
        <ModalCadastroContatoResponsaveis
          disabled={disabled}
          onClose={onCloseModal}
          exibirModal={exibirModal}
          dadosIniciais={dadosIniciais}
        />
      )}

      <Label text={label} />

      <div className={possuiErro() ? 'tabela-invalida' : ''}>
        <DataTable
          columns={colunas}
          pagination={false}
          onClickRow={onClickRow}
          dataSource={dadosTabela}
          id={SGP_TABLE_CONTATO_RESPONSAVEIS}
        />
      </div>

      {form ? obterErros() : ''}

      <Button
        border
        icon="user-edit"
        color={Colors.Azul}
        disabled={disabled}
        className="mr-3 mt-2"
        label="Inserir novo contato"
        onClick={onClickNovoContato}
        id={SGP_BUTTON_ABRIR_CONTATO_RESPONSAVEIS_MODAL}
      />
    </ColunaDimensionavel>
  );
};

ContatoResponsaveisTabela.propTypes = {
  label: PropTypes.string,
  form: PropTypes.oneOfType([PropTypes.any]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

ContatoResponsaveisTabela.defaultProps = {
  label: '',
  form: null,
  disabled: false,
  onChange: () => {},
  questaoAtual: null,
};

export default ContatoResponsaveisTabela;
