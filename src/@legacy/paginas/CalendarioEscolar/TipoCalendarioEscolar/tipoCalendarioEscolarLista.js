import { ROUTES } from '@/core/enum/routes';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import DataTable from '~/componentes/table/dataTable';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { URL_HOME } from '~/constantes/url';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

const TipoCalendarioEscolarLista = () => {
  const usuario = useSelector(store => store.usuario);
  const navigate = useNavigate();
  const permissoesTela = usuario.permissoes[ROUTES.TIPO_CALENDARIO_ESCOLAR];

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const [idTiposSelecionados, setIdTiposSelecionados] = useState([]);
  const [listaTiposCalendarioEscolar, setListaTiposCalendarioEscolar] =
    useState([]);

  const colunas = [
    {
      title: 'Nome do tipo de calendário',
      dataIndex: 'nome',
    },
    {
      title: 'Ano',
      dataIndex: 'anoLetivo',
    },
    {
      title: 'Período',
      dataIndex: 'descricaoPeriodo',
    },
  ];

  const onFiltrar = async () => {
    setIdTiposSelecionados([]);
    const tipos = await api.get('v1/calendarios/tipos');
    setListaTiposCalendarioEscolar(tipos.data);
  };

  useEffect(() => {
    onFiltrar();
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));
  }, []);

  const onSelectRow = ids => {
    setIdTiposSelecionados(ids);
  };

  const onClickEditar = id => {
    navigate(`/calendario-escolar/tipo-calendario-escolar/editar/${id}`);
  };

  const onClickRow = row => {
    onClickEditar(row.id);
  };

  const onClickVoltar = () => {
    navigate(URL_HOME);
  };

  const onClickNovo = () => {
    navigate(`/calendario-escolar/tipo-calendario-escolar/novo`);
  };

  const onClickExcluir = async () => {
    const listaParaExcluir = [];
    idTiposSelecionados.forEach(id => {
      const tipoParaExcluir = listaTiposCalendarioEscolar.find(
        tipo => Number(id) === Number(tipo.id)
      );
      if (tipoParaExcluir) {
        listaParaExcluir.push(tipoParaExcluir);
      }
    });

    const listaNomeExcluir = listaParaExcluir.map(item => item.nome);
    const confirmado = await confirmar(
      'Excluir tipo de calendário escolar',
      listaNomeExcluir,
      `Deseja realmente excluir ${
        idTiposSelecionados.length > 1 ? 'estes calendários' : 'este calendário'
      }?`,
      'Excluir',
      'Cancelar'
    );
    if (confirmado) {
      const parametrosDelete = { data: idTiposSelecionados };
      const excluir = await api
        .delete('v1/calendarios/tipos', parametrosDelete)
        .catch(e => erros(e));
      if (excluir) {
        const mensagemSucesso = `${
          idTiposSelecionados.length > 1 ? 'Tipos' : 'Tipo'
        } de calendário excluído com sucesso.`;
        sucesso(mensagemSucesso);
        onFiltrar();
      }
    }
  };

  return (
    <>
      <Cabecalho pagina="Tipo de calendário escolar">
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
          </Col>
          <Col>
            <BotaoExcluirPadrao
              disabled={
                !permissoesTela.podeExcluir ||
                (idTiposSelecionados && idTiposSelecionados.length < 1)
              }
              onClick={onClickExcluir}
            />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_NOVO}
              label="Novo"
              color={Colors.Roxo}
              border
              bold
              onClick={onClickNovo}
              disabled={somenteConsulta || !permissoesTela.podeIncluir}
            />
          </Col>
        </Row>
      </Cabecalho>
      <Card>
        <div className="col-md-12 pt-2">
          <DataTable
            id="lista-tipo-calendario"
            selectedRowKeys={idTiposSelecionados}
            onSelectRow={onSelectRow}
            onClickRow={onClickRow}
            columns={colunas}
            dataSource={listaTiposCalendarioEscolar}
            selectMultipleRows
          />
        </div>
      </Card>
    </>
  );
};

export default TipoCalendarioEscolarLista;
