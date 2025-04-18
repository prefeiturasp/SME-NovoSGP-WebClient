import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardCollapse from '~/componentes/cardCollapse';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import { SGP_COLLAPSE_RECUPERACAO_CONTINUA } from '~/constantes/ids/collapse';
import { SGP_JODIT_EDITOR_RECUPERACAO_CONTINUA } from '~/constantes/ids/jodit-editor';
import { setModoEdicaoPlanoAula } from '~/redux/modulos/frequenciaPlanoAula/actions';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';

const RecuperacaoContinua = () => {
  const dispatch = useDispatch();

  const desabilitarCamposPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.desabilitarCamposPlanoAula
  );

  const dadosPlanoAula = useSelector(
    state => state.frequenciaPlanoAula?.dadosPlanoAula
  );

  const temPeriodoAberto = useSelector(
    state => state.frequenciaPlanoAula.temPeriodoAberto
  );

  const configCabecalho = {
    altura: '44px',
    corBorda: '#4072d6',
  };

  const onChangeRecuperacaoContinua = valor => {
    const recuperacaoAulaValor = dadosPlanoAula?.recuperacaoAula ?? '';

    if (recuperacaoAulaValor !== valor) {
      ServicoPlanoAula.atualizarDadosPlanoAula('recuperacaoAula', valor);
      dispatch(setModoEdicaoPlanoAula(true));
    }
  };

  return (
    <>
      <CardCollapse
        id={SGP_COLLAPSE_RECUPERACAO_CONTINUA}
        key="recuperacao-continua"
        titulo="Recuperação contínua"
        indice="recuperacao-continua"
        configCabecalho={configCabecalho}
      >
        <fieldset className="mt-3">
          <JoditEditor
            id={SGP_JODIT_EDITOR_RECUPERACAO_CONTINUA}
            desabilitar={desabilitarCamposPlanoAula || !temPeriodoAberto}
            onChange={onChangeRecuperacaoContinua}
            value={dadosPlanoAula?.recuperacaoAula}
          />
        </fieldset>
      </CardCollapse>
    </>
  );
};

export default RecuperacaoContinua;
