import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { Cabecalho } from '~/componentes-sgp';
import { Card, ListaPaginada, ButtonGroup, Loader } from '~/componentes';
import RotasDto from '~/dtos/rotasDto';
import AtribuicaoEsporadicaServico from '~/servicos/Paginas/AtribuicaoEsporadica';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import { confirmar, sucesso, erros } from '~/servicos/alertas';

import Filtro from './componentes/Filtro';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { useNavigate } from 'react-router-dom';

function AtribuicaoEsporadicaLista() {
  const navigate = useNavigate();

  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.ATRIBUICAO_ESPORADICA_LISTA];

  const formatarCampoDataGrid = data => {
    let dataFormatada = '';
    if (data) {
      dataFormatada = window.moment(data).format('DD/MM/YYYY');
    }
    return <span>{dataFormatada}</span>;
  };

  const colunas = [
    {
      title: 'Nome',
      dataIndex: 'professorNome',
    },
    {
      title: 'RF',
      dataIndex: 'professorRf',
    },
    {
      title: 'Início',
      dataIndex: 'dataInicio',
      render: data => formatarCampoDataGrid(data),
    },
    {
      title: 'Fim',
      dataIndex: 'dataFim',
      render: data => formatarCampoDataGrid(data),
    },
  ];

  const onClickVoltar = () => navigate('/');

  const onClickBotaoPrincipal = () => {
    navigate(`atribuicao-esporadica/novo`);
  };

  const onSelecionarItems = items => {
    setItensSelecionados(items);
  };

  const onClickExcluir = async () => {
    if (itensSelecionados && itensSelecionados.length > 0) {
      const listaNomeExcluir = itensSelecionados.map(
        item => item.professorNome
      );
      const confirmado = await confirmar(
        'Excluir atribuição',
        listaNomeExcluir,
        `Deseja realmente excluir ${
          itensSelecionados.length > 1 ? 'estes itens' : 'este item'
        }?`,
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        await Promise.all(
          itensSelecionados.map(x =>
            AtribuicaoEsporadicaServico.deletarAtribuicaoEsporadica(x.id)
              .then(() => {
                const mensagemSucesso = `${
                  itensSelecionados.length > 1
                    ? 'Atribuições excluídas'
                    : 'Atribuição excluída'
                } com sucesso.`;
                sucesso(mensagemSucesso);
                setFiltro({
                  ...filtro,
                  atualizar: !filtro.atualizar || true,
                });
                setItensSelecionados([]);
              })
              .catch(e => erros(e))
          )
        );
      }
    }
  };

  const onClickEditar = item => {
    navigate(`/gestao/atribuicao-esporadica/editar/${item.id}`);
  };

  const onChangeFiltro = useCallback(valoresFiltro => {
    setFiltro({
      AnoLetivo: valoresFiltro.anoLetivo,
      DreId: valoresFiltro.dreId,
      UeId: valoresFiltro.ueId,
      ProfessorRF: valoresFiltro.professorRf,
    });
  }, []);

  const validarFiltro = () => {
    return !!filtro.DreId && !!filtro.UeId;
  };

  useEffect(() => {
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));
  }, [permissoesTela]);

  return (
    <>
      <Loader loading={false}>
        <Cabecalho pagina="Atribuição esporádica">
          <ButtonGroup
            somenteConsulta={somenteConsulta}
            permissoesTela={permissoesTela}
            temItemSelecionado={
              itensSelecionados && itensSelecionados.length >= 1
            }
            onClickVoltar={onClickVoltar}
            onClickExcluir={onClickExcluir}
            onClickBotaoPrincipal={onClickBotaoPrincipal}
            labelBotaoPrincipal="Novo"
            idBotaoPrincipal={SGP_BUTTON_NOVO}
          />
        </Cabecalho>
        <Card>
          <div className="col-md-12">
            <Filtro onFiltrar={onChangeFiltro} />
            <ListaPaginada
              url="v1/atribuicao/esporadica/listar"
              id="lista-atribuicoes-esporadica"
              colunaChave="id"
              colunas={colunas}
              filtro={filtro}
              onClick={onClickEditar}
              multiSelecao
              selecionarItems={onSelecionarItems}
              filtroEhValido={validarFiltro()}
            />
          </div>
        </Card>
      </Loader>
    </>
  );
}

export default AtribuicaoEsporadicaLista;
