import Select from '@/components/lib/inputs/select';
import Modal from '@/components/lib/modal';
import { Row } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState } from 'react';
import { Button, Colors, Loader } from '~/componentes';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO } from '~/constantes';
import {
  SGP_BUTTON_CANCELAR_MODAL,
  SGP_BUTTON_IMPRIMIR,
  SGP_BUTTON_OK_MODAL,
} from '~/constantes/ids/button';
import { SGP_SELECT_IMPRIMIR_ANEXO_NAAPA } from '~/constantes/ids/select';
import { erros, sucesso } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

const BtnImpressaoEncaminhamentoNAAPA = props => {
  const { idsSelecionados } = props;

  const [exibirLoader, setExibirLoader] = useState(false);
  const [options, setOptions] = useState([]);
  const [abrirModalImpressao, setAbrirModalImpressao] = useState(false);
  const [imprimirAnexosNAAPAState, setImprimirAnexosNAAPAState] = useState();

  const onClickImpressao = async () => {
    setExibirLoader(true);

    const resultado = await ServicoNAAPA.imprimir(
      idsSelecionados,
      imprimirAnexosNAAPAState
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resultado?.status === HttpStatusCode.Ok) {
      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
      setAbrirModalImpressao(false);
    }
  };

  const obterTipos = async () => {
    setExibirLoader(true);

    const encaminhamentoId = idsSelecionados[0];
    const resultado = await ServicoNAAPA.obterTiposImpressaoAnexos(
      encaminhamentoId
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resultado?.status === HttpStatusCode.Ok) {
      if (resultado?.data?.length > 1) {
        const list = resultado.data.map(item => ({
          value: item?.id,
          label: item?.descricao,
        }));

        setOptions(list);
        setAbrirModalImpressao(true);
      } else {
        onClickImpressao();
      }
    }
  };

  const onClickValidarImpressao = async () => {
    if (idsSelecionados?.length === 1) {
      obterTipos();
    } else {
      onClickImpressao();
    }
  };

  return (
    <Loader loading={exibirLoader} tip="">
      <Button
        icon="print"
        color={Colors.Azul}
        onClick={onClickValidarImpressao}
        border
        semMargemDireita
        id={SGP_BUTTON_IMPRIMIR}
        disabled={idsSelecionados?.length === 0}
      />
      <Modal
        centered
        width="25%"
        destroyOnClose
        okText="Imprimir"
        cancelText="Fechar"
        onOk={onClickImpressao}
        closable={!exibirLoader}
        keyboard={!exibirLoader}
        open={abrirModalImpressao}
        maskClosable={!exibirLoader}
        title=" Deseja imprimir os anexos em PDF do cadastro do encaminhamento e/ou
          dos atendimento?"
        okButtonProps={{
          disabled: exibirLoader || !imprimirAnexosNAAPAState,
          id: SGP_BUTTON_OK_MODAL,
        }}
        cancelButtonProps={{
          disabled: exibirLoader,
          id: SGP_BUTTON_CANCELAR_MODAL,
        }}
        onCancel={e => {
          e.stopPropagation();
          setAbrirModalImpressao(false);
        }}
      >
        <Loader loading={exibirLoader} tip="">
          <Row style={{ marginTop: 20 }}>
            <Select
              showSearch
              allowClear
              options={options}
              onChange={setImprimirAnexosNAAPAState}
              placeholder="Tipo de impressão"
              value={imprimirAnexosNAAPAState}
              id={SGP_SELECT_IMPRIMIR_ANEXO_NAAPA}
            />
          </Row>
        </Loader>
      </Modal>
    </Loader>
  );
};

export default BtnImpressaoEncaminhamentoNAAPA;
