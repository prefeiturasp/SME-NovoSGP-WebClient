import { Col, Row } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { date } from 'yup';
import { Loader, SelectAutocomplete, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes';
import modalidade from '~/dtos/modalidade';
import { AbrangenciaServico, erros, ServicoCalendarios } from '~/servicos';
import FechaReabListaContext from './fechaReabListaContext';

const FechaReabListaFiltros = () => {
  const {
    codigoDre,
    setCodigoDre,
    codigoUe,
    setCodigoUe,
    calendarioSelecionado,
    setCalendarioSelecionado,
  } = useContext(FechaReabListaContext);

  const [carregandoCalendarios, setCarregandoCalendarios] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);

  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaCalendarios, setListaCalendarios] = useState([]);

  const usuario = useSelector(store => store.usuario);

  const obterTiposCalendarios = useCallback(async descricao => {
    setCarregandoCalendarios(true);

    const resposta = await ServicoCalendarios.obterTiposCalendarioAutoComplete(
      descricao
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoCalendarios(false));

    if (resposta?.data) {
      setListaCalendarios(resposta.data);
    } else {
      setListaCalendarios([]);
    }
  }, []);

  const selecionaTipoCalendario = descricao => {
    const calendario = listaCalendarios?.find(t => t?.descricao === descricao);
    if (calendario) {
      setCalendarioSelecionado(calendario);
      setListaUes([]);
      setCodigoUe();
    } else {
      setCalendarioSelecionado({ descricao });
    }
  };

  const handleSearch = descricao => {
    if (descricao.length > 2 || descricao.length === 0) {
      obterTiposCalendarios(descricao);
    }
  };

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const resposta = await AbrangenciaServico.buscarDres()
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        const { codigo } = lista[0];
        setCodigoDre(codigo);
      }

      if (usuario.possuiPerfilSme && lista?.length > 1) {
        lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        setCodigoDre(OPCAO_TODOS);
      }

      setListaDres(lista);
    } else {
      setCodigoDre();
      setListaDres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  useEffect(() => {
    obterTiposCalendarios('');
  }, [obterTiposCalendarios]);

  const setarDreListaAtual = useCallback(() => {
    if (listaDres?.length === 1) {
      setCodigoDre(listaDres[0].codigo);
    } else if (usuario.possuiPerfilSme && listaDres?.length > 1) {
      setCodigoDre(OPCAO_TODOS);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaDres, usuario]);

  useEffect(() => {
    const temCaledarioNaotemDres = !!(
      calendarioSelecionado?.id && !listaDres?.length
    );
    const temCaledarioTemDres = !!(
      calendarioSelecionado?.id && listaDres?.length
    );

    if (temCaledarioNaotemDres) {
      obterDres();
    } else if (temCaledarioTemDres) {
      setarDreListaAtual();
    } else {
      setCodigoDre();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obterDres, calendarioSelecionado, listaDres]);

  const onChangeDre = codigo => {
    setCodigoUe();
    setListaUes([]);
    setCodigoDre(codigo);
  };

  const obterUes = useCallback(async () => {
    const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };

    if (codigoDre === OPCAO_TODOS) {
      setListaUes([ueTodos]);
      setCodigoUe(OPCAO_TODOS);
      return;
    }

    const modalidadeConvertida = !calendarioSelecionado?.modalidade
      ? 0
      : ServicoCalendarios.converterModalidade(
          calendarioSelecionado?.modalidade
        );

    setCarregandoUes(true);
    const resposta = await AbrangenciaServico.buscarUes(
      codigoDre,
      '',
      false,
      modalidadeConvertida,
      calendarioSelecionado.anoLetivo < new Date().getFullYear(),
      calendarioSelecionado.anoLetivo
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoUes(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        const { codigo } = lista[0];
        setCodigoUe(codigo);
      }

      if (usuario.possuiPerfilSmeOuDre && lista?.length > 1) {
        lista.unshift(ueTodos);
        if (codigoDre && codigoDre !== OPCAO_TODOS) {
          setCodigoUe(OPCAO_TODOS);
        }
      }

      setListaUes(lista);
    } else {
      setCodigoUe();
      setListaUes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoDre, calendarioSelecionado, usuario]);

  useEffect(() => {
    if (codigoDre && calendarioSelecionado?.id) {
      obterUes();
    } else {
      setListaUes([]);
      setCodigoUe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoDre, calendarioSelecionado, obterUes]);

  const onChangeUe = codigo => {
    setCodigoUe(codigo);
  };

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={12} xl={8}>
          <Loader loading={carregandoCalendarios} tip="">
            <SelectAutocomplete
              label="Calendário"
              showList
              isHandleSearch
              placeholder="Selecione o calendário"
              className="ant-col-md-24"
              name="tipoCalendarioId"
              id="select-tipo-calendario"
              lista={listaCalendarios || []}
              valueField="id"
              textField="descricao"
              onSelect={valor => selecionaTipoCalendario(valor)}
              onChange={valor => selecionaTipoCalendario(valor)}
              handleSearch={handleSearch}
              value={calendarioSelecionado?.descricao || ''}
              allowClear={false}
            />
          </Loader>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col md={24} xl={12}>
          <Loader loading={carregandoDres} tip="">
            <SelectComponent
              id="dre"
              label="Diretoria Regional de Educação (DRE)"
              lista={listaDres || []}
              valueOption="codigo"
              valueText="nome"
              disabled={!calendarioSelecionado?.id || listaDres?.length === 1}
              onChange={onChangeDre}
              valueSelect={codigoDre || undefined}
              placeholder="Selecione uma DRE"
              showSearch
            />
          </Loader>
        </Col>
        <Col md={24} xl={12}>
          <Loader loading={carregandoUes} tip="">
            <SelectComponent
              id="ue"
              label="Unidade Escolar (UE)"
              lista={listaUes || []}
              valueOption="codigo"
              valueText="nome"
              disabled={!codigoDre || listaUes?.length === 1}
              onChange={onChangeUe}
              valueSelect={codigoUe || undefined}
              placeholder="Selecione uma UE"
              showSearch
            />
          </Loader>
        </Col>
      </Row>
    </Col>
  );
};

export default FechaReabListaFiltros;
