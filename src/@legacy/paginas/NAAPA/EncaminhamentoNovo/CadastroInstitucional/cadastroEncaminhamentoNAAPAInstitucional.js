import React, { useState, useCallback, useEffect } from 'react';
import CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao from './cadastroEncaminhamentoNAAPAInstitucionalBotoesAcao';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import { Card } from '~/componentes';
import LoaderEncaminhamentoNAAPA from '../Cadastro/componentes/loaderEncaminhamentoNAAPA';
import { verificaSomenteConsulta } from '~/servicos';
import { ROUTES } from '@/core/enum/routes';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, Form } from 'antd';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_DRE, SGP_SELECT_UE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';
import {
  setDadosEncaminhamentoInstitucional,
  setLimparDadosEncaminhamentoInstitucional,
} from '~/redux/modulos/encaminhamentoInstitucional/actions';
import ServicoEncaminhamentoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA';
import './cadastroEncaminhamentoNAAPAInstitucional.css';
import MontarDadosTabsInstitucional from './componentes/montarDadosTabsInstitucional/montarDadosTabsInstitucional';
import { set } from 'lodash';

export const CadastroEncaminhamentoNAAPAInstitucional = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const usuario = useSelector(state => state.usuario);
  const permissoesTela = usuario.permissoes[ROUTES.ATENDIMENTO_NAAPA];
  const encaminhamentoId = id;

  const dispatch = useDispatch();

  const dadosEncaminhamentoInstitucional = useSelector(
    state => state.encaminhamentoInstitucional.dadosEncaminhamentoInstitucional
  );

  const [formEncInstitucional] = Form.useForm();

  const [idDre, setIdDre] = useState();
  const [idUe, setIdUe] = useState();

  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [carregandoGeral, setCarregandoGeral] = useState(false);

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);

    const resposta = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/false/dres`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));
    if (resposta?.data?.length > 0) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
      }
      setListaDres(lista);
    } else {
      setListaDres([]);
    }
  }, []);

  const obterUes = useCallback(async () => {
    setCarregandoUes(true);
    const resposta = await AbrangenciaServico.buscarUes(
      codigoDre,
      `v1/abrangencias/false/dres/${codigoDre}/ues?consideraNovasUEs=${true}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoUes(false));

    if (resposta?.data?.length) {
      if (resposta?.data?.length === 1) {
      }

      setListaUes(resposta.data);
    } else {
      setListaUes([]);
    }
  }, [codigoDre]);

  const onChangeDre = codigo => {
    const valorSelecionado = formEncInstitucional.getFieldValue('codigoDre');

    setCodigoDre(valorSelecionado);
    const idDreSelecionada = listaDres.find(
      dre => dre.codigo == valorSelecionado.toString()
    )?.id;

    setIdDre(idDreSelecionada);
    dispatch(
      setDadosEncaminhamentoInstitucional({
        ...dadosEncaminhamentoInstitucional,
        dreId: idDreSelecionada,
      })
    );
  };

  const onChangeUe = codigo => {
    const valorSelecionado = formEncInstitucional.getFieldValue('codigoUe');
    setCodigoUe(valorSelecionado);
    const idUeSelecionada = listaUes.find(
      ue => ue.codigo == valorSelecionado.toString()
    )?.id;

    setIdUe(idUeSelecionada);
    dispatch(
      setDadosEncaminhamentoInstitucional({
        ...dadosEncaminhamentoInstitucional,
        UeId: idUeSelecionada,
      })
    );
  };

  const obterDadosEncaminhamento = useCallback(async () => {
    if (!encaminhamentoId) return;

    setCarregandoGeral(true);

    try {
      const resposta =
        await ServicoEncaminhamentoNAAPA.obterDadosEncaminhamentoNAAPA(
          encaminhamentoId
        );

      if (resposta?.data) {
        const dados = resposta.data;

        setCodigoDre(dados.dreCodigo);
        setCodigoUe(dados.ueCodigo);
        setIdDre(dados.dreId);
        setIdUe(dados.ueId);

        // Preencher o formulário com os códigos
        formEncInstitucional.setFieldsValue({
          codigoDre: dados.dreCodigo,
          codigoUe: dados.ueCodigo,
        });

        dispatch(
          setDadosEncaminhamentoInstitucional({
            id: dados.id,
            dreId: dados.dreId,
            ueId: dados.ueId,
            situacao: dados.situacao,
            tipo: dados.tipo,
          })
        );
      }
    } catch (e) {
      erros(e);
    } finally {
      setCarregandoGeral(false);
    }
  }, [encaminhamentoId, dispatch, formEncInstitucional]);

  const salvarEncaminhamento = async () => {
    try {
      await formEncInstitucional.validateFields();

      const dadosRedux = dadosEncaminhamentoInstitucional || {};

      dispatch(
        setDadosEncaminhamentoInstitucional({
          ...dadosEncaminhamentoInstitucional,
          dreId: dadosRedux.dreId || idDre,
          ueId: dadosRedux.ueId || idUe,
          tipo: dadosRedux.tipo || 12,
          situacao: dadosRedux.situacao || 2,
        })
      );

      setCarregandoGeral(true);

      const resposta =
        await ServicoEncaminhamentoNAAPA.salvarEncaminhamentoInstitucional(
          encaminhamentoId,
          true
        );

      setCarregandoGeral(false);

      if (resposta?.status === 200) {
        return true;
      }

      return false;
    } catch (erro) {
      setCarregandoGeral(false);

      if (erro?.errorFields) {
        return false;
      }

      erros(erro);
      return false;
    }
  };

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);

    if (soConsulta) {
      navigate(ROUTES.ENCAMINHAMENTO_NAAPA);
      setDesabilitarCampos(true);
    }
  }, [permissoesTela, navigate]);

  useEffect(() => {
    obterDres();

    if (encaminhamentoId) {
      obterDadosEncaminhamento();
    }
  }, [encaminhamentoId, obterDadosEncaminhamento, obterDres]);

  useEffect(() => {
    return () => {
      dispatch(setLimparDadosEncaminhamentoInstitucional());
    };
  }, [dispatch]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setListaUes([]);
    }
  }, [codigoDre, obterUes]);

  return (
    <LoaderEncaminhamentoNAAPA loading={carregandoGeral}>
      <div>
        <Cabecalho pagina="Encaminhamento Institucional">
          <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
            formEncInstitucional={formEncInstitucional}
            salvarEncaminhamento={salvarEncaminhamento}
          />
        </Cabecalho>

        <Card padding="24px 24px">
          <Form form={formEncInstitucional} layout="vertical">
            <Row gutter={[16, 16]} style={{ width: '100%', margin: 0 }}>
              <Col sm={24} md={24} lg={12}>
                <Loader loading={carregandoDres} ignorarTip>
                  <Form.Item
                    name="codigoDre"
                    rules={[
                      {
                        required: true,
                        message: 'Campo obrigatório',
                      },
                    ]}
                  >
                    <SelectComponent
                      valueText="nome"
                      id={SGP_SELECT_DRE}
                      valueOption="codigo"
                      onChange={onChangeDre}
                      lista={listaDres || []}
                      placeholder="Selecione uma DRE"
                      disabled={listaDres?.length === 1}
                      valueSelect={codigoDre || undefined}
                      label="Diretoria Regional de Educação (DRE)"
                    />
                  </Form.Item>
                </Loader>
              </Col>
              <Col sm={24} md={24} lg={12}>
                <Loader loading={carregandoUes} ignorarTip>
                  <Form.Item
                    name="codigoUe"
                    rules={[
                      {
                        required: true,
                        message: 'Campo obrigatório',
                      },
                    ]}
                  >
                    <SelectComponent
                      valueText="nome"
                      id={SGP_SELECT_UE}
                      valueOption="codigo"
                      onChange={onChangeUe}
                      lista={listaUes || []}
                      label="Unidade Escolar (UE)"
                      placeholder="Selecione uma UE"
                      valueSelect={codigoUe || undefined}
                      disabled={!codigoDre || listaUes?.length === 1}
                    />
                  </Form.Item>
                </Loader>
              </Col>
            </Row>
            <div className="espacoFormDinamico">
              <MontarDadosTabsInstitucional />
            </div>
          </Form>
        </Card>
      </div>
    </LoaderEncaminhamentoNAAPA>
  );
};

export default CadastroEncaminhamentoNAAPAInstitucional;
