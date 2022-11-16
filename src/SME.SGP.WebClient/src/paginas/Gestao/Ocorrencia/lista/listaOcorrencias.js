import { Col, Row } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  CampoData,
  CampoTexto,
  Card,
  CheckboxComponent,
  Colors,
  Loader,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import {
  SGP_BUTTON_IMPRIMIR,
  SGP_CHECKBOX_EXIBIR_HISTORICO,
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_DRE,
  SGP_SELECT_MODALIDADE,
  SGP_SELECT_SEMESTRE,
  SGP_SELECT_TURMA,
  SGP_SELECT_UE,
} from '~/componentes-sgp/filtro/idsCampos';
import { ModalidadeDTO, RotasDto } from '~/dtos';
import {
  AbrangenciaServico,
  confirmar,
  erros,
  ServicoFiltroRelatorio,
  ServicoOcorrencias,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import { ordenarDescPor } from '~/utils';
import ListaOcorrenciasBotoesAcao from './listaOcorrenciasBotoesAcao';
import ListaOcorrenciasPaginada from './listaOcorrenciasPaginada';

const ListaOcorrencias = () => {
  const usuario = useSelector(state => state.usuario);
  const { permissoes } = usuario;
  const { podeExcluir, podeIncluir } = permissoes[RotasDto.OCORRENCIAS];

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoLetivo, setAnoLetivo] = useState();
  const [dre, setDre] = useState();
  const [ue, setUe] = useState();
  const [modalidade, setModalidade] = useState();
  const [semestre, setSemestre] = useState();
  const [turmaId, setTurmaId] = useState();
  const [alunoNome, setAlunoNome] = useState('');
  const [servidorNome, setServidorNome] = useState('');
  const [dataOcorrenciaInicio, setDataOcorrenciaInicio] = useState();
  const [dataOcorrenciaFim, setDataOcorrenciaFim] = useState();
  const [tipoOcorrencia, setTipoOcorrencia] = useState();
  const [titulo, setTitulo] = useState();

  const [alunoNomeExibicao, setAlunoNomeExibicao] = useState('');
  const [servidorNomeExibicao, setServidorNomeExibicao] = useState('');
  const [tituloExibicao, setTituloExibicao] = useState('');
  const [timeoutDebounce, setTimeoutDebounce] = useState();

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState();
  const [listaSemestres, setListaSemestres] = useState();
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaTiposOcorrencias, setListaTiposOcorrencias] = useState([]);

  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoImpressao, setCarregandoImpressao] = useState(false);
  const [exibirLoaderExcluir, setExibirLoaderExcluir] = useState(false);

  const [ocorrenciasSelecionadas, setOcorrenciasSelecionadas] = useState([]);
  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const [filtros, setFiltros] = useState();

  const ehTurmaAnoAnterior =
    anoLetivo?.toString() !== window.moment().format('YYYY');

  const ehEJA = Number(modalidade) === ModalidadeDTO.EJA;

  const filtroEhValido = !!(anoLetivo && dre?.id && ue?.id);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(
      permissoes[RotasDto.OCORRENCIAS]
    );
    setSomenteConsulta(soConsulta);
  }, [permissoes]);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    const anosLetivo = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    })
      .catch(e => erros(e))
      .finally(() => setCarregandoAnosLetivos(false));

    if (anosLetivo?.length) {
      const anosOrdenados = ordenarDescPor(anosLetivo, 'valor');
      setListaAnosLetivo(anosOrdenados);
      setAnoLetivo(anosLetivo[0].valor);
      return;
    }
    setListaAnosLetivo([]);
    setAnoLetivo();
  }, [consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const resposta = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        setDre(lista[0]);
      }

      setListaDres(lista);
    } else {
      setDre();
      setListaDres([]);
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo]);

  const obterUes = useCallback(async () => {
    setCarregandoUes(true);
    const resposta = await AbrangenciaServico.buscarUes(
      dre?.codigo,
      `v1/abrangencias/${consideraHistorico}/dres/${dre?.codigo}/ues?anoLetivo=${anoLetivo}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoUes(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        setUe(lista[0]);
      }

      setListaUes(lista);
    } else {
      setUe();
      setListaUes([]);
    }
  }, [dre, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (dre?.codigo) {
      obterUes();
    }
  }, [dre, obterUes]);

  const obterModalidades = useCallback(async () => {
    setCarregandoModalidades(true);
    const retorno = await ServicoFiltroRelatorio.obterModalidades(
      ue?.codigo,
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoModalidades(false));

    if (retorno?.data?.length) {
      const lista = retorno.data;

      setListaModalidades(lista);
    } else {
      setListaModalidades([]);
    }
  }, [anoLetivo, ue, consideraHistorico]);

  useEffect(() => {
    if (ue?.codigo) {
      obterModalidades();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ue]);

  const obterSemestres = useCallback(async () => {
    setCarregandoSemestres(true);
    const retorno = await AbrangenciaServico.obterSemestres(
      consideraHistorico,
      anoLetivo,
      modalidade,
      dre?.codigo,
      ue?.codigo
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoSemestres(false));

    if (retorno?.data?.length) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });
      setListaSemestres(lista);
    } else {
      setListaSemestres([]);
    }
  }, [anoLetivo, modalidade, consideraHistorico, dre, ue]);

  useEffect(() => {
    if (modalidade && ehEJA) {
      obterSemestres();
    }
  }, [obterSemestres, ehEJA, modalidade]);

  const obterTurmas = useCallback(async () => {
    setCarregandoTurmas(true);

    const retorno = await AbrangenciaServico.buscarTurmas(
      ue?.codigo,
      modalidade,
      '',
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTurmas(false));

    if (retorno?.data?.length) {
      const lista = retorno?.data;
      setListaTurmas(lista);
    } else {
      setListaTurmas([]);
    }
  }, [anoLetivo, consideraHistorico, ue, modalidade]);

  useEffect(() => {
    if (modalidade) {
      obterTurmas();
    }
  }, [modalidade, obterTurmas]);

  useEffect(() => {
    ServicoOcorrencias.buscarTiposOcorrencias().then(resposta => {
      if (resposta?.data?.length) {
        setListaTiposOcorrencias(resposta.data);
      } else {
        setListaTiposOcorrencias([]);
      }
    });
  }, []);

  const onClickGerar = async () => {
    const linhaSemEstudante = ocorrenciasSelecionadas?.find(
      d => !d?.alunoOcorrencia
    );

    let confirmado = true;

    if (linhaSemEstudante) {
      confirmado = await confirmar(
        'Atenção',
        'Serão impressos somente ocorrências que tem Crianças/Estudantes selecionados, deseja realizar a impressão?'
      );
    }

    if (!confirmado) return;

    const correnciasComEstudantes = ocorrenciasSelecionadas?.filter(
      d => !!d?.alunoOcorrencia
    );
    const params = {
      dreCodigo: dre?.codigo,
      ueCodigo: ue?.codigo,
      turmaId,
      ocorrenciasIds: correnciasComEstudantes
        ? correnciasComEstudantes?.map(item => String(item.id))
        : [],
    };
    setCarregandoImpressao(true);
    const retorno = await ServicoOcorrencias.gerar(params).catch(e => erros(e));

    if (retorno?.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
    setCarregandoImpressao(false);
  };

  const limparCamposSemConsulta = () => {
    setAlunoNome('');
    setAlunoNomeExibicao('');
    setServidorNome('');
    setServidorNomeExibicao('');
    setDataOcorrenciaInicio('');
    setDataOcorrenciaFim('');
    setTipoOcorrencia();
    setTitulo('');
    setTituloExibicao('');
  };

  const onCheckedConsideraHistorico = e => {
    setListaAnosLetivo([]);
    setAnoLetivo();

    setListaDres([]);
    setDre();

    setListaUes([]);
    setUe();

    setListaModalidades();
    setModalidade();

    setListaSemestres();
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    limparCamposSemConsulta();
    setConsideraHistorico(e.target.checked);
  };

  const onChangeAnoLetivo = ano => {
    setListaDres([]);
    setDre();

    setListaUes([]);
    setUe();

    setListaModalidades();
    setModalidade();

    setListaSemestres();
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    limparCamposSemConsulta();
    setAnoLetivo(ano);
  };

  const onChangeDre = dreCodigo => {
    setListaUes([]);
    setUe();

    setListaModalidades();
    setModalidade();

    setListaSemestres();
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    limparCamposSemConsulta();

    const dreAtual = listaDres?.find(d => d?.codigo === dreCodigo);
    setDre(dreAtual);
  };

  const onChangeUe = ueCodigo => {
    setListaModalidades();
    setModalidade();

    setListaSemestres();
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    limparCamposSemConsulta();

    const ueAual = listaUes?.find(d => d?.codigo === ueCodigo);
    setUe(ueAual);
  };

  const onChangeModalidade = novaModalidade => {
    setListaSemestres();
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    limparCamposSemConsulta();

    setModalidade(novaModalidade);
  };

  const onChangeSemestre = valor => {
    limparCamposSemConsulta();
    setTurmaId();
    setSemestre(valor);
  };

  const onChangeTurma = valor => {
    limparCamposSemConsulta();

    setTurmaId(valor);
  };

  const validarDebounce = useCallback(
    (texto, onChange) => {
      if (timeoutDebounce) {
        clearTimeout(timeoutDebounce);
      }
      const timeout = setTimeout(() => {
        onChange(texto);
      }, 700);

      setTimeoutDebounce(timeout);
    },
    [timeoutDebounce]
  );

  const onChangeDebounce = (text, setValue) => {
    if (text?.length >= 3 || !text) {
      validarDebounce(text, setValue);
    }
  };

  const onChangeAlunoNome = e => {
    setAlunoNomeExibicao(e?.target?.value);
    onChangeDebounce(e?.target?.value, setAlunoNome);
  };

  const onChangeServidorNome = e => {
    setServidorNomeExibicao(e?.target?.value);
    onChangeDebounce(e?.target?.value, setServidorNome);
  };

  const onChangeTitulo = e => {
    setTituloExibicao(e?.target?.value);
    onChangeDebounce(e?.target?.value, setTitulo);
  };

  return (
    <Loader
      loading={exibirLoaderExcluir}
      tip={exibirLoaderExcluir ? 'Excluindo' : ''}
    >
      <Cabecalho pagina="Ocorrências">
        <ListaOcorrenciasBotoesAcao
          ocorrenciasSelecionadas={ocorrenciasSelecionadas}
          setOcorrenciasSelecionadas={setOcorrenciasSelecionadas}
          ehTurmaAnoAnterior={ehTurmaAnoAnterior}
          somenteConsulta={somenteConsulta}
          podeExcluir={podeExcluir}
          podeIncluir={podeIncluir}
          atualizarDados={() => setFiltros({ ...filtros })}
          setExibirLoaderExcluir={setExibirLoaderExcluir}
        />
      </Cabecalho>
      <Card padding="24px 24px">
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col md={24} xl={12}>
              <CheckboxComponent
                id={SGP_CHECKBOX_EXIBIR_HISTORICO}
                label="Exibir histórico?"
                onChangeCheckbox={onCheckedConsideraHistorico}
                checked={consideraHistorico}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col sm={24} md={8} lg={4}>
              <Loader loading={carregandoAnosLetivos} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_ANO_LETIVO}
                  label="Ano letivo"
                  placeholder="Ano letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={listaAnosLetivo?.length === 1}
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                />
              </Loader>
            </Col>
            <Col sm={24} md={24} lg={10}>
              <Loader loading={carregandoDres} tip="">
                <SelectComponent
                  id={SGP_SELECT_DRE}
                  label="DRE"
                  lista={listaDres || []}
                  valueOption="codigo"
                  valueText="nome"
                  disabled={listaDres?.length === 1}
                  onChange={onChangeDre}
                  valueSelect={dre?.codigo || undefined}
                  placeholder="Selecione uma DRE"
                  showSearch
                />
              </Loader>
            </Col>
            <Col sm={24} md={24} lg={10}>
              <Loader loading={carregandoUes} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_UE}
                  label="Unidade Escolar (UE)"
                  lista={listaUes || []}
                  valueOption="codigo"
                  valueText="nome"
                  disabled={!dre?.codigo || listaUes?.length === 1}
                  onChange={onChangeUe}
                  valueSelect={ue?.codigo || undefined}
                  placeholder="Selecione uma UE"
                  showSearch
                />
              </Loader>
            </Col>
            <Col sm={24} md={12} lg={ehEJA ? 8 : 12}>
              <Loader loading={carregandoModalidades} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_MODALIDADE}
                  label="Modalidade"
                  placeholder="Selecione a modalidade"
                  lista={listaModalidades}
                  valueOption="valor"
                  valueText="descricao"
                  disabled={!ue?.codigo}
                  onChange={onChangeModalidade}
                  valueSelect={modalidade}
                />
              </Loader>
            </Col>
            {ehEJA ? (
              <Col sm={24} md={12} lg={8}>
                <Loader loading={carregandoSemestres} ignorarTip>
                  <SelectComponent
                    id={SGP_SELECT_SEMESTRE}
                    lista={listaSemestres}
                    valueOption="valor"
                    valueText="desc"
                    label="Semestre"
                    placeholder="Selecione o semestre"
                    disabled={!modalidade}
                    valueSelect={semestre}
                    onChange={onChangeSemestre}
                  />
                </Loader>
              </Col>
            ) : (
              <></>
            )}
            <Col sm={24} md={12} lg={ehEJA ? 8 : 12}>
              <Loader loading={carregandoTurmas} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_TURMA}
                  lista={listaTurmas}
                  valueOption="id"
                  valueText="nomeFiltro"
                  label="Turma"
                  disabled={!modalidade || (ehEJA && !semestre)}
                  valueSelect={turmaId}
                  onChange={onChangeTurma}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </Col>
            <Col sm={24} md={12}>
              <CampoTexto
                id="SGP_INPUT_TEXT_ALUNO_NOME"
                value={alunoNomeExibicao}
                onChange={onChangeAlunoNome}
                label="Crianças/Estudantes"
                placeholder="Procure pelo nome da criança"
                iconeBusca
                allowClear
              />
            </Col>
            <Col sm={24} md={12}>
              <CampoTexto
                id="SGP_INPUT_TEXT_SERVIDOR_NOME"
                value={servidorNomeExibicao}
                onChange={onChangeServidorNome}
                label="Servidor"
                placeholder="Procure pelo nome do servidor"
                iconeBusca
                allowClear
              />
            </Col>
            <Col sm={24} md={6}>
              <CampoData
                id="SGP_DATE_OCORRENCIA_INICIO"
                label="Data da ocorrência"
                valor={dataOcorrenciaInicio}
                onChange={setDataOcorrenciaInicio}
                placeholder="Data inicial"
                formatoData="DD/MM/YYYY"
              />
            </Col>
            <Col sm={24} md={6} style={{ marginTop: '25px' }}>
              <CampoData
                id="SGP_DATE_OCORRENCIA_FIM"
                valor={dataOcorrenciaFim}
                onChange={setDataOcorrenciaFim}
                placeholder="Data final"
                formatoData="DD/MM/YYYY"
              />
            </Col>
            <Col sm={24} md={12}>
              <SelectComponent
                id="SGP_SELECT_TIPO_OCORRENCIA"
                placeholder="Tipo da ocorrência"
                label="Tipo da ocorrência"
                valueOption="id"
                valueText="descricao"
                lista={listaTiposOcorrencias}
                valueSelect={tipoOcorrencia}
                onChange={setTipoOcorrencia}
                allowClear
              />
            </Col>
            <Col sm={24} md={12}>
              <CampoTexto
                id="SGP_INPUT_TEXT_TITULO"
                value={tituloExibicao}
                onChange={onChangeTitulo}
                label="Título da ocorrência"
                placeholder="Procure pelo título da ocorrência"
                iconeBusca
                allowClear
              />
            </Col>
            <Col sm={24}>
              <Loader loading={carregandoImpressao} ignorarTip>
                <Button
                  id={SGP_BUTTON_IMPRIMIR}
                  icon="print"
                  color={Colors.Azul}
                  semMargemDireita
                  border
                  onClick={onClickGerar}
                  disabled={
                    !ocorrenciasSelecionadas?.length ||
                    ocorrenciasSelecionadas?.filter(d => !d?.alunoOcorrencia)
                      ?.length === ocorrenciasSelecionadas?.length
                  }
                />
              </Loader>
            </Col>
            <Col sm={24}>
              <ListaOcorrenciasPaginada
                setFiltros={setFiltros}
                filtros={filtros}
                setOcorrenciasSelecionadas={setOcorrenciasSelecionadas}
                filtroEhValido={filtroEhValido}
                consideraHistorico={consideraHistorico}
                anoLetivo={anoLetivo}
                dre={dre}
                ue={ue}
                modalidade={modalidade}
                semestre={semestre}
                turmaId={turmaId}
                alunoNome={alunoNome}
                servidorNome={servidorNome}
                dataOcorrenciaInicio={dataOcorrenciaInicio}
                dataOcorrenciaFim={dataOcorrenciaFim}
                tipoOcorrencia={tipoOcorrencia}
                titulo={titulo}
              />
            </Col>
          </Row>
        </Col>
      </Card>
    </Loader>
  );
};

export default ListaOcorrencias;
