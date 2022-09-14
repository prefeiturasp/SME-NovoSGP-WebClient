import { Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '~/componentes-sgp/filtro/idsCampos';
import { URL_HOME } from '~/constantes';
import { RotasDto } from '~/dtos';
import {
  confirmar,
  erros,
  history,
  ServicoFechamentoReabertura,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import FechaReabListaContext from './fechaReabListaContext';

const FechaReabListaBotoesAcao = () => {
  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.PERIODO_FECHAMENTO_REABERTURA];

  const {
    calendarioSelecionado,
    idsReaberturasSelecionadas,
    setIdsReaberturasSelecionadas,
    setExibirLoaderLista,
    seFiltrarNovaConsulta,
  } = useContext(FechaReabListaContext);

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  useEffect(() => {
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));
  }, [permissoesTela]);

  const onClickVoltar = () => history.push(URL_HOME);

  const onClickExcluir = async () => {
    if (idsReaberturasSelecionadas?.length) {
      const confirmado = await confirmar(
        'Excluir Fechamento(s)',
        '',
        'Você tem certeza que deseja excluir este(s) registros(s)?',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const idsDeletar = idsReaberturasSelecionadas.map(tipo => tipo.id);

        setExibirLoaderLista(true);
        const resposta = await ServicoFechamentoReabertura.deletar(idsDeletar)
          .catch(e => erros(e))
          .finally(() => setExibirLoaderLista(false));

        if (resposta?.status === 200) {
          sucesso(resposta.data);
          setIdsReaberturasSelecionadas([]);
          seFiltrarNovaConsulta(true);
        }
      }
    }
  };

  const onClickNovo = () => {
    history.push(
      `${
        RotasDto.PERIODO_FECHAMENTO_REABERTURA
      }/novo/${calendarioSelecionado?.id || ''}`
    );
  };

  return (
    <Col span={24}>
      <Row gutter={[8, 8]} type="flex">
        <Col>
          <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
        </Col>
        <Col>
          <BotaoExcluirPadrao
            onClick={onClickExcluir}
            disabled={
              !permissoesTela.podeExcluir || !idsReaberturasSelecionadas?.length
            }
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
    </Col>
  );
};

export default FechaReabListaBotoesAcao;
