import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  setDadosModalAnotacaoFrequencia,
  setExibirModalAnotacaoFrequencia,
} from '~/redux/modulos/modalAnotacaoFrequencia/actions';
import ModalAnotacoesFrequencia from '~/componentes-sgp/ModalAnotacoes/modalAnotacoes';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';

const ListaoModalAnotacaoFrequencia = ({
  dadosListaFrequencia,
  ehInfantil,
  componenteCurricularId,
  desabilitarCampos,
  fechouModal,
}) => {
  const exibirModalAnotacaoFrequencia = useSelector(
    state => state.modalAnotacaoFrequencia.exibirModalAnotacaoFrequencia
  );

  const dadosModalAnotacaoFrequencia = useSelector(
    state => state.modalAnotacaoFrequencia.dadosModalAnotacaoFrequencia
  );

  const listaPadraoMotivoAusencia = useSelector(
    state => state.modalAnotacaoFrequencia.listaPadraoMotivoAusencia
  );

  const { dadosIniciaisFrequencia, setDadosIniciaisFrequencia } = useContext(
    ListaoContext
  );

  const atualizarSePossuiAnotacao = valor => {
    const { codigoAluno } = dadosModalAnotacaoFrequencia;

    const aulasAluno = dadosIniciaisFrequencia?.alunos?.find?.(
      aluno => aluno?.codigoAluno === codigoAluno
    )?.aulas;
    const aulaAtual = aulasAluno.find(
      item => item.aulaId === dadosModalAnotacaoFrequencia?.aulaId
    );
    const indexAula = aulasAluno.indexOf(aulaAtual);
    aulasAluno[indexAula].possuiAnotacao = valor;
    dadosModalAnotacaoFrequencia.aula.possuiAnotacao = valor;
    setDadosIniciaisFrequencia({ ...dadosIniciaisFrequencia });
  };

  return (
    <ModalAnotacoesFrequencia
      dadosListaFrequencia={dadosListaFrequencia}
      ehInfantil={ehInfantil}
      aulaId={dadosModalAnotacaoFrequencia?.aulaId}
      componenteCurricularId={componenteCurricularId}
      desabilitarCampos={desabilitarCampos}
      exibirModal={exibirModalAnotacaoFrequencia}
      setExibirModal={setExibirModalAnotacaoFrequencia}
      dadosModal={dadosModalAnotacaoFrequencia}
      setDadosModal={setDadosModalAnotacaoFrequencia}
      listaPadraoMotivoAusencia={listaPadraoMotivoAusencia}
      fechouModal={(salvou, excluiu) => {
        if (salvou) {
          atualizarSePossuiAnotacao(true);
        } else if (excluiu) {
          atualizarSePossuiAnotacao(false);
        }
        fechouModal();
      }}
    />
  );
};

ListaoModalAnotacaoFrequencia.propTypes = {
  dadosListaFrequencia: PropTypes.oneOfType([PropTypes.array]),
  ehInfantil: PropTypes.bool,
  componenteCurricularId: PropTypes.oneOfType([PropTypes.any]),
  desabilitarCampos: PropTypes.bool,
  fechouModal: PropTypes.func,
};

ListaoModalAnotacaoFrequencia.defaultProps = {
  dadosListaFrequencia: [],
  ehInfantil: false,
  componenteCurricularId: '',
  desabilitarCampos: false,
  fechouModal: () => {},
};

export default ListaoModalAnotacaoFrequencia;
