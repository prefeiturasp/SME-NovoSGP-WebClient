import { ROUTES } from '@/core/enum/routes';
import { Col, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Cabecalho from '~/componentes-sgp/cabecalho';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { AbrangenciaServico, erros } from '~/servicos';
import ServicoResponsaveis from '~/servicos/Paginas/Gestao/Responsaveis/ServicoResponsaveis';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import Button from '../../../componentes/button';
import Card from '../../../componentes/card';
import CheckboxComponent from '../../../componentes/checkbox';
import { Colors } from '../../../componentes/colors';
import SelectComponent from '../../../componentes/select';
import DataTable from '../../../componentes/table/dataTable';
import api from '../../../servicos/api';

export default function AtribuicaoSupervisorLista() {
  const navigate = useNavigate();

  const [uesSemSupervisorCheck, setUesSemSupervisorCheck] = useState(false);
  const [dresSelecionadas, setDresSelecionadas] = useState('');
  const [supervisoresSelecionados, setSupervisoresSelecionados] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaSupervisores, setListaSupervisores] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [ueSelecionada, setUeSelecionada] = useState([]);
  const [listaFiltroAtribuicao, setListaFiltroAtribuicao] = useState([]);
  const [desabilitarSupervisor, setDesabilitarSupervisor] = useState(false);
  const [tipoResponsavel, setTipoResponsavel] = useState();
  const [listaTipoResponsavel, setListaTipoResponsavel] = useState([]);
  const [carregandoResponsavel, setCarregandoResponsavel] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [numeroRegistrosPagina, setNumeroRegistrosPagina] = useState(10);

  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA];

  const obterDres = useCallback(async () => {
    const retorno = await AbrangenciaServico.buscarDres().catch(e => erros(e));

    if (retorno?.data?.length) {
      if (retorno.data.length === 1) {
        const dre = retorno.data[0].codigo;
        setDresSelecionadas(dre);
      }

      setListaDres(retorno.data);
    } else {
      setListaDres([]);
      setDresSelecionadas();
    }
  }, [tipoResponsavel]);

  useEffect(() => {
    obterDres();
  }, [obterDres]);

  useEffect(() => {
    if (permissoesTela) {
      verificaSomenteConsulta(permissoesTela);
    }
  }, []);

  const columns = [
    {
      title: 'DRE',
      width: '10%',
      render: () => {
        const dreSelecionada = listaDres?.find?.(
          d => d?.codigo === dresSelecionadas
        );
        return dreSelecionada?.abreviacao;
      },
    },
    {
      title: 'Unidade Escolar',
      dataIndex: 'escola',
      width: '35%',
    },
    {
      title: 'Tipo de responsável',
      dataIndex: 'tipoResponsavel',
      width: '20%',
      render: text => {
        return (
          text || <span className="texto-vermelho-negrito">NÃO ATRIBUIDO</span>
        );
      },
    },
    {
      title: 'Responsável',
      dataIndex: 'responsavel',
      width: '35%',
      render: text => {
        return (
          text || <span className="texto-vermelho-negrito">NÃO ATRIBUIDO</span>
        );
      },
    },
  ];

  function onClickVoltar() {
    navigate('/');
  }

  function onClickEditar(responsavelId, tipoResponsavelId, codigoUe) {
    if (!permissoesTela.podeAlterar) return;

    const tipoResp = tipoResponsavel ?? tipoResponsavelId;
    let path = ROUTES.ATRIBUICAO_RESPONSAVEIS;
    if (dresSelecionadas) {
      path = `${path}/${dresSelecionadas}`;
      if (responsavelId && tipoResp && codigoUe) {
        path = `${path}/${responsavelId}/${tipoResp}/${codigoUe}`;
      } else if (!responsavelId && tipoResp && !codigoUe) {
        path = `${path}/${tipoResp}`;
      } else if (!responsavelId && tipoResp && codigoUe) {
        path = `${path}/0/${tipoResp}/${codigoUe}`;
      }
    }
    navigate(path);
  }

  function onClickRow(row) {
    if (!permissoesTela.podeAlterar) return;

    onClickEditar(row.responsavelId, row.tipoResponsavelId, row.ueid);
  }

  function onClickNovaAtribuicao() {
    if (!permissoesTela.podeIncluir) return;

    if (dresSelecionadas && !tipoResponsavel) {
      navigate(`${ROUTES.ATRIBUICAO_RESPONSAVEIS}/${dresSelecionadas}/`);
    } else if (dresSelecionadas && tipoResponsavel) {
      navigate(
        `${ROUTES.ATRIBUICAO_RESPONSAVEIS}/${dresSelecionadas}/${tipoResponsavel}/`
      );
    } else {
      navigate(ROUTES.ATRIBUICAO_RESPONSAVEIS);
    }
  }

  function onChangeUesSemSup(e) {
    if (e.target.checked) {
      setUesSemSupervisorCheck(true);
    } else {
      setUesSemSupervisorCheck(false);
    }
  }

  function montarListaAtribuicao(lista) {
    if (lista?.length) {
      const dadosAtribuicao = [];
      lista.forEach(item => {
        const contId = dadosAtribuicao.length + 1;
        dadosAtribuicao.push({
          id: contId,
          atribuicaoId: item.id,
          escola: item.ueNome,
          responsavel: item.responsavelId ? item.responsavel : '',
          responsavelId: item.responsavelId,
          tipoResponsavel: item.tipoResponsavel,
          tipoResponsavelId: item.tipoResponsavelId,
          ueid: item.ueId,
        });
      });
      setListaFiltroAtribuicao(dadosAtribuicao);
      setPaginaAtual(1);
    } else {
      setListaFiltroAtribuicao([]);
      setPaginaAtual(1);
    }
  }

  async function consultarApi(dre, codigoTipo, ue, supervisor, check) {
    setCarregandoLista(true);
    await api
      .get('/v1/supervisores/vinculo-lista', {
        params: {
          dreCodigo: dre,
          tipoCodigo: codigoTipo || tipoResponsavel,
          ueCodigo: ue,
          supervisorId: supervisor,
          ueSemResponsavel: check || uesSemSupervisorCheck,
        },
      })
      .then(dados => {
        montarListaAtribuicao(dados.data);
        setCarregandoLista(false);
      });
  }

  const montaListaUesSemSup = useCallback(
    dre => {
      setSupervisoresSelecionados([]);
      setUeSelecionada('');
      setDesabilitarSupervisor(true);
      consultarApi(
        dre,
        tipoResponsavel,
        ueSelecionada,
        supervisoresSelecionados,
        uesSemSupervisorCheck
      );
    },

    [tipoResponsavel, uesSemSupervisorCheck]
  );

  const obterResponsaveis = useCallback(
    async (dre, tipoResp) => {
      const tipoSelecionado = tipoResp || tipoResponsavel;

      if (!dre || !tipoSelecionado) return;

      setCarregandoResponsavel(true);
      const resposta = await ServicoResponsaveis.obterResponsaveis(
        dre || dresSelecionadas,
        tipoSelecionado
      )
        .catch(e => erros(e))
        .finally(() => {
          setCarregandoResponsavel(false);
        });

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => {
          return {
            ...item,
            descricaoCodigo: `${item?.supervisorNome} - ${item?.supervisorId}`,
          };
        });
        setListaSupervisores(lista);
      } else {
        setListaSupervisores([]);
      }
    },
    [dresSelecionadas, tipoResponsavel]
  );

  async function carregarUes(dre) {
    const ues = await api.get(`/v1/supervisores/lista-ues/${dre}`);
    if (ues.data) {
      setListaUes(ues.data);
    } else {
      setListaUes([]);
    }
  }

  const onChangeDre = useCallback(
    async (dre, changeUe, chamarApi = true, tipoRes) => {
      if (!changeUe) {
        if (listaTipoResponsavel?.length > 1) {
          setTipoResponsavel('');
        }

        setListaSupervisores([]);
        setSupervisoresSelecionados([]);
      }
      setListaUes([]);
      setUeSelecionada('');

      if (dre) {
        if (chamarApi)
          consultarApi(
            dre,
            tipoRes || tipoResponsavel,
            ueSelecionada,
            supervisoresSelecionados
          );
      } else {
        setListaFiltroAtribuicao([]);
        setPaginaAtual(1);
        setUesSemSupervisorCheck(false);
      }

      setDresSelecionadas(dre);
      if (dre) {
        obterResponsaveis(dre, tipoRes || tipoResponsavel);
      }
    },

    [tipoResponsavel, uesSemSupervisorCheck]
  );

  useEffect(() => {
    if (uesSemSupervisorCheck) {
      montaListaUesSemSup(dresSelecionadas);
    } else {
      setSupervisoresSelecionados([]);
      setUeSelecionada('');
      setDesabilitarSupervisor(false);

      if (dresSelecionadas) {
        consultarApi(
          dresSelecionadas,
          tipoResponsavel,
          ueSelecionada,
          supervisoresSelecionados
        );
      }
    }
  }, [uesSemSupervisorCheck, tipoResponsavel]);

  async function onChangeSupervisores(sup) {
    setUesSemSupervisorCheck(false);
    if (sup && sup.length) {
      setUeSelecionada([]);
      setSupervisoresSelecionados(sup);
    } else {
      setSupervisoresSelecionados([]);
      setUeSelecionada([]);
      setListaFiltroAtribuicao([]);
      setPaginaAtual(1);
    }
    consultarApi(
      dresSelecionadas,
      tipoResponsavel,
      ueSelecionada,
      sup.toString(),
      uesSemSupervisorCheck
    );
  }

  async function onChangeUes(ue) {
    if (ue) {
      setDesabilitarSupervisor(true);
      setSupervisoresSelecionados([]);
      setUeSelecionada(ue);
    } else {
      setDesabilitarSupervisor(false);
      onChangeDre(dresSelecionadas, true, false);
    }
    consultarApi(
      dresSelecionadas,
      tipoResponsavel,
      ue,
      supervisoresSelecionados,
      uesSemSupervisorCheck
    );
  }

  const onChangeTipoResponsavel = async valor => {
    if (valor == null) {
      setUesSemSupervisorCheck(false);
    }
    setSupervisoresSelecionados();
    setListaSupervisores([]);
    setTipoResponsavel(valor);
    consultarApi(
      dresSelecionadas,
      valor,
      ueSelecionada,
      supervisoresSelecionados,
      uesSemSupervisorCheck
    );
  };

  const obterTipoResponsavel = useCallback(async () => {
    const resposta = await ServicoResponsaveis.obterTipoReponsavel().catch(e =>
      erros(e)
    );

    if (resposta?.data?.length) {
      setListaTipoResponsavel(resposta.data);
      if (resposta?.data?.length === 1) {
        setTipoResponsavel(resposta.data[0]?.codigo?.toString());
      }
    } else {
      setListaTipoResponsavel([]);
    }
  }, [
    dresSelecionadas,
    ueSelecionada,
    supervisoresSelecionados,
    uesSemSupervisorCheck,
  ]);

  useEffect(() => {
    if (dresSelecionadas && !listaTipoResponsavel?.length) {
      obterTipoResponsavel();
    }
  }, [dresSelecionadas, listaTipoResponsavel, obterTipoResponsavel]);

  useEffect(() => {
    if (tipoResponsavel && dresSelecionadas) {
      obterResponsaveis(dresSelecionadas);
    } else {
      setSupervisoresSelecionados();
      setListaSupervisores([]);
    }
  }, [dresSelecionadas, tipoResponsavel, obterResponsaveis]);

  useEffect(() => {
    if (dresSelecionadas) {
      carregarUes(dresSelecionadas);
    }
  }, [dresSelecionadas]);

  return (
    <>
      <Cabecalho pagina="Atribuição de responsáveis">
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_NOVO}
              label="Nova Atribuição"
              color={Colors.Roxo}
              border
              bold
              disabled={!permissoesTela?.podeIncluir}
              onClick={onClickNovaAtribuicao}
            />
          </Col>
        </Row>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 pb-2">
              <CheckboxComponent
                className="mb-2"
                label="Exibir apenas UEs sem responsável"
                onChangeCheckbox={onChangeUesSemSup}
                disabled={
                  carregandoLista ||
                  carregandoResponsavel ||
                  !dresSelecionadas ||
                  !tipoResponsavel ||
                  !permissoesTela?.podeConsultar ||
                  supervisoresSelecionados?.length > 0
                }
                checked={uesSemSupervisorCheck}
              />
            </div>
            <div className="col-sm-12 col-md-6 pb-2">
              <SelectComponent
                label="Diretoria Regional de Educação (DRE)"
                name="dres-atribuicao-sup"
                id="dres-atribuicao-sup"
                lista={listaDres}
                valueOption="codigo"
                valueText="nome"
                onChange={dre => onChangeDre(dre, false, true)}
                valueSelect={dresSelecionadas}
                placeholder="Diretoria Regional de Educação (DRE)"
                disabled={
                  carregandoLista ||
                  carregandoResponsavel ||
                  listaDres?.length === 1 ||
                  !permissoesTela.podeConsultar
                }
                allowClear={false}
                showSearch
              />
            </div>
            <div className="col-sm-12 col-md-6 pb-2">
              <SelectComponent
                id="SGP_SELECT_TIPO_RESPONSAVEL"
                label="Tipo de responsável"
                lista={listaTipoResponsavel}
                valueOption="codigo"
                valueText="descricao"
                disabled={
                  carregandoLista ||
                  carregandoResponsavel ||
                  !dresSelecionadas ||
                  listaTipoResponsavel?.length === 1 ||
                  !permissoesTela?.podeConsultar
                }
                onChange={onChangeTipoResponsavel}
                valueSelect={tipoResponsavel}
                placeholder="Tipo de responsável"
                showSearch
              />
            </div>
            <div className="col-md-12 pb-2">
              <Loader loading={carregandoResponsavel} ignorarTip>
                <SelectComponent
                  label="Responsável"
                  name="supervisores-list"
                  id="supervisores-list"
                  lista={listaSupervisores}
                  valueOption="supervisorId"
                  valueText="descricaoCodigo"
                  onChange={onChangeSupervisores}
                  valueSelect={supervisoresSelecionados}
                  multiple
                  placeholder="SELECIONE O RESPONSÁVEL"
                  disabled={
                    carregandoLista ||
                    carregandoResponsavel ||
                    !tipoResponsavel ||
                    desabilitarSupervisor ||
                    !permissoesTela.podeConsultar
                  }
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-6 pb-2">
              <SelectComponent
                label="Unidade Escolar (UE)"
                name="ues-list"
                id="ues-list"
                lista={listaUes}
                valueOption="codigo"
                valueText="nome"
                onChange={onChangeUes}
                valueSelect={ueSelecionada || []}
                placeholder="Unidade Escolar (UE)"
                showSearch
                disabled={
                  carregandoLista ||
                  carregandoResponsavel ||
                  !dresSelecionadas ||
                  !permissoesTela.podeConsultar
                }
              />
            </div>

            <div className="col-md-12 pt-4">
              <Loader loading={carregandoLista}>
                <DataTable
                  onClickRow={permissoesTela.podeAlterar && onClickRow}
                  columns={columns}
                  dataSource={listaFiltroAtribuicao}
                  semHover
                  pagination={{
                    pageSize: numeroRegistrosPagina,
                    total: listaFiltroAtribuicao?.length,
                    defaultCurrent: 1,
                    current: paginaAtual,
                    locale: { items_per_page: '' },
                    onChange: p => setPaginaAtual(p),
                    onShowSizeChange: p => setNumeroRegistrosPagina(p.pageSize),
                  }}
                />
              </Loader>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
