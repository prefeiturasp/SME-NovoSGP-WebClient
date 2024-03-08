import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import shortid from 'shortid';
import {
  CampoTexto,
  Colors,
  DataTable,
  ModalConteudoHtml,
} from '~/componentes';
import {
  SGP_BUTTON_SALVAR_MODAL,
  SGP_BUTTON_VOLTAR_MODAL,
} from '~/constantes/ids/button';
import Button from '~/componentes/button';
import { confirmar } from '~/servicos';

const ModalObjetivosAprendizagem = props => {
  const {
    exibirModal,
    onClose,
    listaObjetivosAprendizagem,
    idsObjetivosAprendizagemSelecionados,
    desabilitar,
  } = props;

  const [idsSelecionados, setIdsSelecionados] = useState(
    idsObjetivosAprendizagemSelecionados
  );
  const [emEdicao, setEmEdicao] = useState(false);
  const [emAcaoConfirmar, setEmAcaoConfirmar] = useState(false);
  const [valorParaFiltrar, setValorParaFiltrar] = useState('');

  const validouAntesDeFechar = async () => {
    if (!desabilitar && emEdicao) {
      setEmAcaoConfirmar(true);
      const confirmou = await confirmar(
        'Atenção',
        'Suas alterações não foram aplicadas, deseja aplicar agora?'
      );
      setEmAcaoConfirmar(false);
      if (confirmou) {
        return true;
      }
    }
    return false;
  };

  const onClickSalvarModal = aplicarDados => {
    if (!desabilitar) {
      onClose(idsSelecionados, aplicarDados);
    }
  };

  const onCloseModal = async () => {
    const aplicarDados = await validouAntesDeFechar();
    if (!desabilitar && aplicarDados) {
      onClickSalvarModal(aplicarDados);
    } else {
      onClose([]);
    }

    setEmEdicao(false);
  };

  const onSelectRow = ids => {
    if (!desabilitar) {
      if (!idsSelecionados.length) {
        setIdsSelecionados(ids);
      } else {
        setIdsSelecionados(prevIds => [...(prevIds || []), ...ids]);
      }
      setEmEdicao(true);
    }
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
    },
  ];

  const onChangeFiltro = e => {
    const valor = e.target.value;
    setValorParaFiltrar(valor);
  };

  const montarLista = () => {
    if (valorParaFiltrar) {
      const listaNova = listaObjetivosAprendizagem?.filter?.(objetivo => {
        const dadosFiltrados = [objetivo?.codigo, objetivo?.descricao]
          .toString()
          ?.toLowerCase()
          ?.includes?.(valorParaFiltrar?.toLowerCase());

        return dadosFiltrados;
      });

      return listaNova;
    }

    return listaObjetivosAprendizagem;
  };

  return exibirModal ? (
    <ModalConteudoHtml
      id={shortid.generate()}
      key="inserir-objetivos"
      visivel={exibirModal && !emAcaoConfirmar}
      titulo="Objetivos de Aprendizagem"
      onClose={onCloseModal}
      esconderBotaoPrincipal
      esconderBotaoSecundario
      width={750}
      closable
    >
      <Row gutter={[16, 16]}>
        <Col>
          <CampoTexto
            placeholder="Informe o código ou o descrição do objetivo desejado"
            onChange={onChangeFiltro}
            value={valorParaFiltrar}
            type="input"
            icon
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col>
          <DataTable
            id={shortid.generate()}
            onSelectRow={onSelectRow}
            columns={columns}
            dataSource={montarLista()}
            pagination={false}
            selectedRowKeys={idsSelecionados}
            selectMultipleRows
            tableResponsive={false}
            scroll={{ y: 240 }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} type="flex" justify="end">
        <Col>
          <Button
            id={SGP_BUTTON_VOLTAR_MODAL}
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            onClick={onCloseModal}
          />
        </Col>
        <Col>
          <Button
            id={SGP_BUTTON_SALVAR_MODAL}
            label="Aplicar"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickSalvarModal}
            disabled={desabilitar || !idsSelecionados.length}
          />
        </Col>
      </Row>
    </ModalConteudoHtml>
  ) : (
    <></>
  );
};

ModalObjetivosAprendizagem.propTypes = {
  exibirModal: PropTypes.bool,
  onClose: PropTypes.func,
  listaObjetivosAprendizagem: PropTypes.oneOfType([PropTypes.array]),
  idsObjetivosAprendizagemSelecionados: PropTypes.oneOfType([PropTypes.array]),
  desabilitar: PropTypes.bool,
};

ModalObjetivosAprendizagem.defaultProps = {
  exibirModal: false,
  onClose: () => null,
  listaObjetivosAprendizagem: [],
  idsObjetivosAprendizagemSelecionados: [],
  desabilitar: false,
};

export default ModalObjetivosAprendizagem;
