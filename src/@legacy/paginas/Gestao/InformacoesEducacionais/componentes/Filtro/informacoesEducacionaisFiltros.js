import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { ServicoFiltroRelatorio } from '~/servicos';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros } from '~/servicos/alertas';
import { Col, Row } from 'antd';

const InformacoesEducacionaisFiltros = ({
  obterDreSelecionado,
  obterUeSelecionado,
  setAnoLetivo,
  anoLetivo,
}) => {
  const usuario = useSelector(store => store.usuario);

  const anoMinimo = 2019;
  const [dre, setDre] = useState(null);
  const [ue, setUe] = useState(null);
  const [modalidade, setModalidade] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [primeiroCarregamentoDre, setPrimeiroCarregamentoDre] = useState(true);
  const [primeiroCarregamentoUe, setPrimeiroCarregamentoUe] = useState(true);

  const [anoAtual] = useState(moment().format('YYYY'));
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [listaAnos, setListaAnos] = useState([]);

  useEffect(() => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    let id = 1;

    for (let a = anoAtual; a >= 2019 && anos.length < 10; a--) {
      anos.push({ id: id++, nome: String(a) });
    }

    setListaAnos(anos);
  }, []);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    const anosLetivos = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
      anoMinimo,
    });
    if (!anosLetivos.length) {
      anosLetivos.push({ desc: anoAtual, valor: anoAtual });
    }

    const temAnoAtualNaLista = anosLetivos.find(
      item => String(item.valor) === String(anoAtual)
    );
    const valorAtual = temAnoAtualNaLista ? anoAtual : anosLetivos[0].valor;

    setAnoLetivo(valorAtual);
    setCarregandoAnosLetivos(false);

    if (obterAnoLetivoSelecionado) obterAnoLetivoSelecionado(valorAtual);
  }, [anoAtual, consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const obterDres = useCallback(
    async (mostrarLoader = false) => {
      if (mostrarLoader) setCarregandoDres(true);

      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
      ).catch(e => erros(e));

      if (resposta?.data) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          codigo: item.codigo,
          abrev: item.abreviacao,
          id: item.id,
        }));
        if (lista.length > 1)
          lista.unshift({ desc: 'Todas', codigo: OPCAO_TODOS });
        setListaDres(lista);

        if (!dre) {
          if (lista.length === 1) setDre(lista[0]);
          else if (lista.length > 1)
            setDre(lista.find(d => d.codigo === OPCAO_TODOS));
        }
      } else {
        setListaDres([]);
        if (!dre) setDre(null);
      }

      if (mostrarLoader) {
        setCarregandoDres(false);
        setPrimeiroCarregamentoDre(false);
      }
    },
    [consideraHistorico, anoLetivo, dre]
  );

  useEffect(() => {
    if (anoLetivo) obterDres(primeiroCarregamentoDre);
  }, [anoLetivo, obterDres, primeiroCarregamentoDre]);

  const obterUes = useCallback(
    async (mostrarLoader = false, anoParam = anoLetivo) => {
      if (!dre) return;

      if (dre.codigo === OPCAO_TODOS) {
        const ueTodos = { desc: 'Todas', codigo: OPCAO_TODOS };
        setListaUes([ueTodos]);
        if (!ue) setUe(ueTodos);
        return;
      }

      if (mostrarLoader) setCarregandoUes(true);

      const resposta = await AbrangenciaServico.buscarUes(
        dre.codigo,
        `v1/abrangencias/${consideraHistorico}/dres/${dre.codigo}/ues?anoLetivo=${anoParam}`,
        true
      ).catch(e => erros(e));

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          codigo: item.codigo,
          id: item.id,
        }));
        if (lista.length > 1)
          lista.unshift({ desc: 'Todas', codigo: OPCAO_TODOS });
        setListaUes(lista);

        if (!ue) {
          if (lista.length === 1) setUe(lista[0]);
          else if (lista.length > 1)
            setUe(lista.find(u => u.codigo === OPCAO_TODOS));
        }
      } else {
        setListaUes([]);
        if (!ue) setUe(null);
      }

      if (mostrarLoader) {
        setCarregandoUes(false);
        setPrimeiroCarregamentoUe(false);
      }
    },
    [dre, consideraHistorico, ue]
  );

  useEffect(() => {
    if (dre) obterUes(true, anoLetivo);
    else {
      setListaUes([]);
      setUe(null);
    }
  }, [dre, obterUes]);

  const obterModalidades = useCallback(async () => {
    if (!ue?.codigo) return;

    setCarregandoModalidades(true);
    const resposta = await ServicoFiltroRelatorio.obterModalidades(
      ue.codigo,
      anoLetivo,
      false
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoModalidades(false));

    if (resposta?.data?.length) {
      setListaModalidades(resposta.data);
      setModalidade(resposta.data.length === 1 ? resposta.data[0].valor : null);
    } else {
      setListaModalidades([]);
      setModalidade(null);
    }
  }, [ue, anoLetivo]);

  useEffect(() => {
    if (ue?.codigo) obterModalidades();
    else {
      setListaModalidades([]);
      setModalidade(null);
    }
  }, [ue, obterModalidades]);

  const obterSemestres = useCallback(async () => {
    if (
      anoLetivo &&
      modalidade &&
      (Number(modalidade) === ModalidadeEnum.EJA ||
        Number(modalidade) === ModalidadeEnum.CELP)
    ) {
      setCarregandoSemestres(true);
      const resposta = await FiltroHelper.obterSemestres()
        .catch(e => erros(e))
        .finally(() => setCarregandoSemestres(false));
      if (resposta?.data) setListaSemestres(resposta.data);
    } else {
      setListaSemestres([]);
      setSemestre(null);
    }
  }, [anoLetivo, modalidade]);

  useEffect(() => {
    obterSemestres();
  }, [modalidade, obterSemestres]);

  const onChangeDre = codigo => {
    const dreSelecionada = listaDres.find(d => d.codigo === codigo) || null;
    setDre(dreSelecionada);
    setUe(null);
    setListaUes([]);
    if (dreSelecionada && obterDreSelecionado)
      obterDreSelecionado(dreSelecionada);
  };

  const onChangeUe = codigo => {
    const ueSelecionada = listaUes.find(u => u.codigo === codigo) || null;
    setUe(ueSelecionada);
    if (ueSelecionada && obterUeSelecionado) obterUeSelecionado(ueSelecionada);
  };

  const onChangeAnoLetivo = valor => {
    setAnoLetivo(valor);
    if (obterAnoLetivoSelecionado) obterAnoLetivoSelecionado(valor);
  };

  return (
    <div>
      <p
        style={{
          fontSize: '14px',
          marginBottom: '20px',
          paddingTop: '8px',
          fontWeight: 400,
          color: '#42474a',
          lineHeight: 1.2,
          margin: '0 0 20px 0',
        }}
      >
        Você pode filtrar por uma Diretoria Regional de Educação (DRE) e Unidade
        Educacional (UE) específica.
      </p>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8}>
          <Loader loading={carregandoAnosLetivos}>
            <SelectComponent
              id="ano"
              label="Ano letivo"
              lista={listaAnos}
              valueOption="nome"
              valueText="nome"
              onChange={e => {
                setAnoLetivo(e);
              }}
              valueSelect={anoLetivo}
              placeholder="Selecione o ano"
              allowClear={false}
            />
          </Loader>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Loader loading={carregandoDres}>
            <SelectComponent
              label="Diretoria Regional de Educação (DRE)"
              lista={listaDres}
              valueOption="codigo"
              valueText="desc"
              onChange={onChangeDre}
              valueSelect={dre?.codigo}
              placeholder="Selecione uma DRE"
              showSearch
              allowClear={false}
            />
          </Loader>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Loader loading={carregandoUes}>
            <SelectComponent
              label="Unidade Educacional (UE)"
              lista={listaUes}
              valueOption="codigo"
              valueText="desc"
              onChange={onChangeUe}
              valueSelect={ue?.codigo}
              placeholder="Selecione uma UE"
              showSearch
              allowClear={false}
            />
          </Loader>
        </Col>
      </Row>
    </div>
  );
};

export default InformacoesEducacionaisFiltros;
