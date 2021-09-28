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

  // const params = useParams();
  // console.log(params);

  useEffect(() => {
    if (eventosSelecionados?.length) {
      setPodeAlterarExcluir(
        eventosSelecionados.filter(
          item =>
            usuario.possuiPerfilSme === true ||
            (usuario.possuiPerfilDre === true && item.dreId && item.ueId) ||
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
    <div className="col-md-12 d-flex justify-content-end pb-4">
      <div className="row">
        <Button
          id="btn-voltar"
          label="Voltar"
          icon="arrow-left"
          color={Colors.Azul}
          border
          className="mr-3"
          onClick={onClickVoltar}
        />
        <Button
          id="btn-excluir"
          label="Excluir"
          color={Colors.Vermelho}
          border
          className="mr-3"
          onClick={onClickExcluir}
          disabled={
            !permissoesTela.podeExcluir ||
            !calendarioSelecionado?.id ||
            eventosSelecionados?.length < 1 ||
            !podeAlterarExcluir
          }
        />
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
      </div>
    </div>
  );
};

export default EventosListaBotoesAcao;
