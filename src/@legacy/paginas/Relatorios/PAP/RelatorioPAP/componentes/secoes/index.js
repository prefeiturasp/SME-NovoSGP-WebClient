import { useCallback, useEffect } from 'react';
import {
  setDadosSecoesRelatorioPAP,
  setExibirLoaderRelatorioPAP,
} from '@/@legacy/redux/modulos/relatorioPAP/actions';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';
import { useDispatch, useSelector } from 'react-redux';
import CollapseDadosSecaoRelatorioPAP from '../dadosSecoesRelatorioPAP/collapseDadosSecaoRelatorioPAP';

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
        // TODO mudar params
        turmaSelecionada?.turma,
        turmaSelecionada?.anoLetivo,
        periodoSelecionadoPAP?.periodoRelatorioPAP
      ).catch(e => erros(e));

      if (retorno?.data?.length) {
        dispatch(setDadosSecoesRelatorioPAP(retorno.data));
      } else {
        dispatch(setDadosSecoesRelatorioPAP([]));
      }

      dispatch(setExibirLoaderRelatorioPAP(false));
    }
  }, [turmaSelecionada, dispatch, periodoSelecionadoPAP]);

  useEffect(() => {
    if (estudanteSelecionadoRelatorioPAP?.codigoEOL) {
      obterDadosSecoes();
    } else {
      dispatch(setDadosSecoesRelatorioPAP([]));
    }
  }, [estudanteSelecionadoRelatorioPAP, obterDadosSecoes, dispatch]);

  if (!dadosSecoesRelatorioPAP?.length) return <></>;

  return dadosSecoesRelatorioPAP.map((item, index) => (
    <CollapseDadosSecaoRelatorioPAP key={index} dados={item} index={index} />
  ));
};

export default SecoesRelatorioPAP;
