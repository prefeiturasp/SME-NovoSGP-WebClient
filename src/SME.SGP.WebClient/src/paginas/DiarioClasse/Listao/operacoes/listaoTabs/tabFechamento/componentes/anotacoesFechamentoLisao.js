import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ModalAnotacaoAluno from '~/paginas/Fechamento/FechamentoModalAnotacaoAluno/modal-anotacao-aluno';
import ListaoBotaoAnotacao from '../../tabFrequencia/lista/componentes/listaoBotaoAnotacao';

const AnotacoesFechamentoLisao = props => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const {
    desabilitar,
    ehInfantil,
    aluno,
    fechamentoId,
    dadosFechamento,
    setDadosFechamento,
  } = props;

  const [exibirModalAnotacao, setExibirModalAnotacao] = useState(false);

  const atualizarInfo = valorTemAnotacao => {
    const alunoSelecionado = dadosFechamento?.alunos?.find?.(
      item => item?.codigoAluno === aluno?.codigoAluno
    );
    if (alunoSelecionado) {
      const indexAluno = dadosFechamento?.alunos?.indexOf(alunoSelecionado);
      dadosFechamento.alunos[indexAluno].possuiAnotacao = valorTemAnotacao;
      setDadosFechamento(dadosFechamento);
      aluno.possuiAnotacao = valorTemAnotacao;
    }
  };

  const onCloseModalAnotacao = (salvou, excluiu) => {
    if (salvou) {
      atualizarInfo(true);
    } else if (excluiu) {
      atualizarInfo(false);
    }
    setExibirModalAnotacao(false);
  };

  const descricaoTooltip = !dadosFechamento?.fechamentoId
    ? dadosFechamento.situacaoNome
    : '';

  return (
    <>
      <ListaoBotaoAnotacao
        descricaoTooltip={descricaoTooltip}
        desabilitarCampos={desabilitar || !dadosFechamento?.fechamentoId}
        ehInfantil={ehInfantil}
        permiteAnotacao={
          aluno?.permiteAnotacao && dadosFechamento?.fechamentoId
        }
        possuiAnotacao={aluno?.possuiAnotacao}
        onClickAnotacao={() => {
          if (dadosFechamento?.fechamentoId) {
            setExibirModalAnotacao(true);
          }
        }}
      />
      {exibirModalAnotacao && (
        <ModalAnotacaoAluno
          exibirModal={exibirModalAnotacao}
          onCloseModal={onCloseModalAnotacao}
          fechamentoId={fechamentoId}
          codigoTurma={turmaSelecionada.turma}
          anoLetivo={turmaSelecionada.anoLetivo}
          dadosAlunoSelecionado={{
            codigoAluno: aluno?.codigoAluno,
            temAnotacao: aluno?.possuiAnotacao,
          }}
          desabilitar={desabilitar}
        />
      )}
    </>
  );
};

AnotacoesFechamentoLisao.propTypes = {
  desabilitar: PropTypes.bool,
  ehInfantil: PropTypes.bool,
  aluno: PropTypes.oneOfType([PropTypes.any]),
  fechamentoId: PropTypes.number,
  dadosFechamento: PropTypes.oneOfType([PropTypes.any]),
  setDadosFechamento: PropTypes.func,
};

AnotacoesFechamentoLisao.defaultProps = {
  desabilitar: false,
  ehInfantil: false,
  aluno: null,
  fechamentoId: null,
  dadosFechamento: {},
  setDadosFechamento: () => null,
};

export default AnotacoesFechamentoLisao;
