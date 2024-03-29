import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '~/componentes';
import { RegistroMigrado } from '~/componentes-sgp';
import Button from '~/componentes/button';
import { SGP_BUTTON_COPIAR_CONTEUDO_PLANO_AULA } from '~/constantes/ids/button';
import { setExibirModalCopiarConteudoPlanoAula } from '~/redux/modulos/frequenciaPlanoAula/actions';
import BotaoGerarRelatorioPlanoAula from '../BotaoGerarRelatorioPlanoAula/botaoGerarRelatorioPlanoAula';
import SwitchInformarObjetivos from '../SwitchInformarObjetivos/switchInformarObjetivos';

const CabecalhoDadosPlanoAula = () => {
  const dispatch = useDispatch();

  const dadosPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.dadosPlanoAula
  );

  const idPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.dadosPlanoAula?.id
  );

  const desabilitarCamposPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.desabilitarCamposPlanoAula
  );

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-3">
          <span>Quantidade de aulas: {dadosPlanoAula.qtdAulas}</span>
        </div>
        <div className="col-md-9 d-flex justify-content-end">
          <Button
            id={SGP_BUTTON_COPIAR_CONTEUDO_PLANO_AULA}
            label="Copiar Conteúdo"
            icon="clipboard"
            color={Colors.Azul}
            border
            className="mr-3"
            onClick={() =>
              dispatch(setExibirModalCopiarConteudoPlanoAula(true))
            }
            disabled={desabilitarCamposPlanoAula || !idPlanoAula}
          />
          <BotaoGerarRelatorioPlanoAula planoAulaId={idPlanoAula} />
          {dadosPlanoAula.migrado && (
            <RegistroMigrado className="align-self-center">
              Registro Migrado
            </RegistroMigrado>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-12 d-flex justify-content-end">
          <SwitchInformarObjetivos />
        </div>
      </div>
    </>
  );
};

export default CabecalhoDadosPlanoAula;
