import { Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import { URL_HOME } from '~/constantes';
import { RotasDto } from '~/dtos';
import { setFiltroListaEventos } from '~/redux/modulos/calendarioEscolar/actions';
import {
  confirmar,
  erros,
  history,
  ServicoEvento,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import EventosListaContext from './eventosListaContext';

const EventosListaBotoesAcao = () => {
  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[RotasDto.EVENTOS];

  const dispatch = useDispatch();

  const {
    eventosSelecionados,
    calendarioSelecionado,
    setEventosSelecionados,
    seFiltrarNovaConsulta,
    codigoDre,
    codigoUe,
  } = useContext(EventosListaContext);

  const [podeAlterarExcluir, setPodeAlterarExcluir] = useState(false);
  const [somenteConsulta, setSomenteConsulta] = useState(false);

  useEffect(() => {
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));
  }, [permissoesTela]);

  const onClickVoltar = () => history.push(URL_HOME);

  useEffect(() => {
    if (eventosSelecionados?.length) {
      setPodeAlterarExcluir(
        eventosSelecionados.filter(
          item =>
            usuario.possuiPerfilSme ||
            (usuario.possuiPerfilDre && item.dreId && item.ueId) ||
            item.criadoRF === usuario.rf
        ).length
      );
    }
  }, [eventosSelecionados, usuario]);

  const onClickExcluir = async () => {
    if (eventosSelecionados?.length > 0) {
      const listaNomeExcluir = eventosSelecionados.map(item => item.nome);
      const confirmado = await confirmar(
        'Excluir evento',
        listaNomeExcluir,
        `Deseja realmente excluir ${
          eventosSelecionados.length > 1 ? 'estes eventos' : 'este evento'
        }?`,
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const idsDeletar = eventosSelecionados.map(c => c.id);
        const resposta = await ServicoEvento.deletar(idsDeletar).catch(e =>
          erros(e)
        );
        if (resposta?.status === 200) {
          const mensagemSucesso = `${
            eventosSelecionados.length > 1
              ? 'Eventos excluídos'
              : 'Evento excluído'
          } com sucesso.`;
          sucesso(mensagemSucesso);
          setEventosSelecionados([]);
          seFiltrarNovaConsulta(true);
        }
      }
    }
  };

  const salvarFiltros = () => {
    dispatch(
      setFiltroListaEventos({
        calendarioSelecionado,
        codigoDre,
        codigoUe,
        eventoCalendarioId: true,
      })
    );
  };

  const onClickNovo = () => {
    salvarFiltros();
    history.push(`${RotasDto.EVENTOS}/novo/${calendarioSelecionado?.id}`);
  };

  return (
    <Col span={24}>
      <Row gutter={[16, 16]} style={{ justifyContent: 'end', display: 'flex' }}>
        <Col>
          <Button
            id="btn-voltar"
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            onClick={onClickVoltar}
          />
        </Col>
        <Col>
          <Button
            id="btn-excluir"
            label="Excluir"
            color={Colors.Vermelho}
            border
            onClick={onClickExcluir}
            disabled={
              !permissoesTela.podeExcluir ||
              !calendarioSelecionado?.id ||
              eventosSelecionados?.length < 1 ||
              !podeAlterarExcluir
            }
          />
        </Col>
        <Col>
          <Button
            id="btn-novo"
            label="Novo"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickNovo}
            disabled={
              somenteConsulta ||
              !permissoesTela.podeIncluir ||
              !calendarioSelecionado?.id
            }
          />
        </Col>
      </Row>
    </Col>
  );
};

export default EventosListaBotoesAcao;
