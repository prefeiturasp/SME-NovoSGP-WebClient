import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import {
  Button,
  Colors,
  Loader,
  ModalConteudoHtml,
  SelectComponent,
} from '~/componentes';
import { erros, sucesso } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO } from '~/constantes';
import { SGP_BUTTON_IMPRIMIR } from '~/componentes-sgp/filtro/idsCampos';

const ModalImpressaoPlano = () => {
  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);
  const [versaoSelecionada, setVersaoSelecionada] = useState();

  const [listaVersao, setListaVersao] = useState([]);

  const [exibirModal, setExibirModal] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);

  useEffect(() => {
    if (exibirModal) {
      const ultimaVersao = {
        descricao: `v${planoAEEDados?.ultimaVersao?.numero} - ${moment(
          planoAEEDados?.ultimaVersao?.criadoEm
        ).format('DD/MM/YYYY')}`,
        id: planoAEEDados?.ultimaVersao?.id,
      };

      const newValues = planoAEEDados?.versoes?.map(el => {
        return {
          descricao: `v${el.numero} - ${moment(el.criadoEm).format(
            'DD/MM/YYYY'
          )}`,
          id: el.id,
        };
      });

      newValues.unshift(ultimaVersao);

      setListaVersao(newValues);
      setVersaoSelecionada(planoAEEDados?.ultimaVersao?.id?.toString());
    }
  }, [planoAEEDados, exibirModal]);

  const onClose = () => setExibirModal(false);

  const imprimirDados = async id => {
    const isAtual = id || versaoSelecionada;
    if (isAtual) {
      setExibirLoader(true);
      setExibirModal(false);

      const resultado = await ServicoPlanoAEE.imprimirVersoes([isAtual])
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (resultado?.status === 200) {
        sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
      }
    }
  };

  const onClickImpressao = () => {
    if (planoAEEDados?.versoes?.length) {
      setExibirModal(true);
    } else {
      imprimirDados(planoAEEDados?.ultimaVersao?.id?.toString());
    }
  };

  return (
    <>
      <Loader loading={exibirLoader} tip="">
        <Button
          icon="print"
          className="mr-2"
          color={Colors.Azul}
          onClick={onClickImpressao}
          border
          semMargemDireita
          id={SGP_BUTTON_IMPRIMIR}
          disabled={
            planoAEEDados?.versoes?.length === 0 && !planoAEEDados?.ultimaVersao
          }
        />
      </Loader>
      {exibirModal && (
        <ModalConteudoHtml
          id="SGP_MODAL_IMPRESSAO_VERSAO"
          key="MODAL_IMPRESSAO_VERSAO"
          visivel
          titulo="Gerar relatório"
          onClose={() => onClose()}
          onConfirmacaoPrincipal={() => imprimirDados()}
          onConfirmacaoSecundaria={() => onClose()}
          labelBotaoPrincipal="Gerar"
          labelBotaoSecundario="Cancelar"
          closable
          paddingBottom="24"
          colorBotaoSecundario={Colors.Azul}
        >
          <Row>
            <Col span={24}>
              <SelectComponent
                label="Selecione a versão que deseja gerar o relatório de impressão"
                id="SGP_SELECT_VERSAO_IMPRESSAO"
                lista={listaVersao}
                valueOption="id"
                valueText="descricao"
                onChange={v => setVersaoSelecionada(v)}
                valueSelect={versaoSelecionada}
                allowClear={false}
              />
            </Col>
          </Row>
        </ModalConteudoHtml>
      )}
    </>
  );
};

export default ModalImpressaoPlano;
