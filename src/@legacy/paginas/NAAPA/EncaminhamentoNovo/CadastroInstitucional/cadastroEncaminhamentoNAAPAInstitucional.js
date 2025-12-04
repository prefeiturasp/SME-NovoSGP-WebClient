import React, { useState, useCallback, useEffect } from 'react';
import CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao from './cadastroEncaminhamentoNAAPAInstitucionalBotoesAcao';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import { Card, CampoData } from '~/componentes';
import LoaderEncaminhamentoNAAPA from '../Cadastro/componentes/loaderEncaminhamentoNAAPA';
import { verificaSomenteConsulta } from '~/servicos';
import { ROUTES } from '@/core/enum/routes';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CadastroEncaminhamentoNAAPABotoesAcao from '../Cadastro/cadastroEncaminhamentoNAAPABotoesAcao';
import { Col, Row, Form } from 'antd';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_DRE, SGP_SELECT_UE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros, sucesso } from '~/servicos';
import {
  setDadosEncaminhamentoInstitucional,
  setLimparDadosEncaminhamentoInstitucional,
} from '~/redux/modulos/encaminhamentoInstitucional/actions';
import { JoditEditor } from '~/componentes';
import UploadArquivos from '~/componentes-sgp/UploadArquivos/uploadArquivos';
import ServicoEncaminhamentoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA';
import ServicoEncaInstitucionalNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaInstitucionalNAAPA';
import './cadastroEncaminhamentoNAAPAInstitucional.css';
import MontarDadosTabsInstitucional from './componentes/montarDadosTabsInstitucional/montarDadosTabsInstitucional';

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

  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [dataEntradaQueixa, setDataEntradaQueixa] = useState();
  const [motivoEncaminhamento, setMotivoEncaminhamento] = useState('');
  const [anexosLista, setAnexosLista] = useState([]);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregarAnexos, setCarregarAnexos] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [dadosIniciais, setDadosIniciais] = useState(null);

  const SGP_DATA_ENTRADA_QUEIXA = 'sgp-data-entrada-queixa';
  const SGP_MOTIVO_ENCAMINHAMENTO = 'sgp-motivo-encaminhamento';
  const SGP_UPLOAD_ANEXOS_ENCAMINHAMENTO_INSTITUCIONAL =
    'sgp-upload-anexos-encaminhamento-institucional';

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
    // salvar no redux
    dispatch(
      setDadosEncaminhamentoInstitucional({
        ...dadosEncaminhamentoInstitucional,
        dreCodigo: valorSelecionado,
      })
    );
  };

  const onChangeUe = codigo => {
    const valorSelecionado = formEncInstitucional.getFieldValue('codigoUe');
    setCodigoUe(valorSelecionado);
    dispatch(
      setDadosEncaminhamentoInstitucional({
        ...dadosEncaminhamentoInstitucional,
        ueCodigo: valorSelecionado,
      })
    );
  };

  // ========== MÉTODOS DE BUSCA E MANIPULAÇÃO DE DADOS ==========

  const obterDadosEncaminhamento = useCallback(async () => {
    if (!encaminhamentoId) return;

    setCarregandoGeral(true);

    try {
      const resposta =
        await ServicoEncaInstitucionalNAAPA.obterEncaminhamentoInstitucional(
          encaminhamentoId
        );

      if (resposta?.data) {
        const dados = resposta.data;
        setDadosIniciais(dados);

        formEncInstitucional.setFieldsValue({
          codigoDre: dados.codigoDre,
          codigoUe: dados.codigoUe,
          dataEntradaQueixa: dados.dataEntradaQueixa,
          motivoEncaminhamento: dados.motivoEncaminhamento,
        });

        setCodigoDre(dados.codigoDre);
        setCodigoUe(dados.codigoUe);
        setDataEntradaQueixa(
          dados.dataEntradaQueixa
            ? window.moment(dados.dataEntradaQueixa, 'DD/MM/YYYY')
            : null
        );
        setMotivoEncaminhamento(dados.motivoEncaminhamento || '');

        if (dados.anexos?.length) {
          const anexosMapeados = dados.anexos.map(anexo => ({
            uid: anexo.codigo,
            xhr: anexo.codigo,
            arquivoId: anexo.arquivoId,
            name: anexo.nome,
            status: 'done',
          }));

          setAnexosLista(anexosMapeados);
          formEncInstitucional.setFieldsValue({ anexos: anexosMapeados });
        }
        // salvar também no redux para que MontarDadosTabsInstitucional use os dados
        dispatch(
          setDadosEncaminhamentoInstitucional({
            dreCodigo: dados.codigoDre,
            ueCodigo: dados.codigoUe,
            anoLetivo: dados.anoLetivo,
            // mantemos outros campos se necessário
          })
        );
      }
    } catch (e) {
      erros(e);
    } finally {
      setCarregandoGeral(false);
    }
  }, [encaminhamentoId, formEncInstitucional]);

  const prepararDadosParaSalvar = () => {
    // Ao salvar agora usamos os dados do Redux (dre/ue) e o mapping dos questionarios
    // mantendo compatibilidade com campos locais de anexo caso existam
    const valores = formEncInstitucional.getFieldsValue();

    const codigosAnexos = anexosLista
      .filter(arquivo => arquivo.xhr)
      .map(arquivo => arquivo.xhr);

    const dadosRedux = dadosEncaminhamentoInstitucional || {};

    const dados = {
      codigoDre: dadosRedux.dreCodigo || valores.codigoDre,
      codigoUe: dadosRedux.ueCodigo || valores.codigoUe,
      dataEntradaQueixa: valores.dataEntradaQueixa,
      motivoEncaminhamento: valores.motivoEncaminhamento || '',
      anexos: codigosAnexos,
    };

    if (encaminhamentoId) {
      dados.id = parseInt(encaminhamentoId, 10);
    }

    return dados;
  };

  const salvarEncaminhamento = async () => {
    try {
      await formEncInstitucional.validateFields();

      const dados = prepararDadosParaSalvar();

      // Persistir os dados no Redux para que o serviço os leia
      dispatch(
        setDadosEncaminhamentoInstitucional({
          ...dadosEncaminhamentoInstitucional,
          dreCodigo: dados.codigoDre,
          ueCodigo: dados.codigoUe,
          dataEntradaQueixa: dados.dataEntradaQueixa,
          motivoEncaminhamento: dados.motivoEncaminhamento,
          anexos: dados.anexos,
        })
      );

      setCarregandoGeral(true);

      // Use the institutional service to save; it will map questionarios from Redux
      const resposta =
        await ServicoEncaInstitucionalNAAPA.salvarEncaminhamentoInstitucional(
          encaminhamentoId
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
      navigate(ROUTES.ATENDIMENTO_NAAPA);
      setDesabilitarCampos(true);
    }
  }, [permissoesTela]);

  useEffect(() => {
    obterDres();
    // Se tem ID na URL, busca os dados do encaminhamento
    if (encaminhamentoId) {
      obterDadosEncaminhamento();
    }
  }, [encaminhamentoId, obterDadosEncaminhamento]);

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
      //store.dispatch(setUe());
    }
  }, [codigoDre]);

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
              <Col sm={24} md={24} lg={9}>
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
              <Col sm={24} md={24} lg={9}>
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

            <MontarDadosTabsInstitucional />
          </Form>
        </Card>
      </div>
    </LoaderEncaminhamentoNAAPA>
  );
};

export default CadastroEncaminhamentoNAAPAInstitucional;
