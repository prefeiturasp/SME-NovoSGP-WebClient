import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import shortid from 'shortid';
import { Colors, DataTable, ModalConteudoHtml } from '~/componentes';
import {
  SGP_BUTTON_SALVAR_MODAL,
  SGP_BUTTON_VOLTAR_MODAL,
} from '~/componentes-sgp/filtro/idsCampos';
import Button from '~/componentes/button';
import { confirmar } from '~/servicos';

const ModalObjetivosAprendizagem = props => {
  const {
    exibirModal,
    onClose,
    listaObjetivosAprendizagem,
    idsObjetivosAprendizagemSelecionados,
  } = props;

  const [idsSelecionados, setIdsSelecionados] = useState(
    idsObjetivosAprendizagemSelecionados
  );
  const [emEdicao, setEmEdicao] = useState(false);
  const [emAcaoConfirmar, setEmAcaoConfirmar] = useState(false);

  const validouAntesDeFechar = async () => {
    if (emEdicao) {
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
    onClose(idsSelecionados, aplicarDados);
  };

  const onCloseModal = async () => {
    const aplicarDados = await validouAntesDeFechar();
    if (aplicarDados) {
      onClickSalvarModal(aplicarDados);
    } else {
      onClose([]);
    }

    setEmEdicao(false);
  };

  const onSelectRow = ids => {
    setIdsSelecionados(ids);
    setEmEdicao(true);
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
          <DataTable
            id={shortid.generate()}
            onSelectRow={onSelectRow}
            columns={columns}
            dataSource={listaObjetivosAprendizagem}
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
};

ModalObjetivosAprendizagem.defaultProps = {
  exibirModal: false,
  onClose: () => null,
  listaObjetivosAprendizagem: [],
  idsObjetivosAprendizagemSelecionados: [],
};

export default ModalObjetivosAprendizagem;
