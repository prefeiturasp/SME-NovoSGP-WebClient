import { Button, Colors, Label, Loader } from '@/@legacy/componentes';
import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import QuestionarioDinamico from '@/@legacy/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { SGP_BUTTON_FILTRO_AVANCADO } from '@/@legacy/constantes/ids/button';
import { SGP_SECAO } from '@/@legacy/constantes/ids/questionario-dinamico';
import { setLimparDadosQuestionarioDinamico } from '@/@legacy/redux/modulos/questionarioDinamico/actions';
import { erros } from '@/@legacy/servicos';
import ServicoRelatorioDinamicoNAAPA from '@/@legacy/servicos/Paginas/Gestao/NAAPA/ServicoRelatorioDinamicoNAAPA';
import { store } from '@/core/redux';
import { Col, Row } from 'antd';
import { HttpStatusCode } from 'axios';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

const RelatorioDinamicoNAAPAFormDinamico = props => {
  const { form, onChangeCampos, dadosQuestionario } = props;

  const modalidade = form.values?.modalidade;

  const [dataSource, setDataSource] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [exibirCamposFiltroAvancado, setExibirCamposFiltroAvancado] =
    useState(false);

  const obterQuestoes = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await ServicoRelatorioDinamicoNAAPA.obterQuestoes(
      modalidade
    ).catch(e => erros(e));

    if (resposta?.status === HttpStatusCode.Ok) {
      setDataSource(resposta.data);
    } else {
      setDataSource([]);
    }

    setExibirLoader(false);
  }, [modalidade]);

  useEffect(() => {
    if (modalidade) {
      obterQuestoes();
    } else {
      setDataSource([]);
    }
  }, [modalidade, obterQuestoes]);

  useEffect(() => {
    return () => {
      store.dispatch(setLimparDadosQuestionarioDinamico());
    };
  }, []);

  return (
    <Row gutter={[0, 24]}>
      <Col>
        <Button
          id={SGP_BUTTON_FILTRO_AVANCADO}
          label="Filtro Avançado"
          icon="filter"
          color={Colors.Azul}
          onClick={() => {
            setExibirCamposFiltroAvancado(!exibirCamposFiltroAvancado);
          }}
          border
          disabled={!modalidade}
        />
      </Col>

      {exibirCamposFiltroAvancado ? (
        <Col xs={24}>
          <Loader loading={exibirLoader}>
            <Row gutter={[0, 24]}>
              <Col xs={24}>
                <Label text="Filtros avançados" altura="24" tamanhoFonte="18" />
              </Col>
              <Col xs={24}>
                <QuestionarioDinamico
                  dados={{ questionarioId: 1, id: 1 }}
                  exibirOrdemLabel={false}
                  urlUpload="v1/encaminhamento-naapa/upload"
                  dadosQuestionarioAtual={dataSource}
                  prefixId={`${SGP_SECAO}_RELATORIO_DINAMICO_NAAPA`}
                  onChangeQuestionario={() => {
                    QuestionarioDinamicoFuncoes.guardarSecaoEmEdicao(
                      dadosQuestionario?.id
                    );
                    onChangeCampos();
                  }}
                />
              </Col>
            </Row>
          </Loader>
        </Col>
      ) : (
        <></>
      )}
    </Row>
  );
};

RelatorioDinamicoNAAPAFormDinamico.propTypes = {
  onChangeCampos: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioDinamicoNAAPAFormDinamico.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default RelatorioDinamicoNAAPAFormDinamico;
