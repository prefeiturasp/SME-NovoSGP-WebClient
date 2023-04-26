import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { CardCollapse, Loader } from '~/componentes';

import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

import ReestruturacaoTabela from '../ReestruturacaoTabela/reestruturacaoTabela';
import { setReestruturacaoDados } from '~/redux/modulos/planoAEE/actions';
import { erros } from '~/servicos';
import { useParams } from 'react-router-dom';

const SecaoReestruturacaoPlano = () => {
  const paramsRoute = useParams();

  const planoId = paramsRoute?.id || 0;

  const [listaPrimeiroSemestre, setListaPrimeiroSemestre] = useState([]);
  const [listaSegundoSemestre, setListaSegundoSemestre] = useState([]);
  const [carregandoReestruturacao, setCarregandoReestruturacao] =
    useState(false);

  const keyPrimeiroSemestre = 'secao-1-semestre-plano-collapse';
  const keySegundoSemestre = 'secao-2-semestre-plano-collapse';

  const reestruturacaoDados = useSelector(
    store => store.planoAEE.reestruturacaoDados
  );

  const dispatch = useDispatch();

  const FormatarDados = dados =>
    dados.map(item => {
      const dataFormatada = moment(item.data).format('DD/MM/YYYY');
      return {
        ...item,
        data: dataFormatada,
      };
    });

  const separarDados = useCallback(dados => {
    if (dados) {
      const dadosPrimeiroSemestre = dados.filter(item => item.semestre === 1);
      const dadosSegundoSemestre = dados.filter(item => item.semestre === 2);
      setListaPrimeiroSemestre(FormatarDados(dadosPrimeiroSemestre));
      setListaSegundoSemestre(FormatarDados(dadosSegundoSemestre));
    }
  }, []);

  const obterReestruturacoes = useCallback(async () => {
    setCarregandoReestruturacao(true);
    const resposta = await ServicoPlanoAEE.obterReestruturacoes(planoId)
      .catch(e => erros(e))
      .finally(() => setCarregandoReestruturacao(false));
    if (resposta?.data) {
      dispatch(setReestruturacaoDados(resposta?.data));
    }
  }, [dispatch, planoId]);

  useEffect(() => {
    obterReestruturacoes();
    return () => {
      dispatch(setReestruturacaoDados([]));
    };
  }, [dispatch, obterReestruturacoes]);

  useEffect(() => {
    if (reestruturacaoDados) {
      separarDados(reestruturacaoDados);
    }
  }, [reestruturacaoDados, separarDados]);

  return (
    <Loader loading={carregandoReestruturacao} ignorarTip>
      <CardCollapse
        key={`${keyPrimeiroSemestre}-key`}
        titulo="Reestruturações do 1º Semestre"
        show
        indice={`${keyPrimeiroSemestre}-indice`}
        alt="secao-informacoes-plano-alt"
      >
        <ReestruturacaoTabela
          key={keyPrimeiroSemestre}
          semestre={1}
          listaDados={listaPrimeiroSemestre}
        />
      </CardCollapse>
      <CardCollapse
        key={`${keySegundoSemestre}-key`}
        titulo="Reestruturações do 2º Semestre"
        show
        indice={`${keySegundoSemestre}-indice`}
        alt="secao-informacoes-plano-alt"
      >
        <ReestruturacaoTabela
          key={keySegundoSemestre}
          semestre={2}
          listaDados={listaSegundoSemestre}
        />
      </CardCollapse>
    </Loader>
  );
};

export default SecaoReestruturacaoPlano;
