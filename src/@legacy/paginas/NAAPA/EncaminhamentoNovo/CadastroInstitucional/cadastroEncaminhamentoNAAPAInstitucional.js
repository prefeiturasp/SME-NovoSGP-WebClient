import React, { useState, useCallback, useEffect } from 'react';
import CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao from './cadastroEncaminhamentoNAAPAInstitucionalBotoesAcao';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import { Card, CampoData } from '~/componentes';
import LoaderEncaminhamentoNAAPA from '../Cadastro/componentes/loaderEncaminhamentoNAAPA';
import { verificaSomenteConsulta } from '~/servicos';
import { ROUTES } from '@/core/enum/routes';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CadastroEncaminhamentoNAAPABotoesAcao from '../Cadastro/cadastroEncaminhamentoNAAPABotoesAcao';
import { Col, Row, Form } from 'antd';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_DRE, SGP_SELECT_UE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';
import { JoditEditor } from '~/componentes';

export const CadastroEncaminhamentoNAAPAInstitucional = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const usuario = useSelector(state => state.usuario);
  const permissoesTela = usuario.permissoes[ROUTES.ATENDIMENTO_NAAPA];
  const encaminhamentoId = id;

  const [formEncInstitucional] = Form.useForm();

  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [dataEntradaQueixa, setDataEntradaQueixa] = useState();
  const [motivoEncaminhamento, setMotivoEncaminhamento] = useState('');
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);

  const SGP_DATA_ENTRADA_QUEIXA = 'sgp-data-entrada-queixa';
  const SGP_MOTIVO_ENCAMINHAMENTO = 'sgp-motivo-encaminhamento';

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
        //store.dispatch(setDre(lista[0]));
      }
      setListaDres(lista);
    } else {
      setListaDres([]);
      //store.dispatch(setDre());
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
        //store.dispatch(setUe(resposta.data[0]));
      }

      setListaUes(resposta.data);
    } else {
      setListaUes([]);
      //store.dispatch(setUe());
    }
  }, [codigoDre]);

  const onChangeDre = codigo => {
    const valorSelecionado = formEncInstitucional.getFieldValue('codigoDre');
    setCodigoDre(valorSelecionado);
  };

  const onChangeUe = codigo => {
    const valorSelecionado = formEncInstitucional.getFieldValue('codigoUe');
    setCodigoUe(valorSelecionado);
  };

  const onChangeData = data => {
    setDataEntradaQueixa(data);
    const dataFormatada = data ? data.format('DD/MM/YYYY') : null;
    formEncInstitucional.setFieldsValue({
      dataEntradaQueixa: dataFormatada,
    });
  };

  const onChangeMotivoEncaminhamento = valor => {
    setMotivoEncaminhamento(valor);
  };

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);

    if (soConsulta) {
      navigate(ROUTES.ATENDIMENTO_NAAPA);
      setDesabilitarCampos(true);
    }
  }, [permissoesTela]);

  useEffect(() => {
    obterDres();
    //store.dispatch(setAnoLetivo(anoAtual));
  }, []);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setListaUes([]);
      //store.dispatch(setUe());
    }
  }, [codigoDre]);

  return (
    <LoaderEncaminhamentoNAAPA>
      <div>
        <Cabecalho pagina="Encaminhamento Institucional">
          <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
            formEncInstitucional={formEncInstitucional}
          />
        </Cabecalho>

        <Card padding="24px 24px">
          <Form form={formEncInstitucional} layout="vertical">
            <Row gutter={[16, 16]} style={{ width: '100%', margin: 0 }}>
              <Col sm={24} md={24} lg={9}>
                <Loader loading={carregandoDres} ignorarTip>
                  <Form.Item name="codigoDre">
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
              <Col sm={24} md={24} lg={9}>
                <Loader loading={carregandoUes} ignorarTip>
                  <Form.Item name="codigoUe">
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
              <Col sm={24} md={24} lg={6}>
                <Form.Item name="dataEntradaQueixa">
                  <CampoData
                    label="Data de entrada da queixa"
                    id={SGP_DATA_ENTRADA_QUEIXA}
                    valor={dataEntradaQueixa}
                    onChange={onChangeData}
                    placeholder="DD/MM/AAAA"
                    formatoData="DD/MM/YYYY"
                    desabilitado={listaUes?.length === 0}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={24} lg={24}>
                <Form.Item
                  name="motivoEncaminhamento"
                  getValueFromEvent={e => e}
                >
                  <JoditEditor
                    label="Motivo do encaminhamento"
                    id={SGP_MOTIVO_ENCAMINHAMENTO}
                    name="motivoEncaminhamento"
                    onChange={onChangeMotivoEncaminhamento}
                    readonly={desabilitarCampos}
                    desabilitar={desabilitarCampos}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </LoaderEncaminhamentoNAAPA>
  );
};

export default CadastroEncaminhamentoNAAPAInstitucional;
