import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import { Colors, ModalConteudoHtml, SelectComponent } from '~/componentes';

const ModalImpressaoPlano = ({
  key,
  exibirModal,
  modoConsulta,
  setExibirModal,
  imprimirDados,
}) => {
  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);
  const [versaoSelect, setVersaoSelect] = useState();
  const [listaVersao, setListaVersao] = useState([]);

  const setVersaoFunc = () => {
    const valuesSelect = {
      descricao: `v${planoAEEDados?.ultimaVersao?.numero} - ${moment(
        planoAEEDados?.ultimaVersao?.criadoEm
      ).format('DD/MM/YYYY')}`,
      id: planoAEEDados?.ultimaVersao?.id,
    };
    setVersaoSelect(valuesSelect);
    const newValues = planoAEEDados?.versoes?.map(el => {
      return {
        descricao: `v${el.numero} - ${moment(el.criadoEm).format(
          'DD/MM/YYYY'
        )}`,
        id: el.id,
      };
    });
    if (newValues) {
      newValues.unshift(valuesSelect);
    }
    setListaVersao(newValues);
  };

  useEffect(() => {
    setVersaoFunc();
  }, [planoAEEDados]);

  const onChangeVersao = (idValue, values) => {
    const valuesSelect = {
      descricao: values?.props?.title,
      id: idValue,
    };
    setVersaoSelect(valuesSelect);
  };

  const onClickCancelar = () => {
    setExibirModal(false);
  };

  const validaAntesDeFechar = async () => {
    setExibirModal();
  };

  return (
    <ModalConteudoHtml
      id={shortid.generate()}
      key={key}
      visivel={exibirModal}
      titulo="Gerar relatório"
      onClose={validaAntesDeFechar}
      onConfirmacaoPrincipal={() => imprimirDados(versaoSelect.id)}
      onConfirmacaoSecundaria={onClickCancelar}
      labelBotaoPrincipal="Gerar"
      labelBotaoSecundario="Cancelar"
      width="50%"
      closable
      paddingBottom="24"
      colorBotaoSecundario={Colors.Azul}
    >
      <Row gutter={[8, 8]}>
        <Col>
          <p>Selecione a versão que deseja gerar o relatório de impressão:</p>
        </Col>
        <Col span={6}>
          <SelectComponent
            lista={listaVersao}
            valueOption="id"
            valueText="descricao"
            name="versao"
            onChange={onChangeVersao}
            valueSelect={versaoSelect?.descricao}
            disabled={modoConsulta}
          />
        </Col>
      </Row>
    </ModalConteudoHtml>
  );
};

ModalImpressaoPlano.defaultProps = {
  exibirModal: false,
  modoConsulta: false,
  setExibirModal: PropTypes.oneOfType([PropTypes.func]),
  imprimirDados: PropTypes.oneOfType([PropTypes.func]),
};

ModalImpressaoPlano.propTypes = {
  exibirModal: PropTypes.bool,
  key: PropTypes.string.isRequired,
  modoConsulta: PropTypes.bool,
  setExibirModal: () => {},
  imprimirDados: () => {},
};

export default ModalImpressaoPlano;
