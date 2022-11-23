import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DataTable } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import Button from '~/componentes/button';
import { Base, Colors } from '~/componentes/colors';
import Label from '~/componentes/label';
import { SGP_BUTTON_EXCLUIR_ATIVIDADE_CONTRATURNO } from '~/constantes/ids/button';
import { confirmar } from '~/servicos';
import ModalCadastroAtividadeContraturno from './modalCadastroAtividadeContraturno';

const AtividadeContraturnoTabela = props => {
  const { label, questaoAtual, form, disabled, onChange } = props;

  const [exibirModal, setExibirModal] = useState(false);
  const [dadosIniciais, setDadosIniciais] = useState();

  const valoresFormulario = form?.values?.[questaoAtual.id];
  const dadosTabela = valoresFormulario?.length ? valoresFormulario : [];

  const onClickNovaAtividade = () => {
    setExibirModal(true);
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

  const onClickRemover = async (e, linha) => {
    e.stopPropagation();

    if (!disabled) {
      const confirmado = await confirmar(
        'Excluir',
        '',
        'Você tem certeza que deseja excluir este registro?'
      );

      if (confirmado) {
        const dadosAtuais = form?.values?.[questaoAtual.id]?.length
          ? form?.values?.[questaoAtual.id]
          : [];

        const indice = dadosAtuais.findIndex(item => item.id === linha.id);
        if (indice !== -1) {
          dadosAtuais.splice(indice, 1);
          form.setFieldValue(questaoAtual.id, dadosAtuais);
          onChange();
        }
      }
    }
  };

  const colunas = [
    {
      title: 'Local',
      dataIndex: 'local',
    },
    {
      title: 'Atividade',
      dataIndex: 'atividade',
    },
    {
      title: 'Ação',
      width: '65px',
      align: 'center',
      dataIndex: 'acaoRemover',
      render: (_, linha) => {
        return (
          <BotaoExcluirPadrao
            id={`${SGP_BUTTON_EXCLUIR_ATIVIDADE_CONTRATURNO}_LINHA_${linha}`}
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
    <>
      {exibirModal && (
        <ModalCadastroAtividadeContraturno
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
        />
      </div>

      {form ? obterErros() : ''}

      <Button
        border
        icon="plus"
        color={Colors.Azul}
        disabled={disabled}
        className="mr-3 mt-2"
        label="Nova atividade"
        onClick={onClickNovaAtividade}
      />
    </>
  );
};

AtividadeContraturnoTabela.propTypes = {
  label: PropTypes.string,
  form: PropTypes.oneOfType([PropTypes.any]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

AtividadeContraturnoTabela.defaultProps = {
  label: '',
  form: null,
  disabled: false,
  onChange: () => {},
  questaoAtual: null,
};

export default AtividadeContraturnoTabela;
