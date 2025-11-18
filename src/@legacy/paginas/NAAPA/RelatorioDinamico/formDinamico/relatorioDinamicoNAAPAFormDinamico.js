import { Button, Colors, Label, Loader } from '@/@legacy/componentes';
import { SGP_BUTTON_FILTRO_AVANCADO } from '@/@legacy/constantes/ids/button';
import { setLimparDadosQuestionarioDinamico } from '@/@legacy/redux/modulos/questionarioDinamico/actions';
import { erros } from '@/@legacy/servicos';
import ServicoRelatorioDinamicoNAAPA from '@/@legacy/servicos/Paginas/Gestao/NAAPA/ServicoRelatorioDinamicoNAAPA';
import { store } from '@/core/redux';
import { Col, Row } from 'antd';
import { HttpStatusCode } from 'axios';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { OPCAO_TODOS } from '~/constantes';
import RelatorioDinamicoNAAPAContext from '../relatorioDinamicoNAAPAContext';
import CollapseRelatorioDinamicoNAAPAFormDinamico from './collapseFormDinamico';
import RelatorioDinamicoNAAPALista from './relatorioDinamicoNAAPALista';

const RelatorioDinamicoNAAPAFormDinamico = props => {
  const { setListaSecoesParaDesabilitar } = useContext(
    RelatorioDinamicoNAAPAContext
  );

  const { form } = props;

  const modalidade = form.values?.modalidade;

  const [dadosSecoes, setDadosSecoes] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [exibirCamposFiltroAvancado, setExibirCamposFiltroAvancado] =
    useState(false);

  const obterQuestoes = useCallback(async () => {
    setExibirLoader(true);

    const todosEmModalidade = modalidade?.find(
      item => String(item) === OPCAO_TODOS
    );

    const modalidadesId = todosEmModalidade ? [] : modalidade;

    const resposta = await ServicoRelatorioDinamicoNAAPA.obterQuestoes(
      modalidadesId
    ).catch(e => erros(e));

    if (resposta?.status === HttpStatusCode.Ok) {
      setDadosSecoes(resposta.data);
    } else {
      setDadosSecoes([]);
    }

    setExibirLoader(false);
  }, [modalidade]);

  useEffect(() => {
    if (modalidade?.length) {
      obterQuestoes();
    } else {
      setDadosSecoes([]);
      store.dispatch(setLimparDadosQuestionarioDinamico());
    }
  }, [modalidade, obterQuestoes]);

  useEffect(() => {
    return () => {
      store.dispatch(setLimparDadosQuestionarioDinamico());
    };
  }, []);

  useEffect(() => {
    setExibirCamposFiltroAvancado(false);
    setListaSecoesParaDesabilitar([]);
  }, [modalidade]);

  return (
    <>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Button
            id={SGP_BUTTON_FILTRO_AVANCADO}
            label="Filtro Avançado"
            icon="filter"
            color={Colors.Azul}
            onClick={() => {
              setExibirCamposFiltroAvancado(!exibirCamposFiltroAvancado);
              setListaSecoesParaDesabilitar([]);
            }}
            border
            disabled={!modalidade?.length}
          />
        </Col>

        {dadosSecoes?.length && exibirCamposFiltroAvancado ? (
          <Col xs={24}>
            <Loader loading={exibirLoader}>
              <Row gutter={[0, 24]}>
                <Col xs={24}>
                  <Label
                    text="Filtros avançados"
                    altura="24"
                    tamanhoFonte="18"
                  />
                </Col>
                {dadosSecoes.map((secao, index) => (
                  <Col xs={24} key={secao?.id}>
                    <CollapseRelatorioDinamicoNAAPAFormDinamico
                      index={index}
                      secao={secao}
                      questoes={secao?.questoes}
                      dadosSecoes={dadosSecoes}
                    />
                  </Col>
                ))}
              </Row>
            </Loader>
          </Col>
        ) : (
          <></>
        )}
        <Col xs={24}>
          <Row gutter={[16, 16]}>
            <RelatorioDinamicoNAAPALista
              form={form}
              dadosSecoes={dadosSecoes}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
};

RelatorioDinamicoNAAPAFormDinamico.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioDinamicoNAAPAFormDinamico.defaultProps = {
  form: null,
};

export default RelatorioDinamicoNAAPAFormDinamico;
