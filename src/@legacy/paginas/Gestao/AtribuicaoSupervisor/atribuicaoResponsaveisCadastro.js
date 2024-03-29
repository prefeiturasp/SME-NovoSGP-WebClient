import { store } from '@/core/redux';
import { Col, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Colors, Loader, SelectComponent } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Auditoria from '~/componentes/auditoria';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import { SGP_SELECT_DRE } from '~/constantes/ids/select';
import {
  AbrangenciaServico,
  confirmar,
  erro,
  erros,
  setBreadcrumbManual,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import ServicoResponsaveis from '~/servicos/Paginas/Gestao/Responsaveis/ServicoResponsaveis';
import ListaTransferenciaResponsaveis from './listaTransferenciaResponsaveis';
import { ROUTES } from '@/core/enum/routes';

const AtribuicaoResponsaveisCadastro = () => {
  const { usuario } = store.getState();
  const location = useLocation();
  const permissoesTela =
    usuario.permissoes[ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA];

  const paramsRoute = useParams();
  const navigate = useNavigate();

  const dreIDParams = paramsRoute?.dreId;

  const [carregandoDres, setCarregandoDres] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [dreId, setDreId] = useState();

  const [tipoResponsavel, setTipoResponsavel] = useState();
  const [listaTipoResponsavel, setListaTipoResponsavel] = useState([]);
  const [carregandoTipoResponsavel, setCarregandoTipoResponsavel] =
    useState(false);

  const [responsavel, setResponsavel] = useState();
  const [codigoUeSelecionadoGrid, setCodigoUeSelecionadoGrid] = useState('0');
  const [listaResponsavel, setListaResponsavel] = useState([]);
  const [carregandoResponsavel, setCarregandoResponsavel] = useState(false);

  const [uesSemAtribuicao, setUesSemAtribuicao] = useState([]);
  const [uesAtribuidas, setUesAtribuidas] = useState([]);
  const [carregandoUes, setCarregandoUes] = useState(false);

  const [modoEdicao, setModoEdicao] = useState(false);

  const [auditoria, setAuditoria] = useState({});

  useEffect(() => {
    verificaSomenteConsulta(permissoesTela);
  }, [permissoesTela]);

  useEffect(() => {
    if (dreIDParams) {
      setBreadcrumbManual(
        ROUTES.ATRIBUICAO_RESPONSAVEIS,
        'Editar Atribuição',
        ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA
      );
    }
  }, [paramsRoute]);

  const limparTela = () => {
    if (listaTipoResponsavel?.length > 1) {
      setTipoResponsavel();
    }
    if (listaDres?.length > 1) {
      setDreId();
    }
    setListaResponsavel([]);
    setUesAtribuidas([]);
    setResponsavel('');
    setCodigoUeSelecionadoGrid('0');
    setModoEdicao(false);
  };

  const salvarAtribuicao = async () => {
    const atribuicao = {
      dreId,
      responsavelId: responsavel,
      uesIds: uesAtribuidas?.map?.(item => item?.codigo) || [],
      tipoResponsavelAtribuicao: tipoResponsavel,
    };
    ServicoResponsaveis.salvarAtribuicao(atribuicao)
      .then(() => {
        sucesso('Atribuição realizada com sucesso.');
        navigate(ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA);
      })
      .catch(e => {
        if (e.response.status === 601) {
          erro(e.response.data.mensagem);
        } else {
          erros(e);
        }
      });
  };

  const onClickVoltar = async () => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmado) {
        salvarAtribuicao();
      } else {
        navigate(ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA);
      }
    } else {
      navigate(ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA);
    }
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        limparTela();
      }
    } else {
      limparTela();
    }
  };

  const onChangeDre = valor => {
    setListaResponsavel([]);
    setResponsavel();
    setTipoResponsavel();
    setCodigoUeSelecionadoGrid('0');
    setDreId(valor);
    setUesAtribuidas([]);
  };

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const retorno = await AbrangenciaServico.buscarDres()
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));

    if (retorno?.data?.length) {
      if (retorno.data.length === 1) {
        setDreId(retorno.data[0].codigo);
      } else if (dreIDParams) {
        setDreId(dreIDParams);
      }

      setListaDres(retorno.data);
    } else {
      setListaDres([]);
      setDreId();
    }
  }, [paramsRoute]);

  useEffect(() => {
    obterDres();
  }, [obterDres]);

  const onChangeTipoResponsavel = valor => {
    setTipoResponsavel(valor);
  };

  const obterTipoResponsavel = useCallback(async () => {
    setCarregandoTipoResponsavel(true);
    const resposta = await ServicoResponsaveis.obterTipoReponsavel(false)
      .catch(e => erros(e))
      .finally(() => setCarregandoTipoResponsavel(false));

    if (resposta?.data?.length) {
      setListaTipoResponsavel(resposta.data);
      if (resposta?.data?.length === 1) {
        setTipoResponsavel(resposta.data[0]?.codigo?.toString());
      } else if (paramsRoute?.tipoResponsavel) {
        setTipoResponsavel(paramsRoute.tipoResponsavel);
        setCodigoUeSelecionadoGrid(paramsRoute?.codigoUe);
      }
    } else {
      setListaTipoResponsavel([]);
    }
  }, [paramsRoute]);

  useEffect(() => {
    obterTipoResponsavel();
  }, [obterTipoResponsavel]);

  const onChangeResponsavel = valor => {
    setResponsavel(valor);
  };

  const obterResponsaveis = useCallback(async () => {
    setResponsavel(undefined);
    setCarregandoResponsavel(true);
    setListaResponsavel([]);
    if (!tipoResponsavel) {
      setListaResponsavel([]);
      setCarregandoResponsavel(false);
      return;
    }
    const resposta = await ServicoResponsaveis.obterResponsaveis(
      dreId,
      tipoResponsavel
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoResponsavel(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.map(item => {
        return {
          ...item,
          descricaoCodigo: `${item?.supervisorNome} - ${item?.supervisorId}`,
        };
      });

      if (lista?.length === 1) {
        setResponsavel(lista[0].supervisorId);
      } else if (paramsRoute?.supervisorId) {
        if (
          paramsRoute.supervisorId > 0 &&
          String(paramsRoute.tipoResponsavel) === String(tipoResponsavel)
        )
          setResponsavel(paramsRoute.supervisorId);
      }
      setListaResponsavel(lista);
    } else {
      setListaResponsavel([]);
    }
    setCarregandoResponsavel(false);
  }, [dreId, tipoResponsavel, paramsRoute]);

  useEffect(() => {
    if (dreId && tipoResponsavel) {
      obterResponsaveis();
    } else {
      setResponsavel();
      setListaResponsavel([]);
      setUesAtribuidas([]);
    }
  }, [dreId, tipoResponsavel, obterResponsaveis]);

  const obterListaUesAtribuidas = useCallback(
    async tipoRes => {
      if (!responsavel) return false;
      const resposta = await ServicoResponsaveis.obterUesAtribuidas(
        responsavel,
        dreId,
        tipoRes
      ).catch(e => erros(e));

      if (resposta?.data?.[0]?.criadoEm) {
        let lista = [];

        if (resposta.data?.length) {
          lista = resposta.data.map(item => {
            return { ...item, id: item.codigo };
          });
        } else {
          setUesAtribuidas([]);
        }
        setAuditoria({
          criadoPor: resposta.data[0].criadoPor,
          criadoEm: resposta.data[0].criadoEm,
          criadoRf: resposta.data[0].criadoRF,
          alteradoPor: resposta.data[0].alteradoPor,
          alteradoEm: resposta.data[0].alteradoEm,
          alteradoRf: resposta.data[0].alteradoRF,
        });
        setUesAtribuidas(lista);
      } else {
        setUesAtribuidas([]);
        setAuditoria({});
      }
      return true;
    },
    [dreId, responsavel]
  );

  const obterListaUES = useCallback(
    async tipoResp => {
      setCarregandoUes(true);
      if (dreId && !tipoResp) {
        setCarregandoUes(false);
        return;
      }

      const resposta = await ServicoResponsaveis.obterUesSemAtribuicao(
        dreId,
        tipoResponsavel
      ).catch(e => erros(e));

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => {
          return { ...item, id: item.codigo };
        });
        setUesSemAtribuicao(lista);
      } else {
        setUesSemAtribuicao([]);
      }
      if (dreId && tipoResponsavel) {
        await obterListaUesAtribuidas(tipoResponsavel);
      }

      setCarregandoUes(false);
    },

    [dreId, responsavel, obterListaUesAtribuidas]
  );

  useEffect(() => {
    if (dreId) {
      if (dreId && responsavel) {
        obterListaUES();
      }
    } else {
      setTipoResponsavel();
      setResponsavel();
    }
  }, [dreId]);

  useEffect(() => {
    if (dreId && responsavel) {
      obterListaUES(tipoResponsavel);
    } else {
      setUesSemAtribuicao([]);
      setResponsavel();
      setUesAtribuidas([]);
    }
  }, [dreId, responsavel, obterListaUES]);

  useEffect(() => {
    if (!responsavel) setAuditoria({});
  }, [responsavel]);

  useEffect(() => {
    if (!responsavel) setAuditoria({});
  }, [responsavel]);

  useEffect(() => {
    if (dreIDParams) {
      setBreadcrumbManual(
        location.pathname,
        '',
        `${ROUTES.ATRIBUICAO_RESPONSAVEIS}`
      );
    }
  }, [dreIDParams, location]);

  return (
    <>
      <Cabecalho pagina="Atribuição de responsáveis">
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_CANCELAR}
              label="Cancelar"
              color={Colors.Azul}
              border
              bold
              onClick={() => onClickCancelar()}
              disabled={!dreId || !modoEdicao}
            />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_SALVAR}
              label="Salvar"
              color={Colors.Roxo}
              bold
              onClick={() => salvarAtribuicao()}
              disabled={
                !permissoesTela.podeIncluir && !permissoesTela.podeAlterar
              }
            />
          </Col>
        </Row>
      </Cabecalho>
      <Card padding="24px 24px">
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col sm={24} md={12}>
              <Loader loading={carregandoDres} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_DRE}
                  label="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="codigo"
                  valueText="nome"
                  disabled={
                    !permissoesTela.podeConsultar || listaDres?.length === 1
                  }
                  onChange={onChangeDre}
                  valueSelect={dreId}
                  placeholder="Diretoria Regional De Educação (DRE)"
                  showSearch
                  allowClear={false}
                />
              </Loader>
            </Col>
            <Col sm={24} md={12}>
              <Loader loading={carregandoTipoResponsavel} ignorarTip>
                <SelectComponent
                  id="SGP_SELECT_TIPO_RESPONSAVEL"
                  label="Tipo de responsável"
                  lista={listaTipoResponsavel}
                  valueOption="codigo"
                  valueText="descricao"
                  disabled={
                    !dreId ||
                    (tipoResponsavel && listaTipoResponsavel?.length === 1) ||
                    !permissoesTela.podeConsultar
                  }
                  onChange={onChangeTipoResponsavel}
                  valueSelect={tipoResponsavel}
                  placeholder="Tipo de responsável"
                  showSearch
                />
              </Loader>
            </Col>
            <Col sm={24} md={12}>
              <Loader loading={carregandoResponsavel} ignorarTip>
                <SelectComponent
                  id="SGP_SELECT_RESPONSAVEL"
                  label="Responsável"
                  lista={listaResponsavel}
                  valueOption="supervisorId"
                  valueText="descricaoCodigo"
                  disabled={
                    !dreId ||
                    !tipoResponsavel ||
                    listaResponsavel?.length === 1 ||
                    !permissoesTela.podeConsultar
                  }
                  onChange={onChangeResponsavel}
                  valueSelect={responsavel}
                  placeholder="Responsável"
                  showSearch
                />
              </Loader>
            </Col>
            <Col sm={24}>
              <Loader loading={carregandoUes} ignorarTip>
                <ListaTransferenciaResponsaveis
                  ueSelecionaGrid={codigoUeSelecionadoGrid}
                  temResponsavel={!!responsavel}
                  podeConsultar={permissoesTela.podeConsultar}
                  dadosEsquerda={
                    !carregandoUes
                      ? uesSemAtribuicao?.length
                        ? uesSemAtribuicao
                        : []
                      : []
                  }
                  dadosDireita={!carregandoUes ? uesAtribuidas : []}
                  setDadosEsquerda={valores => {
                    setUesSemAtribuicao(valores);
                    setModoEdicao(true);
                  }}
                  setDadosDireita={valores => {
                    setUesAtribuidas(valores);
                    setModoEdicao(true);
                  }}
                />
              </Loader>
            </Col>
          </Row>
          <Auditoria
            className="ml-0"
            criadoEm={auditoria.criadoEm}
            criadoPor={auditoria.criadoPor}
            criadoRf={auditoria.criadoRf}
            alteradoPor={auditoria.alteradoPor}
            alteradoEm={auditoria.alteradoEm}
            alteradoRf={auditoria.alteradoRf}
          />
        </Col>
      </Card>
    </>
  );
};

export default AtribuicaoResponsaveisCadastro;
