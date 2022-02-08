import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import { Base } from '~/componentes';
import ModalCopiarConteudoPlanoAula from '~/componentes-sgp/ModalCopiarConteudo/modalCopiarConteudoPlanoAula';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';

const BtnCopiarConteudo = styled.div`
  font-size: 14px;
  color: ${Base.CinzaMako};
  font-weight: 500;
  cursor: pointer;

  i {
    margin-right: 6px;
  }
`;

const ContainerListaCopiar = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-top: 20px;
`;

const CopiarConteudoListaoPlanoAula = props => {
  const dispatch = useDispatch();

  const {
    desabilitar,
    dadosPlanoAtual,
    codigoComponenteCurricular,
    dadosPlanoAula,
    setDadosPlanoAula,
    indexPlano,
    setExecutarObterPlanoAulaPorPeriodo,
  } = props;

  const [exibirModal, setExibirModal] = useState(false);
  const [exibirLoaderModal, setExibirLoaderModal] = useState(false);

  const validarDataParaSobrescreverConteudo = (dados, indexPlanoPlanoCopia) => {
    const dadosPlanoParaCopia = dados[indexPlanoPlanoCopia].copiarConteudo;
    const datasParaSobreecrever = dadosPlanoParaCopia.idsPlanoTurmasDestino.map(
      d => d.data
    );

    dadosPlanoAula.forEach((plano, index) => {
      const naoEhPlanoCopia = index !== indexPlanoPlanoCopia;
      if (naoEhPlanoCopia) {
        const ehDatasobrescrever = datasParaSobreecrever.find(data => {
          const ehMesmaData = window
            .moment(plano.dataAula)
            .isSame(data, 'date');
          return ehMesmaData;
        });
        plano.bloquearParaCopia = !!ehDatasobrescrever;
      }
    });
  };

  const copiar = async (turmas, valoresCheckbox) => {
    const dadosCopiar = {
      idsPlanoTurmasDestino: turmas.map(x => ({
        ...x,
        sobreescrever: true,
      })),
      disciplinaId: codigoComponenteCurricular,
      migrarLicaoCasa: valoresCheckbox.licaoCasa,
      migrarRecuperacaoAula: valoresCheckbox.recuperacaoContinua,
      migrarObjetivos: valoresCheckbox.objetivosAprendizagem,
    };

    const dados = dadosPlanoAula;
    dados[indexPlano].copiarConteudo = dadosCopiar;
    dados[indexPlano].alterado = true;
    validarDataParaSobrescreverConteudo(dados, indexPlano);
    setDadosPlanoAula([...dados]);
    dispatch(setTelaEmEdicao(true));
  };

  const aposCopiarConteudo = () => {
    setExecutarObterPlanoAulaPorPeriodo(true);
    dispatch(setTelaEmEdicao(false));
  };
  const montarExibicaoCopiar = () => {
    return dadosPlanoAtual?.copiarConteudo?.idsPlanoTurmasDestino?.map?.(
      turma => {
        return (
          <div className="font-weight-bold" key={`turma-${shortid.generate()}`}>
            {`Turma: ${turma?.nomeTurma} - Data: ${turma?.data?.format?.(
              'DD/MM/YYYY'
            )}`}
          </div>
        );
      }
    );
  };

  return (
    <>
      <BtnCopiarConteudo
        className="mt-3"
        onClick={() => {
          if (!desabilitar) setExibirModal(true);
        }}
        id="copiar-conteudo-plano-aula"
      >
        <i className="fas fa-copy" />
        Copiar Conteúdo
      </BtnCopiarConteudo>
      {dadosPlanoAtual?.copiarConteudo && (
        <ContainerListaCopiar>
          <div className="mb-1">Plano de Aula será copiada para:</div>

          {montarExibicaoCopiar()}
        </ContainerListaCopiar>
      )}

      <ModalCopiarConteudoPlanoAula
        codigoComponenteCurricular={codigoComponenteCurricular}
        exibirModal={exibirModal}
        setExibirModal={setExibirModal}
        setExibirLoaderModal={setExibirLoaderModal}
        exibirLoaderModal={exibirLoaderModal}
        copiar={copiar}
        executarCopiarPadrao={!!dadosPlanoAtual?.id}
        aposCopiarConteudo={aposCopiarConteudo}
        planoAulaId={dadosPlanoAtual?.id}
      />
    </>
  );
};

CopiarConteudoListaoPlanoAula.propTypes = {
  desabilitar: PropTypes.bool,
  dadosPlanoAtual: PropTypes.oneOfType([PropTypes.any]),
  codigoComponenteCurricular: PropTypes.string,
  dadosPlanoAula: PropTypes.oneOfType([PropTypes.array]),
  setDadosPlanoAula: PropTypes.func,
  indexPlano: PropTypes.number,
  setExecutarObterPlanoAulaPorPeriodo: PropTypes.func,
};

CopiarConteudoListaoPlanoAula.defaultProps = {
  desabilitar: false,
  dadosPlanoAtual: null,
  codigoComponenteCurricular: '',
  dadosPlanoAula: [],
  setDadosPlanoAula: () => null,
  indexPlano: null,
  setExecutarObterPlanoAulaPorPeriodo: () => null,
};

export default CopiarConteudoListaoPlanoAula;
