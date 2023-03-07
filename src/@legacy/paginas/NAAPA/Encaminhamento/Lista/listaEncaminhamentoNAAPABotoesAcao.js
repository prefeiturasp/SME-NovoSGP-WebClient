/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React ,{useState}from 'react';
import { Button, Colors,Loader } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO } from '~/constantes';
import { URL_HOME } from '~/constantes';
import { RotasDto } from '~/dtos';
import { history } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import {
  SGP_BUTTON_IMPRIMIR,
} from '~/constantes/ids/button';
import {
  sucesso,
  erros,
} from '~/servicos';

const ListaEncaminhamentoNAAPABotoesAcao = props => {
  const { somenteConsulta, podeIncluir,idsSelecionados } = props;

  const desabilitarNovo = somenteConsulta || !podeIncluir;
  const [exibirLoader, setExibirLoader] = useState(false);
  const onClickVoltar = () => history.push(URL_HOME);

  const onClickImpressao = async () => {
    setExibirLoader(true)
    await ServicoNAAPA.imprimir(
      idsSelecionados
    )
      .catch(e => erros(e))
      .finally(()=> setExibirLoader(false));

      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
    
  };
  
  const onClickNovo = () =>
    history.push(`${RotasDto.ENCAMINHAMENTO_NAAPA}/novo`);

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
      <Loader loading={exibirLoader}>
        <Button
          bold
          border
          icon='print'
          color={Colors.Azul}
          id={SGP_BUTTON_IMPRIMIR}
          onClick={onClickImpressao}
          disabled={idsSelecionados?.length === 0}
        />
        </Loader>
      </Col>
      <Col>
        <Button
          bold
          border
          label="Novo"
          color={Colors.Roxo}
          id={SGP_BUTTON_NOVO}
          onClick={onClickNovo}
          disabled={desabilitarNovo}
        />
      </Col>
    </Row>
  );
};

export default ListaEncaminhamentoNAAPABotoesAcao;
