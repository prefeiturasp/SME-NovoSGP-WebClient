import { ROUTES } from '@/core/enum/routes';
import { Col, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Cabecalho } from '~/componentes-sgp';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import Grid from '~/componentes/grid';
import ListaPaginada from '~/componentes/listaPaginada/listaPaginada';
import SelectComponent from '~/componentes/select';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

import { useNavigate } from 'react-router-dom';
import { Busca, CampoTexto, Div } from './tipoEventos.css';

const TipoEventosLista = () => {
  const usuario = useSelector(store => store.usuario);
  const navigate = useNavigate();
  const permissoesTela = usuario.permissoes[ROUTES.TIPO_EVENTOS];

  const [tipoEventoSelecionados, setTipoEventoSelecionados] = useState([]);
  const [filtro, setFiltro] = useState({});

  const clicouBotaoVoltar = () => {
    navigate('/');
  };

  const clicouBotaoExcluir = async () => {
    if (tipoEventoSelecionados && tipoEventoSelecionados.length > 0) {
      const listaNomesExcluir = tipoEventoSelecionados.map(
        tipo => tipo.descricao
      );

      const confirmado = await confirmar(
        'Atenção',
        listaNomesExcluir,
        'Você tem certeza que deseja excluir estes itens?',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const idsDeletar = tipoEventoSelecionados.map(tipo => tipo.id);

        api
          .delete('v1/calendarios/eventos/tipos', {
            data: idsDeletar,
          })
          .then(resposta => {
            if (resposta) sucesso('Tipos de evento deletados com sucesso!');
            setTipoEventoSelecionados([]);
            setFiltro({ ...filtro });
          })
          .catch(e => {
            erros(e);
            setTipoEventoSelecionados([]);
            setFiltro({ ...filtro });
          });
      }
    }
  };

  useEffect(() => {
    verificaSomenteConsulta(permissoesTela);
  }, []);

  const clicouBotaoNovo = () => {
    if (permissoesTela.podeIncluir)
      navigate('/calendario-escolar/tipo-eventos/novo');
  };

  const clicouBotaoEditar = tipoEvento => {
    if (permissoesTela.podeAlterar)
      navigate(`/calendario-escolar/tipo-eventos/editar/${tipoEvento.id}`);
  };

  const listaLetivo = [
    { valor: 1, descricao: 'Sim' },
    { valor: 2, descricao: 'Não' },
    { valor: 3, descricao: 'Opcional' },
  ];

  const listaLocalOcorrencia = [
    { valor: 1, descricao: 'UE' },
    { valor: 2, descricao: 'DRE' },
    { valor: 3, descricao: 'SME' },
    { valor: 4, descricao: 'SME/UE' },
    { valor: 5, descricao: 'Todos' },
  ];

  const colunas = [
    {
      title: 'Tipo de Evento',
      dataIndex: 'descricao',
      className: 'text-left px-4',
    },
    {
      title: 'Local de ocorrência',
      dataIndex: 'localOcorrencia',
      className: 'text-left px-4',
      render: localOcorrencia =>
        listaLocalOcorrencia?.filter?.(l => l?.valor === localOcorrencia)[0]
          ?.descricao,
    },
    {
      title: 'Letivo',
      dataIndex: 'letivo',
      className: 'text-left px-4',
      render: letivo =>
        listaLetivo.filter(l => l.valor === letivo)[0]?.descricao,
    },
  ];

  const campoNomeTipoEventoRef = useRef();

  const [localOcorrenciaSelecionado, setLocalOcorrenciaSelecionado] =
    useState();

  const aoSelecionarLocalOcorrencia = local => {
    setLocalOcorrenciaSelecionado(local);
    setFiltro({ ...filtro, localOcorrencia: local });
  };

  const [letivoSelecionado, setLetivoSelecionado] = useState();

  const aoSelecionarLetivo = letivo => {
    setLetivoSelecionado(letivo);
    setFiltro({ ...filtro, letivo });
  };

  const [nomeTipoEvento, setNomeTipoEvento] = useState('');

  const aoDigitarNomeTipoEvento = () => {
    setNomeTipoEvento(campoNomeTipoEventoRef.current.value);
    setFiltro({ ...filtro, descricao: campoNomeTipoEventoRef.current.value });
  };

  useEffect(() => {
    campoNomeTipoEventoRef.current.focus();
  }, [nomeTipoEvento]);

  const aoSelecionarItems = items => {
    setTipoEventoSelecionados(items);
  };

  return (
    <>
      <Cabecalho pagina="Tipo de eventos">
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <BotaoVoltarPadrao onClick={() => clicouBotaoVoltar()} />
          </Col>
          <Col>
            <BotaoExcluirPadrao
              onClick={clicouBotaoExcluir}
              disabled={
                !permissoesTela.podeExcluir ||
                (tipoEventoSelecionados && tipoEventoSelecionados.length < 1)
              }
            />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_NOVO}
              label="Novo"
              color={Colors.Roxo}
              onClick={clicouBotaoNovo}
              disabled={!permissoesTela.podeIncluir}
              bold
            />
          </Col>
        </Row>
      </Cabecalho>
      <Card>
        <Div className="row mb-3 w-100 mx-auto">
          <Div className="col-4">
            <SelectComponent
              placeholder="Local de ocorrência"
              valueOption="valor"
              valueText="descricao"
              lista={listaLocalOcorrencia}
              valueSelect={localOcorrenciaSelecionado}
              onChange={aoSelecionarLocalOcorrencia}
              className="select-local"
            />
          </Div>
          <Div className="col-3">
            <SelectComponent
              placeholder="Letivo"
              valueOption="valor"
              valueText="descricao"
              lista={listaLetivo}
              valueSelect={letivoSelecionado}
              onChange={aoSelecionarLetivo}
            />
          </Div>
          <Div className="col-5 position-relative">
            <Busca className="fa fa-search fa-lg bg-transparent position-absolute text-center" />
            <CampoTexto
              className="form-control form-control-lg"
              placeholder="Digite o nome do tipo de evento"
              onChange={aoDigitarNomeTipoEvento}
              value={nomeTipoEvento}
              ref={campoNomeTipoEventoRef}
            />
          </Div>
        </Div>
        <Grid cols={12} className="mb-4">
          <ListaPaginada
            url="v1/calendarios/eventos/tipos/listar"
            id="lista-tipo-eventos"
            colunaChave="id"
            colunas={colunas}
            filtro={filtro}
            onClick={clicouBotaoEditar}
            multiSelecao
            selecionarItems={aoSelecionarItems}
          />
        </Grid>
      </Card>
    </>
  );
};

export default TipoEventosLista;
