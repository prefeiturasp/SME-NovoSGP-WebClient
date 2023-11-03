import { useCallback, useEffect } from 'react';
import {
  setDadosSecoesRelatorioPAP,
  setExibirLoaderRelatorioPAP,
} from '@/@legacy/redux/modulos/relatorioPAP/actions';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';
import { useDispatch, useSelector } from 'react-redux';
import CollapseDadosSecaoRelatorioPAP from '../dadosSecoesRelatorioPAP/collapseDadosSecaoRelatorioPAP';
import { erros } from '~/servicos';

export const SecoesRelatorioPAP = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const estudanteSelecionadoRelatorioPAP = useSelector(
    store => store.relatorioPAP?.estudanteSelecionadoRelatorioPAP
  );

  const dadosSecoesRelatorioPAP = useSelector(
    store => store.relatorioPAP?.dadosSecoesRelatorioPAP
  );

  const periodoSelecionadoPAP = useSelector(
    store => store.relatorioPAP?.periodoSelecionadoPAP
  );

  const obterDadosSecoes = useCallback(async () => {
    if (turmaSelecionada?.turma) {
      dispatch(setExibirLoaderRelatorioPAP(true));

      const retorno = await ServicoRelatorioPAP.obterDadosSecoes(
        turmaSelecionada?.turma,
        estudanteSelecionadoRelatorioPAP?.codigoEOL,
        periodoSelecionadoPAP?.periodoRelatorioPAPId
      ).catch(e => erros(e));
      if (retorno?.data?.secoes?.length) {
        dispatch(setDadosSecoesRelatorioPAP(retorno?.data));
      } else {
        dispatch(setDadosSecoesRelatorioPAP([]));
      }

      dispatch(setExibirLoaderRelatorioPAP(false));
    }
  }, [
    turmaSelecionada,
    dispatch,
    estudanteSelecionadoRelatorioPAP,
    periodoSelecionadoPAP,
  ]);

  useEffect(() => {
    if (estudanteSelecionadoRelatorioPAP?.codigoEOL) {
      obterDadosSecoes();
    } else {
      dispatch(setDadosSecoesRelatorioPAP([]));
    }
  }, [estudanteSelecionadoRelatorioPAP, obterDadosSecoes, dispatch]);

  if (!dadosSecoesRelatorioPAP?.secoes?.length) return <></>;

  return dadosSecoesRelatorioPAP?.secoes?.map((item, index) => (
    <CollapseDadosSecaoRelatorioPAP key={index} dados={item} index={index} />
  ));
};

export default SecoesRelatorioPAP;
