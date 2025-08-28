import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { ServicoFiltroRelatorio } from '~/servicos';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros } from '~/servicos/alertas';
import { Col, Row } from 'antd';

const InformacoesEducacionaisFiltros = ({ obterDreSelecionado }) => {
  const usuario = useSelector(store => store.usuario);
  const [anoLetivo, setAnoLetivo] = useState(null); 
  const [dre, setDre] = useState(null);
  const [ue, setUe] = useState(null);
  const [modalidade, setModalidade] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [tipoVisualizacao, setTipoVisualizacao] = useState('global');
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTiposVisualizacao, setListaTiposVisualizacao] = useState([
    { valor: 'global', desc: 'Global/Acumulada' },
    { valor: 'mensal', desc: 'Mensal' }
  ]);

  const [anoAtual] = useState(moment().format('YYYY'));
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);

  const ehEJAOuCelp =
    Number(modalidade) === ModalidadeEnum.EJA ||
    Number(modalidade) === ModalidadeEnum.CELP;

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);

    const anosLetivos = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    });

    if (!anosLetivos.length) {
      anosLetivos.push({
        desc: anoAtual,
        valor: anoAtual,
      });
    }

    let valorAtual;
    if (anosLetivos?.length) {
      const temAnoAtualNaLista = anosLetivos.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) {
        valorAtual = anoAtual;
      } else {
        valorAtual = anosLetivos[0].valor;
      }
    }
    
    setAnoLetivo(valorAtual);
    setListaAnosLetivo(anosLetivos);
    setCarregandoAnosLetivos(false);
  }, [anoAtual, consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos, consideraHistorico]);

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoDres(true);
      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDres(false));

      if (resposta?.data) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          codigo: item.codigo,
          abrev: item.abreviacao,
          id: item.id,
        }));

        if (lista?.length > 1) {
          lista.unshift({
            desc: 'Todas',
            codigo: OPCAO_TODOS,
          });
        }

        setListaDres(lista);
        
        if (lista?.length === 1) {
          setDre(lista[0]);
        } else {
          setDre(null);
        }
      } else {
        setListaDres([]);
        setDre(null);
      }
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    } else {
      setListaDres([]);
      setDre(null);
    }
  }, [anoLetivo, obterDres]);

  const obterUes = useCallback(async () => {
    if (dre?.codigo) {
      if (dre?.codigo === OPCAO_TODOS) {
        const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };
        setListaUes([ueTodos]);
        setUe(ueTodos);
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
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          codigo: item.codigo,
          id: item.id,
        }));

        if (lista?.length > 1) {
          lista.unshift({
            desc: 'Todas',
            codigo: OPCAO_TODOS,
          });
        }

        setListaUes(lista);
        
        if (lista?.length === 1) {
          setUe(lista[0]);
        } else {
          setUe(null);
        }
      } else {
        setListaUes([]);
        setUe(null);
      }
    }
  }, [anoLetivo, consideraHistorico, dre]);

  useEffect(() => {
    if (dre?.codigo) {
      obterUes();
    } else {
      setListaUes([]);
      setUe(null);
    }
  }, [dre, obterUes]);

  const obterModalidades = useCallback(async () => {
    if (ue?.codigo) {
      setCarregandoModalidades(true);
      const resposta = await ServicoFiltroRelatorio.obterModalidades(
        ue.codigo,
        usuario.turmaSelecionada.anoLetivo,
        false
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoModalidades(false));

      if (resposta?.data?.length) {
        const lista = resposta.data;
        setListaModalidades(lista);
        
        if (lista?.length === 1) {
          setModalidade(lista[0].valor);
        } else {
          setModalidade(null);
        }
      } else {
        setListaModalidades([]);
        setModalidade(null);
      }
    }
  }, [ue, usuario.turmaSelecionada]);

  useEffect(() => {
    if (ue?.codigo) {
      obterModalidades();
    } else {
      setListaModalidades([]);
      setModalidade(null);
    }
  }, [ue, obterModalidades]);

  const obterSemestres = useCallback(async () => {
    if (
      anoLetivo &&
      modalidade &&
      (Number(modalidade) === ModalidadeEnum.EJA || Number(modalidade) === ModalidadeEnum.CELP)
    ) {
      setCarregandoSemestres(true);
      const resposta = await FiltroHelper.obterSemestres()
        .catch(e => erros(e))
        .finally(() => setCarregandoSemestres(false));
      if (resposta?.data) {
        setListaSemestres(resposta.data);
      }
    } else {
      setListaSemestres([]);
      setSemestre(null);
    }
  }, [anoLetivo, modalidade]);

  useEffect(() => {
    obterSemestres();
  }, [modalidade, obterSemestres]);

  const onChangeConsideraHistorico = () => {
    setConsideraHistorico(!consideraHistorico);
  };

  const onChangeTipoVisualizacao = (valor) => {
    setTipoVisualizacao(valor);
  };

  const onChangeDre = (valor) => {
    setDre(valor);
    if (valor && obterDreSelecionado) obterDreSelecionado(valor);
  };

  return (
  <Row>
    <Col span={24}>
      <Loader loading={carregandoDres}>
        <SelectComponent
          label="Selecione ou digite a DRE..."
          lista={listaDres}
          valueOption="codigo"
          valueText="desc"
          disabled={listaDres?.length === 1}
          onChange={onChangeDre}
          valueSelect={dre?.codigo}
          placeholder="DRE"
          showSearch
          defaultValue="Todas"
          allowClear={false}
        />
      </Loader>
    </Col>
  </Row>
  );
};

export default InformacoesEducacionaisFiltros;
