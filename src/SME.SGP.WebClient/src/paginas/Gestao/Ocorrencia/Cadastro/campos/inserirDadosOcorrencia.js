import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React, { useState } from 'react';
import {
  Base,
  Button,
  Colors,
  DataTable,
  Label,
  Loader,
  ModalConteudoHtml,
} from '~/componentes';

const InserirDadosOcorrencia = props => {
  const {
    form,
    title,
    labelMain,
    labelSecondary,
    valuesSelect,
    onClickEditarValues,
    desabilitar,
    ehTurmaAnoAnterior,
    somenteConsulta,
    naoPodeIncluirOuAlterar,
  } = props;

  const [exibirLoader, setExibirLoader] = useState(false);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <ModalConteudoHtml
        titulo={`Selecione a(s) criança(s) envolvida(s) nesta ocorrência - ${'getNomeTurma()'}`}
        // visivel={modalCriancasVisivel}
        onClose={() => {
          // setModalCriancasVisivel(false);
        }}
        onConfirmacaoSecundaria={() => {
          // setModalCriancasVisivel(false);
        }}
        onConfirmacaoPrincipal={() => {
          // onConfirmarModal();
        }}
        labelBotaoPrincipal="Confirmar"
        labelBotaoSecundario="Cancelar"
        closable
        width="50%"
        fecharAoClicarFora
        fecharAoClicarEsc
        desabilitarBotaoPrincipal={
          ehTurmaAnoAnterior() || somenteConsulta || naoPodeIncluirOuAlterar()
        }
      >
        <div className="col-md-12 pt-2">
          <DataTable
            id="lista-criancas"
            idLinha="codigoEOL"
            // selectedRowKeys={codigosCriancasSelecionadas}
            // onSelectRow={codigo =>
            //   ehTurmaAnoAnterior() || somenteConsulta
            //     ? {}
            //     : onSelectLinhaAluno(codigo)
            // }
            onClickRow={() => {}}
            // columns={colunas}
            // dataSource={listaCriancas}
            selectMultipleRows
            pagination={false}
            scroll={{ y: 500 }}
          />
        </div>
      </ModalConteudoHtml>
      <Col className="p-0 font-weight-bold">
        <Label text={title} isRequired />
      </Col>
      <Row>
        {valuesSelect.slice(0, 3).map((crianca, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Col className="mb-3" key={`crianca-${index}`}>
              <span>
                {crianca.nome} ({crianca.codigoEOL})
              </span>
              <br />
            </Col>
          );
        })}
      </Row>
      {valuesSelect?.length > 3 ? (
        <div>
          <span style={{ color: Base.CinzaBotao, fontSize: '12px' }}>
            Mais {valuesSelect.length - 3}{' '}
            {valuesSelect.length > 4 ? 'crianças' : 'criança'}
          </span>
        </div>
      ) : (
        ''
      )}

      <Row>
        <Col span={24}>
          <Button
            id="INSERIR_DADOS"
            label={
              ehTurmaAnoAnterior() ||
              somenteConsulta ||
              naoPodeIncluirOuAlterar()
                ? labelSecondary
                : labelMain
            }
            color={Colors.Azul}
            border
            className="mr-2"
            disabled={desabilitar}
            onClick={() => onClickEditarValues()}
            icon="user-edit"
          />
        </Col>
      </Row>
    </Loader>
  );
};

InserirDadosOcorrencia.propTypes = {
  title: PropTypes.string,
  labelMain: PropTypes.string,
  labelSecondary: PropTypes.string,
  somenteConsulta: PropTypes.bool,
  desabilitar: PropTypes.bool,
  naoPodeIncluirOuAlterar: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.object]),
  valuesSelect: PropTypes.oneOfType([PropTypes.array]),
  onClickEditarValues: PropTypes.func,
  ehTurmaAnoAnterior: PropTypes.func,
};

InserirDadosOcorrencia.defaultProps = {
  title: '',
  labelMain: '',
  labelSecondary: '',
  form: null,
  somenteConsulta: false,
  desabilitar: false,
  valuesSelect: [],
  naoPodeIncluirOuAlterar: () => null,
  onClickEditarValues: () => null,
  ehTurmaAnoAnterior: () => null,
};

export default InserirDadosOcorrencia;
