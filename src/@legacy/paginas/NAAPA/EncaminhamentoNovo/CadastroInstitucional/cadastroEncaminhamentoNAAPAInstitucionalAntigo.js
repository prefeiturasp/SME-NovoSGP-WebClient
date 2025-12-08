import { useState, useCallback, useEffect } from 'react';
import CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao from './cadastroEncaminhamentoNAAPAInstitucionalBotoesAcao';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import { Card, CampoData } from '~/componentes';
import LoaderEncaminhamentoNAAPA from '../Cadastro/componentes/loaderEncaminhamentoNAAPA';
import { verificaSomenteConsulta } from '~/servicos';
import { ROUTES } from '@/core/enum/routes';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Col, Row, Form } from 'antd';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_DRE, SGP_SELECT_UE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros, sucesso } from '~/servicos';
import { JoditEditor } from '~/componentes';
import UploadArquivos from '~/componentes-sgp/UploadArquivos/uploadArquivos';
import ServicoEncaminhamentoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA';
import ServicoArmazenamento from '~/servicos/Componentes/ServicoArmazenamento';
import './cadastroEncaminhamentoNAAPAInstitucional.css';

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

  const TAMANHO_MAXIMO_UPLOAD = 10;
  const TOTAL_ARQUIVOS_UPLOAD = 10;

  const tiposArquivosPermitidos =
    '.doc, .docx, .xls, .xlsx, .pdf, .png, .jpeg , .jpg';
  const textoFormatoUpload =
    'Permitido somente um arquivo. Tipo permitido doc, docx, xls, xlsx, PDF, PNG, JPEG e JPG';

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

  const onChangeAnexos = listaArquivos => {
    setAnexosLista(listaArquivos);
    formEncInstitucional.setFieldsValue({ anexos: listaArquivos });
  };

  const obterDadosEncaminhamento = useCallback(async () => {
    if (!encaminhamentoId) return;

    setCarregandoGeral(true);

    try {
      const resposta =
        await ServicoEncaminhamentoNAAPA.obterEncaminhamentoInstitucional(
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
      }
    } catch (e) {
      erros(e);
    } finally {
      setCarregandoGeral(false);
    }
  }, [encaminhamentoId, formEncInstitucional]);

  const prepararDadosParaSalvar = () => {
    const valores = formEncInstitucional.getFieldsValue();

    const codigosAnexos = anexosLista
      .filter(arquivo => arquivo.xhr)
      .map(arquivo => arquivo.xhr);

    const dados = {
      codigoDre: valores.codigoDre,
      codigoUe: valores.codigoUe,
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

      setCarregandoGeral(true);

      const resposta =
        await ServicoEncaminhamentoNAAPA.salvarEncaminhamentoInstitucional(
          dados
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

    if (encaminhamentoId) {
      obterDadosEncaminhamento();
    }
  }, [encaminhamentoId, obterDadosEncaminhamento]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setListaUes([]);
    }
  }, [codigoDre]);

  const onRemoveFile = async arquivo => {
    if (desabilitarCampos) {
      return false;
    }

    const codigoArquivo = arquivo?.xhr;

    if (!codigoArquivo) {
      return false;
    }

    setCarregarAnexos(true);

    try {
      let resposta;

      if (arquivo.arquivoId) {
        resposta = await ServicoEncaminhamentoNAAPA.removerArquivoInstitucional(
          codigoArquivo
        );
      } else {
        resposta = await ServicoArmazenamento.removerArquivo(codigoArquivo);
      }

      if (resposta?.status === 200) {
        sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
        return true;
      }

      return false;
    } catch (e) {
      erros(e);
      return false;
    } finally {
      setCarregarAnexos(false);
    }
  };

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
              <Col sm={24} md={24} lg={6}>
                <Form.Item
                  name="dataEntradaQueixa"
                  rules={[
                    {
                      required: true,
                      message: 'Campo obrigatório',
                    },
                  ]}
                >
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
                <Loader loading={carregarAnexos} ignorarTip>
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
                </Loader>
              </Col>
              <div className="tituloAnexo">Anexo de documentos</div>
              <p className="subTituloAnexo">
                Adicione os arquivos que julgar necessários.
              </p>
              <Col sm={24} md={24} lg={24}>
                <Form.Item name="anexos" getValueFromEvent={e => e}>
                  <UploadArquivos
                    name="anexos"
                    id={SGP_UPLOAD_ANEXOS_ENCAMINHAMENTO_INSTITUCIONAL}
                    desabilitarGeral={desabilitarCampos}
                    desabilitarUpload={false}
                    textoFormatoUpload={textoFormatoUpload}
                    tiposArquivosPermitidos={tiposArquivosPermitidos}
                    onRemove={onRemoveFile}
                    onChangeListaArquivos={onChangeAnexos}
                    urlUpload="v1/encaminhamento-naapa/upload"
                    tamanhoMaximoArquivo={TAMANHO_MAXIMO_UPLOAD}
                    totalDeUploads={TOTAL_ARQUIVOS_UPLOAD}
                    defaultFileList={anexosLista}
                    label="Anexos"
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
