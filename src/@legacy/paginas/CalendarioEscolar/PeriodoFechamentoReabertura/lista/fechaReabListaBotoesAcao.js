import { Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { URL_HOME } from '~/constantes';
import { RotasDto } from '~/dtos';
import {
  confirmar,
  erros,
  ServicoFechamentoReabertura,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import FechaReabListaContext from './fechaReabListaContext';
import { useNavigate } from 'react-router-dom';

const FechaReabListaBotoesAcao = () => {
  const usuario = useSelector(store => store.usuario);
  const navigate = useNavigate();

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

  const onClickVoltar = () => navigate(URL_HOME);

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
    navigate(
      `${RotasDto.PERIODO_FECHAMENTO_REABERTURA}/novo/${
        calendarioSelecionado?.id || ''
      }`
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
