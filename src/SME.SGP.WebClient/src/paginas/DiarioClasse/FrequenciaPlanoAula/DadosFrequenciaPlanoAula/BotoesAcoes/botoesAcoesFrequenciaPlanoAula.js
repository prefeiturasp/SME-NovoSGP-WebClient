import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_VOLTAR,
} from '~/componentes-sgp/filtro/idsCampos';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes';
import {
  setExibirCardCollapseFrequencia,
  setLimparDadosPlanoAula,
  setModoEdicaoFrequencia,
  setModoEdicaoPlanoAula,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import { confirmar, history } from '~/servicos';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import servicoSalvarFrequenciaPlanoAula from '../../servicoSalvarFrequenciaPlanoAula';

const BotoesAcoesFrequenciaPlanoAula = () => {
  const dispatch = useDispatch();

  const modoEdicaoFrequencia = useSelector(
    state => state.frequenciaPlanoAula.modoEdicaoFrequencia
  );

  const modoEdicaoPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.modoEdicaoPlanoAula
  );

  const somenteConsulta = useSelector(
    state => state.frequenciaPlanoAula.somenteConsulta
  );

  const idFrequencia = useSelector(
    state => state.frequenciaPlanoAula.listaDadosFrequencia?.id
  );

  const aulaIdPodeEditar = useSelector(
    state => state.frequenciaPlanoAula?.aulaIdPodeEditar
  );

  const onClickSalvar = async () => {
    servicoSalvarFrequenciaPlanoAula.validarSalvarFrequenciPlanoAula();
  };

  const pergutarParaSalvar = () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const irParaHome = () => {
    history.push(URL_HOME);
  };

  const onClickVoltar = async () => {
    if ((modoEdicaoFrequencia || modoEdicaoPlanoAula) && aulaIdPodeEditar) {
      const confirmado = await pergutarParaSalvar();
      if (confirmado) {
        const salvou = await servicoSalvarFrequenciaPlanoAula.validarSalvarFrequenciPlanoAula();
        if (salvou) {
          irParaHome();
        }
      } else {
        irParaHome();
      }
    } else {
      irParaHome();
    }
  };

  const onClickCancelar = async () => {
    if ((modoEdicaoFrequencia || modoEdicaoPlanoAula) && aulaIdPodeEditar) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        ServicoFrequencia.obterListaFrequencia();
        dispatch(setExibirCardCollapseFrequencia(false));
        dispatch(setModoEdicaoFrequencia(false));
        dispatch(setLimparDadosPlanoAula());
        dispatch(setModoEdicaoPlanoAula(false));
      }
    }
  };

  return (
    <>
      <Button
        id={SGP_BUTTON_VOLTAR}
        label="Voltar"
        icon="arrow-left"
        color={Colors.Azul}
        border
        className="mr-3"
        onClick={onClickVoltar}
      />
      <Button
        id={SGP_BUTTON_CANCELAR}
        label="Cancelar"
        color={Colors.Roxo}
        border
        className="mr-3"
        onClick={onClickCancelar}
        disabled={
          somenteConsulta || (!modoEdicaoFrequencia && !modoEdicaoPlanoAula)
        }
      />
      <Button
        id={SGP_BUTTON_ALTERAR_CADASTRAR}
        label={idFrequencia ? 'Alterar' : 'Cadastrar'}
        color={Colors.Roxo}
        border
        bold
        onClick={onClickSalvar}
        disabled={
          somenteConsulta ||
          (!modoEdicaoFrequencia && !modoEdicaoPlanoAula) ||
          !aulaIdPodeEditar
        }
      />
    </>
  );
};

export default BotoesAcoesFrequenciaPlanoAula;
