import React from 'react';
import { useSelector } from 'react-redux';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import { confirmar } from '~/servicos/alertas';
import history from '~/servicos/history';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import servicoSalvarConselhoClasse from '../../servicoSalvarConselhoClasse';

const BotoesAcoesConselhoClasse = () => {
  const alunosConselhoClasse = useSelector(
    store => store.conselhoClasse.alunosConselhoClasse
  );

  const conselhoClasseEmEdicao = useSelector(
    store => store.conselhoClasse.conselhoClasseEmEdicao
  );

  const bimestreAtual = useSelector(
    store => store.conselhoClasse.bimestreAtual
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
      const confirmado = true;
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
      }
    }
  };
  return (
    <>
      <Button
        id="btn-voltar-conselho-classe"
        label="Voltar"
        icon="arrow-left"
        color={Colors.Azul}
        border
        className="mr-2"
        onClick={onClickVoltar}
      />
      <Button
        id="btn-cancelar-conselho-classe"
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
        id="btn-salvar-conselho-classe"
        label="Salvar"
        color={Colors.Roxo}
        border
        bold
        className="mr-2"
        onClick={onClickSalvar}
        disabled={
          ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
          desabilitarCampos ||
          !conselhoClasseEmEdicao
        }
      />
    </>
  );
};

export default BotoesAcoesConselhoClasse;
