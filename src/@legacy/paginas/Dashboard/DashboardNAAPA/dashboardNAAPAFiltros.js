import { Col, Row } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import {
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_DRE,
  SGP_SELECT_MODALIDADE,
  SGP_SELECT_SEMESTRE,
  SGP_SELECT_UE,
} from '~/constantes/ids/select';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';
import { OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros, ServicoFiltroRelatorio } from '~/servicos';
import api from '~/servicos/api';
import { obterTodosMeses, ordenarListaMaiorParaMenor } from '~/utils';
import NAAPAContext from './naapaContext';

const DashboardNAAPAFiltros = () => {
  const {
    setConsideraHistorico,
    consideraHistorico,
    setAnoLetivo,
    anoLetivo,
    setDre,
    dre,
    setUe,
    ue,
    modalidade,
    setModalidade,
    semestre,
    setSemestre,
    setListaMesesReferencias,
    setListaMesesReferencias2,
  } = useContext(NAAPAContext);

  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [carregandoAnos, setCarregandoAnos] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [listaUes, setListaUes] = useState([]);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [listaSemestres, setListaSemestres] = useState([]);

  const ANO_MINIMO = 2020;

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
    setDre();
    setUe();
  };

  const onChangeAnoLetivo = async valor => {
    setDre();
    setUe();
    setAnoLetivo(valor);
    setModalidade();
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnos(true);
    let anosLetivos = [];

    const [anosLetivoComHistorico, anosLetivoSemHistorico] = await Promise.all([
      FiltroHelper.obterAnosLetivos({
        consideraHistorico: true,
        anoMinimo: ANO_MINIMO,
      }),
      FiltroHelper.obterAnosLetivos({
        consideraHistorico: false,
      }),
    ])
      .catch(e => erros(e))
      .finally(() => setCarregandoAnos(false));
    anosLetivos = anosLetivos.concat(anosLetivoComHistorico);

    anosLetivoSemHistorico.forEach(ano => {
      if (!anosLetivoComHistorico.find(a => a.valor === ano.valor)) {
        anosLetivos.push(ano);
      }
    });

    if (!anosLetivos.length) {
      anosLetivos.push({
        desc: anoAtual,
        valor: anoAtual,
      });
    }

    if (anosLetivos?.length) {
      const temAnoAtualNaLista = anosLetivos.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) setAnoLetivo(anoAtual);
      else setAnoLetivo(anosLetivos[0].valor);
    }

    setListaAnosLetivo(ordenarListaMaiorParaMenor(anosLetivos, 'valor'));

  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const onChangeDre = codigoDre => {
    let valorAtal;

    if (codigoDre) {
      const dreAtual = listaDres?.find?.(item => item?.codigo === codigoDre);
      if (dreAtual) {
        valorAtal = dreAtual;
      }
    }

    setDre(valorAtal);
    setUe();
    setModalidade();
  };

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const retorno = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));
    if (retorno?.data?.length) {
      const lista = retorno.data;

      if (lista?.length === 1) {
        setDre(lista[0]);
      } else {
        lista.unshift({
          nome: 'Todas',
          codigo: OPCAO_TODOS,
        });
      }

      setListaDres(lista);
      return;
    }
    setListaDres([]);
    setDre();

  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [obterDres, anoLetivo]);

  const onChangeUe = codigoUe => {
    setModalidade(undefined);
    setListaModalidades([]);

    let valorAtual;
    if (codigoUe) {
      const ueAtual = listaUes?.find?.(item => item?.codigo === codigoUe);
      if (ueAtual) {
        valorAtual = ueAtual;
      }
    }
    setUe(valorAtual);
  };

  const obterUes = useCallback(async () => {
    if (dre?.codigo) {
      if (dre?.codigo === OPCAO_TODOS) {
        const objUe = { codigo: OPCAO_TODOS, nome: 'Todas' };
        setListaUes([objUe]);
        setUe(objUe);
        return;
      }

      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dre?.codigo,
        `v1/abrangencias/${consideraHistorico}/dres/${dre?.codigo}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));
      if (resposta?.data?.length) {
        const lista = resposta.data;

        if (lista.length === 1) {
          setUe(lista[0]);
        } else {
          lista.unshift({
            nome: 'Todas',
            codigo: OPCAO_TODOS,
          });
        }

        setListaUes(lista);
        return;
      }
      setListaUes([]);
    }

  }, [consideraHistorico, anoLetivo, dre]);

  useEffect(() => {
    setUe();
    setListaUes([]);
    if (dre?.codigo) {
      obterUes(anoLetivo);
    }

  }, [dre, anoLetivo, obterUes]);

  const onChangeModalidade = valor => setModalidade(valor);

  const obterModalidades = useCallback(async () => {
    setCarregandoModalidades(true);
    const resposta = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
      ue?.codigo
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoModalidades(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.map(item => ({
        desc: item.descricao,
        valor: String(item.valor),
      }));

      if (lista?.length === 1) {
        setModalidade(lista[0].valor);
      }
      setListaModalidades(lista);
    }

  }, [ue]);

  useEffect(() => {
    setModalidade();
    setListaModalidades([]);
    if (anoLetivo && ue?.codigo) {
      obterModalidades();
    }

  }, [anoLetivo, ue, obterModalidades]);

  const onChangeSemestre = valor => setSemestre(valor);

  const obterSemestres = useCallback(async () => {
    setCarregandoSemestres(true);
    const retorno = await api
      .get(
        `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivo}&modalidade=${modalidade ||
          0}`
      )
      .catch(e => erros(e))
      .finally(() => {
        setCarregandoSemestres(false);
      });
    if (retorno?.data?.length) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista?.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestres(lista);
    } else {
      setListaSemestres();
      setSemestre();
    }

  }, [modalidade, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (modalidade && anoLetivo && Number(modalidade) === ModalidadeDTO.EJA) {
      setSemestre();
      obterSemestres();
    } else {
      setSemestre();
      setListaSemestres([]);
    }

  }, [modalidade, anoLetivo, obterSemestres]);

  const montarMeses = useCallback(() => {
    const meses = obterTodosMeses();
    delete meses[0];
    meses.unshift({ numeroMes: OPCAO_TODOS, nome: 'Acumulado' });
    setListaMesesReferencias(meses);

  }, []);

  const montarMeses2 = useCallback(() => {
    const meses2 = obterTodosMeses();
    delete meses2[0];
    setListaMesesReferencias2(meses2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    montarMeses();
  }, [montarMeses]);

  useEffect(() => {
    montarMeses2();
  }, [montarMeses2]);

  return (
    <>
      <Col span={24}>
        <Row gutter={[16, 8]}>
          <Col sm={24}>
            <CheckboxComponent
              id={SGP_CHECKBOX_EXIBIR_HISTORICO}
              label="Exibir histórico?"
              onChangeCheckbox={onChangeConsideraHistorico}
              checked={consideraHistorico}
              disabled={listaAnosLetivo.length === 1}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col sm={24} md={12} xl={4}>
            <Loader loading={carregandoAnos} ignorarTip>
              <SelectComponent
                id={SGP_SELECT_ANO_LETIVO}
                label="Ano Letivo"
                lista={listaAnosLetivo}
                valueOption="valor"
                valueText="desc"
                disabled={
                  !consideraHistorico ||
                  !listaAnosLetivo?.length ||
                  listaAnosLetivo?.length === 1
                }
                onChange={onChangeAnoLetivo}
                valueSelect={anoLetivo}
                placeholder="Ano letivo"
              />
            </Loader>
          </Col>
          <Col sm={24} md={12} xl={10}>
            <Loader loading={carregandoDres} ignorarTip>
              <SelectComponent
                id={SGP_SELECT_DRE}
                label="Diretoria Regional de Educação (DRE)"
                lista={listaDres}
                valueOption="codigo"
                valueText="nome"
                disabled={
                  !anoLetivo || listaDres?.length === 1 || !listaDres?.length
                }
                onChange={onChangeDre}
                valueSelect={dre?.codigo}
                placeholder="Diretoria Regional De Educação (DRE)"
                showSearch
              />
            </Loader>
          </Col>
          <Col sm={24} md={12} xl={10}>
            <Loader loading={carregandoUes} ignorarTip>
              <SelectComponent
                id={SGP_SELECT_UE}
                label="Unidade Escolar (UE)"
                lista={listaUes}
                valueOption="codigo"
                valueText="nome"
                disabled={!dre?.codigo || listaUes?.length === 1}
                onChange={onChangeUe}
                valueSelect={ue?.codigo}
                placeholder="Unidade Escolar (UE)"
                showSearch
              />
            </Loader>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col sm={24} md={12} xl={8}>
            <Loader loading={carregandoModalidades} ignorarTip>
              <SelectComponent
                id={SGP_SELECT_MODALIDADE}
                label="Modalidade"
                lista={listaModalidades}
                valueOption="valor"
                valueText="desc"
                disabled={!ue?.codigo || listaModalidades?.length === 1}
                onChange={onChangeModalidade}
                valueSelect={modalidade}
                placeholder="Modalidade"
              />
            </Loader>
          </Col>
          <Col sm={24} md={12} xl={8}>
            <Loader loading={carregandoSemestres} ignorarTip>
              <SelectComponent
                id={SGP_SELECT_SEMESTRE}
                lista={listaSemestres}
                valueOption="valor"
                valueText="desc"
                label="Semestre"
                disabled={
                  !modalidade ||
                  listaSemestres?.length === 1 ||
                  Number(modalidade) !== ModalidadeDTO.EJA
                }
                valueSelect={semestre}
                onChange={onChangeSemestre}
                placeholder="Semestre"
              />
            </Loader>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default DashboardNAAPAFiltros;
