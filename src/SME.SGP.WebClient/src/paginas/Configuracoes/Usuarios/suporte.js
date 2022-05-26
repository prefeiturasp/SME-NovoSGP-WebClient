import React, { useEffect, useState, useMemo, useCallback } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { Loader } from '~/componentes';
import Button from '~/componentes/button';
import CampoTexto from '~/componentes/campoTexto';
import { Colors } from '~/componentes/colors';
import SelectComponent from '~/componentes/select';
import DataTable from '~/componentes/table/dataTable';
import api from '~/servicos/api';
import { store } from '~/redux';
import RotasDto from '~/dtos/rotasDto';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

import FiltroHelper from '~/componentes-sgp/filtro/helper';

export default function Suporte({ perfilSelecionado }) {
  const [listaUsuario, setListaUsuario] = useState([]);

  const [listaDres, setListaDres] = useState([]);
  const [dreSelecionada, setDreSelecionada] = useState('');
  const [listaUes, setListaUes] = useState([]);
  const [ueSelecionada, setUeSelecionada] = useState('');
  const [nomeUsuarioSelecionado, setNomeUsuarioSelecionado] = useState('');
  const [rfSelecionado, setRfSelecionado] = useState('');

  const [dreDesabilitada, setDreDesabilitada] = useState(false);
  const [ueDesabilitada, setUeDesabilitada] = useState(false);

  const [carregando, setCarregando] = useState(false);

  const { usuario } = store.getState();
  const anoLetivo = useMemo(
    () =>
      (usuario.turmaSelecionada && usuario.turmaSelecionada.anoLetivo) ||
      moment().year(),
    [usuario.turmaSelecionada]
  );

  const consideraHistorico = useMemo(
    () =>
      (usuario.turmaSelecionada &&
        !!usuario.turmaSelecionada.consideraHistorico) ||
      false,
    [usuario.turmaSelecionada]
  );

  const permissoesTela = usuario.permissoes[RotasDto.REINICIAR_SENHA];

  const [validacoes] = useState(
    Yup.object({
      emailUsuario: Yup.string()
        .email('Digite um e-mail válido.')
        .required('E-mail é obrigatório'),
    })
  );

  const colunas = [
    {
      title: 'Nome do usuário',
      dataIndex: 'nomeServidor',
    },
    {
      title: 'Registro Funcional (RF)',
      dataIndex: 'codigoRf',
    },
    {
      title: 'Ação',
      dataIndex: 'acaoReiniciar',
      render: (texto, linha) => {
        return (
          <div className="botao-reiniciar-tabela-acao">
            <Button
              label="Acessar"
              color={Colors.Roxo}
              disabled={!permissoesTela.podeAlterar}
              border
              className="ml-2 text-center"
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const carregarDres = async () => {
      const dres = await api.get(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
      );
      if (dres.data) {
        setListaDres(dres.data.sort(FiltroHelper.ordenarLista('nome')));
      } else {
        setListaDres([]);
      }
    };

    carregarDres();
    verificaSomenteConsulta(permissoesTela);
  }, [anoLetivo, consideraHistorico, permissoesTela]);

  useEffect(() => {
    let desabilitada = !listaDres || listaDres.length === 0;

    if (!desabilitada && listaDres.length === 1) {
      setDreSelecionada(String(listaDres[0].codigo));
      desabilitada = true;
    }

    setDreDesabilitada(desabilitada);
  }, [listaDres]);

  useEffect(() => {
    let desabilitada = !listaUes || listaUes.length === 0;

    if (!desabilitada && listaUes.length === 1) {
      setUeSelecionada(String(listaUes[0].codigo));
      desabilitada = true;
    }

    setUeDesabilitada(desabilitada);
  }, [listaUes]);

  const onChangeDre = dre => {
    setDreSelecionada(!dre ? '' : dre);
    setUeSelecionada('');
    setListaUes([]);
  };

  const onChangeUe = ue => {
    setUeSelecionada(ue);
  };

  const onChangeNomeUsuario = nomeUsuario => {
    setNomeUsuarioSelecionado(nomeUsuario.target.value);
  };

  const onChangeRf = rf => {
    setRfSelecionado(rf.target.value);
  };

  const carregarUes = useCallback(
    async dre => {
      const ues = await api.get(
        `/v1/abrangencias/${consideraHistorico}/dres/${dre}/ues?consideraNovasUEs=${true}`
      );
      if (ues.data) {
        setListaUes(ues.data);
      } else {
        setListaUes([]);
      }
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (dreSelecionada) {
      carregarUes(dreSelecionada);
    }
  }, [carregarUes, dreSelecionada]);

  const onClickFiltrar = async () => {
    if (dreSelecionada) {
      setCarregando(true);
      const parametrosPost = {
        codigoDRE: dreSelecionada,
        nomeServidor: nomeUsuarioSelecionado,
        codigoRF: rfSelecionado,
      };

      if (ueSelecionada && ueSelecionada.length > 0)
        parametrosPost.codigoUE = ueSelecionada;

      const lista = await api
        .post(`v1/unidades-escolares/funcionarios`, parametrosPost)
        .catch(() => {
          setListaUsuario([]);
        })
        .finally(() => setCarregando(false));

      if (lista && lista.data) {
        setListaUsuario([]);
        setListaUsuario(lista.data);
      } else {
        setListaUsuario([]);
      }
    } else {
      setListaUsuario([]);
    }
  };

  return (
    <Loader loading={carregando}>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 pb-2">
          <SelectComponent
            name="dre-suport"
            id="dre-suport"
            lista={listaDres}
            disabled={!permissoesTela.podeConsultar || dreDesabilitada}
            valueOption="codigo"
            valueText="nome"
            onChange={onChangeDre}
            valueSelect={String(dreSelecionada) || ''}
            label="Diretoria Regional de Educação (DRE)"
            placeholder="Diretoria Regional de Educação (DRE)"
            showSearch
          />
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 pb-2">
          <SelectComponent
            name="ues-list"
            id="ues-list"
            lista={listaUes}
            disabled={!permissoesTela.podeConsultar || ueDesabilitada}
            valueOption="codigo"
            valueText="nome"
            onChange={onChangeUe}
            valueSelect={ueSelecionada || ''}
            label="Unidade Escolar (UE)"
            placeholder="Unidade Escolar (UE)"
            showSearch
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 pb-3">
          <CampoTexto
            label="Nome do usuário"
            placeholder="Nome do usuário"
            onChange={onChangeNomeUsuario}
            desabilitado={!permissoesTela.podeConsultar}
            value={nomeUsuarioSelecionado}
          />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-5 pb-3">
          <CampoTexto
            label="Registro Funcional (RF)"
            placeholder="Registro Funcional (RF)"
            onChange={onChangeRf}
            desabilitado={!permissoesTela.podeConsultar}
            value={rfSelecionado}
          />
        </div>
        <div className="col-sm-12 col-md-12 col-lg-2 col-xl-1 pb-3">
          <Button
            label="Filtrar"
            color={Colors.Azul}
            disabled={perfilSelecionado || !dreSelecionada}
            border
            className="text-center d-block mt-4 float-right w-100"
            onClick={onClickFiltrar}
          />
        </div>
      </div>

      {listaUsuario.length > 0 && (
        <div className="row">
          <div className="col-md-12 pt-4">
            <DataTable
              rowKey="codigoRf"
              columns={colunas}
              dataSource={listaUsuario}
            />
          </div>
        </div>
      )}
    </Loader>
  );
}
