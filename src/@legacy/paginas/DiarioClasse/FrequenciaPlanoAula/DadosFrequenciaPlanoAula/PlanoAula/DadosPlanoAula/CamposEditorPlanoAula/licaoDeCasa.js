import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardCollapse from '~/componentes/cardCollapse';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import { SGP_COLLAPSE_LICAO_CASA } from '~/constantes/ids/collapse';
import { SGP_JODIT_EDITOR_LICAO_CASA } from '~/constantes/ids/jodit-editor';
import { setModoEdicaoPlanoAula } from '~/redux/modulos/frequenciaPlanoAula/actions';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';

const LicaoDeCasa = () => {
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

  const onChangeLicaoCasa = valor => {
    const licaoCasaValor = dadosPlanoAula?.licaoCasa ?? '';

    if (licaoCasaValor !== valor) {
      ServicoPlanoAula.atualizarDadosPlanoAula('licaoCasa', valor);
      dispatch(setModoEdicaoPlanoAula(true));
    }
  };

  return (
    <>
      <CardCollapse
        id={SGP_COLLAPSE_LICAO_CASA}
        key="licao-casa"
        titulo="Lição de casa"
        indice="licao-casa"
        configCabecalho={configCabecalho}
      >
        <fieldset className="mt-3">
          <JoditEditor
            id={SGP_JODIT_EDITOR_LICAO_CASA}
            desabilitar={desabilitarCamposPlanoAula || !temPeriodoAberto}
            onChange={onChangeLicaoCasa}
            value={dadosPlanoAula?.licaoCasa}
          />
        </fieldset>
      </CardCollapse>
    </>
  );
};

export default LicaoDeCasa;
