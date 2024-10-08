import { SelectComponent } from '@/@legacy/componentes';
import { SGP_SELECT_PERIODO_PAP } from '@/@legacy/constantes/ids/select';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
} from '@/@legacy/redux/modulos/questionarioDinamico/actions';
import {
  limparDadosRelatorioPAP,
  setEstudantesRelatorioPAP,
  setExibirLoaderRelatorioPAP,
  setListaPeriodosPAP,
  setPeriodoSelecionadoPAP,
} from '@/@legacy/redux/modulos/relatorioPAP/actions';
import { erros } from '@/@legacy/servicos';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';
import { Col } from 'antd';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SelectPeridosPAP = () => {
  const dispatch = useDispatch();

  const listaPeriodosPAP = useSelector(
    store => store.relatorioPAP.listaPeriodosPAP
  );

  const turmaSelecionada = useSelector(
    store => store?.usuario?.turmaSelecionada
  );
  const periodoSelecionadoPAP = useSelector(
    store => store.relatorioPAP.periodoSelecionadoPAP
  );

  const valorSemestreSelecionado = periodoSelecionadoPAP?.periodoRelatorioPAP
    ? periodoSelecionadoPAP?.periodoRelatorioPAP?.toString()
    : undefined;

  const obetPeriodosPAP = useCallback(async () => {
    dispatch(setExibirLoaderRelatorioPAP(true));

    const retorno = await ServicoRelatorioPAP.obterPeriodos(
      turmaSelecionada?.turma
    )
      .catch(e => erros(e))
      .finally(() => dispatch(setExibirLoaderRelatorioPAP(false)));

    if (retorno?.data?.length) {
      dispatch(setListaPeriodosPAP(retorno.data));
    } else {
      dispatch(setListaPeriodosPAP([]));
    }
  }, [dispatch]);

  useEffect(() => {
    obetPeriodosPAP();
  }, [obetPeriodosPAP]);

  const onChange = periodoRelatorioPAP => {
    dispatch(setEstudantesRelatorioPAP([]));
    dispatch(limparDadosRelatorioPAP());
    dispatch(setListaSecoesEmEdicao([]));
    dispatch(setLimparDadosQuestionarioDinamico());

    const periodoNaLista = listaPeriodosPAP.find(
      item => String(item?.periodoRelatorioPAP) === String(periodoRelatorioPAP)
    );

    if (periodoNaLista) {
      dispatch(setPeriodoSelecionadoPAP({ ...periodoNaLista }));
    } else {
      dispatch(setPeriodoSelecionadoPAP());
    }
  };

  return (
    <Col sm={24} md={6}>
      <SelectComponent
        id={SGP_SELECT_PERIODO_PAP}
        lista={listaPeriodosPAP}
        valueOption="periodoRelatorioPAP"
        valueText="descricaoPeriodo"
        valueSelect={valorSemestreSelecionado}
        onChange={onChange}
        placeholder="Selecione o período"
        disabled={!listaPeriodosPAP?.length}
        allowClear={false}
      />
    </Col>
  );
};

export default SelectPeridosPAP;
