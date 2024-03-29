import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardCollapse from '~/componentes/cardCollapse';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import { SGP_COLLAPSE_DESENVOLVIMENTO_AULA } from '~/constantes/ids/collapse';
import { SGP_JODIT_EDITOR_DESENVOLVIMENTO_AULA } from '~/constantes/ids/jodit-editor';
import {
  setDesenvolvimentoDaAulaValidaObrigatoriedade,
  setModoEdicaoPlanoAula,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';

const DesenvolvimentoDaAula = () => {
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

  const refForm = useRef();

  const configCabecalho = {
    altura: '44px',
    corBorda: '#4072d6',
  };

  const desenvolvimentoDaAulaValidaObrigatoriedade = () => {
    refForm.current.events.fire('validarSeTemErro');
  };

  useEffect(() => {
    dispatch(
      setDesenvolvimentoDaAulaValidaObrigatoriedade(() =>
        desenvolvimentoDaAulaValidaObrigatoriedade()
      )
    );
  }, [refForm, dispatch]);

  const onChangeDesenvolvimentoAula = valor => {
    const desenvolvimentoAulaValor = dadosPlanoAula?.desenvolvimentoAula ?? '';

    if (desenvolvimentoAulaValor !== valor) {
      ServicoPlanoAula.atualizarDadosPlanoAula('desenvolvimentoAula', valor);
      dispatch(setModoEdicaoPlanoAula(true));
    }
  };

  return (
    <>
      <CardCollapse
        id={SGP_COLLAPSE_DESENVOLVIMENTO_AULA}
        key="desenvolvimento-aula"
        titulo="Desenvolvimento da aula"
        indice="desenvolvimento-aula"
        configCabecalho={configCabecalho}
        show
      >
        <fieldset className="mt-3">
          <JoditEditor
            id={SGP_JODIT_EDITOR_DESENVOLVIMENTO_AULA}
            ref={refForm}
            validarSeTemErro={valor =>
              !valor && !desabilitarCamposPlanoAula && temPeriodoAberto
            }
            mensagemErro="Campo obrigatório"
            desabilitar={desabilitarCamposPlanoAula || !temPeriodoAberto}
            onChange={onChangeDesenvolvimentoAula}
            value={dadosPlanoAula?.desenvolvimentoAula}
          />
        </fieldset>
      </CardCollapse>
    </>
  );
};

export default DesenvolvimentoDaAula;
