import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/componentes-sgp/filtro/idsCampos';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import { confirmar } from '~/servicos/alertas';
import history from '~/servicos/history';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import servicoSalvarConselhoClasse from '../../servicoSalvarConselhoClasse';

import { setDadosListasNotasConceitos } from '~/redux/modulos/conselhoClasse/actions';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';

const BotoesAcoesConselhoClasse = () => {
  const dispatch = useDispatch();

  const alunosConselhoClasse = useSelector(
    store => store.conselhoClasse.alunosConselhoClasse
  );

  const conselhoClasseEmEdicao = useSelector(
    store => store.conselhoClasse.conselhoClasseEmEdicao
  );

  const notaConceitoPosConselhoAtual = useSelector(
    store => store.conselhoClasse.notaConceitoPosConselhoAtual
  );

  const desabilitarCampos = useSelector(
    store => store.conselhoClasse.desabilitarCampos
  );

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const dadosIniciaisListasNotasConceitos = useSelector(
    store => store.conselhoClasse.dadosIniciaisListasNotasConceitos
  );

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const onClickSalvar = async () => {
    const validouNotaConceitoPosConselho = await servicoSalvarConselhoClasse.validarNotaPosConselho(
      true
    );
    if (validouNotaConceitoPosConselho) {
      const validouAnotacaoRecomendacao = await servicoSalvarConselhoClasse.validarSalvarRecomendacoesAlunoFamilia(
        true
      );
      return validouNotaConceitoPosConselho && validouAnotacaoRecomendacao;
    }

    return false;
  };

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const onClickVoltar = async () => {
    if (
      !desabilitarCampos &&
      (conselhoClasseEmEdicao || notaConceitoPosConselhoAtual.ehEdicao)
    ) {
      const confirmado = await perguntaAoSalvar();
      if (confirmado) {
        const salvou = await onClickSalvar();
        if (salvou) {
          history.push(URL_HOME);
        }
      } else {
        history.push(URL_HOME);
      }
    } else {
      history.push(URL_HOME);
    }
  };

  const onClickCancelar = async () => {
    if (conselhoClasseEmEdicao || notaConceitoPosConselhoAtual.ehEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        servicoSalvarConselhoClasse.recarregarDados();
        const dadosCarregar = _.cloneDeep(dadosIniciaisListasNotasConceitos);
        dispatch(setDadosListasNotasConceitos([...dadosCarregar]));
      }
    }
  };
  return (
    <>
      <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
      <Button
        id={SGP_BUTTON_CANCELAR}
        label="Cancelar"
        color={Colors.Roxo}
        border
        className="mr-2"
        onClick={onClickCancelar}
        disabled={
          desabilitarCampos ||
          !alunosConselhoClasse ||
          alunosConselhoClasse.length < 1 ||
          !conselhoClasseEmEdicao
        }
      />
      <Button
        id={SGP_BUTTON_SALVAR}
        label="Salvar"
        color={Colors.Roxo}
        border
        bold
        onClick={onClickSalvar}
        disabled={
          ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
          desabilitarCampos ||
          (!conselhoClasseEmEdicao && !notaConceitoPosConselhoAtual.ehEdicao)
        }
      />
    </>
  );
};

export default BotoesAcoesConselhoClasse;
