import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Button, Card, Colors, Loader, SelectComponent } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
  SGP_BUTTON_VOLTAR,
  SGP_SELECT_DRE,
} from '~/componentes-sgp/filtro/idsCampos';
import Auditoria from '~/componentes/auditoria';
import RotasDto from '~/dtos/rotasDto';
import { store } from '~/redux';
import {
  AbrangenciaServico,
  confirmar,
  erros,
  history,
  setBreadcrumbManual,
  sucesso,erro,
  verificaSomenteConsulta,
} from '~/servicos';
import ServicoResponsaveis from '~/servicos/Paginas/Gestao/Responsaveis/ServicoResponsaveis';
import ListaTransferenciaResponsaveis from './listaTransferenciaResponsaveis';

const AtribuicaoResponsaveisCadastro = () => {
  const { usuario } = store.getState();
  const permissoesTela =
    usuario.permissoes[RotasDto.ATRIBUICAO_RESPONSAVEIS_LISTA];

  const routeMatch = useRouteMatch();

  const [carregandoDres, setCarregandoDres] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [dreId, setDreId] = useState();

  const [tipoResponsavel, setTipoResponsavel] = useState();
  const [listaTipoResponsavel, setListaTipoResponsavel] = useState([]);
  const [carregandoTipoResponsavel, setCarregandoTipoResponsavel] = useState(
    false
  );

  const [responsavel, setResponsavel] = useState();
  const [codigoUeSelecionadoGrid, setCodigoUeSelecionadoGrid] = useState("0");
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
    if (routeMatch.params?.dreId) {
      setBreadcrumbManual(
        routeMatch.url,
        'Editar Atribuição',
        RotasDto.ATRIBUICAO_RESPONSAVEIS_LISTA
      );
    }
  }, [routeMatch]);

  const limparTela = () => {
    if (listaTipoResponsavel?.length > 1) {
      setTipoResponsavel();
    }
    if (listaDres?.length > 1) {
      setDreId();
    }
    setListaResponsavel([]);
    setUesAtribuidas([]);
    setResponsavel("");
    setCodigoUeSelecionadoGrid("0");
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
      .then(result => {
        sucesso('Atribuição realizada com sucesso.');
        history.push(RotasDto.ATRIBUICAO_RESPONSAVEIS_LISTA);
      })
      .catch(e => {
        if(e.response.status === 601){
          erro(e.response.data.mensagem);
        }else{
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
        history.push(RotasDto.ATRIBUICAO_RESPONSAVEIS_LISTA);
      }
    } else {
      history.push(RotasDto.ATRIBUICAO_RESPONSAVEIS_LISTA);
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
    setCodigoUeSelecionadoGrid("0");
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
      } else if (routeMatch.params?.dreId) {
        setDreId(routeMatch.params.dreId);
      }

      setListaDres(retorno.data);
    } else {
      setListaDres([]);
      setDreId();
    }
  }, [routeMatch]);

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
      if (resposta?.data?.length === 1) {
        setTipoResponsavel(resposta.data[0].descricao);
      } else if (routeMatch.params?.tipoResponsavel) {
        setTipoResponsavel(routeMatch.params.tipoResponsavel);
        setCodigoUeSelecionadoGrid(routeMatch.params?.codigoUe);
      }

      setListaTipoResponsavel(resposta.data);
    } else {
      setListaTipoResponsavel([]);
    }
  }, [routeMatch]);
  useEffect(() => {
    if (dreId) {
      obterTipoResponsavel();
      if(dreId && responsavel != undefined){
        obterListaUES();
      }
    } else {
      setTipoResponsavel();
      setResponsavel();
      setListaTipoResponsavel([]);
    }
  }, [dreId, obterTipoResponsavel]);

  const onChangeResponsavel = valor => {
    setResponsavel(valor);
  };

  const obterResponsaveis = useCallback(async () => {
    setResponsavel(undefined);
    setCarregandoResponsavel(true);
    setListaResponsavel([]);
    if(tipoResponsavel ==undefined){
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
      } else if (routeMatch.params?.supervisorId) {
        if(routeMatch.params.supervisorId > 0 && routeMatch.params.tipoResponsavel == tipoResponsavel)
           setResponsavel(routeMatch.params.supervisorId);
      }
      setListaResponsavel(lista);
    } else {
      setListaResponsavel([]);
    }
    setCarregandoResponsavel(false);

  }, [dreId, tipoResponsavel, routeMatch]);

  useEffect(() => {
    if (dreId && tipoResponsavel != undefined) {
      obterResponsaveis();
    } else {
      setResponsavel();
      setListaResponsavel([]);
      setUesAtribuidas([]);
    }
  }, [dreId, tipoResponsavel, obterResponsaveis]);

  const obterListaUesAtribuidas = useCallback(async (tipoRes) => {
    if(responsavel == undefined)
      return;
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
  }, [dreId, responsavel]);

  const obterListaUES = useCallback(async (tipoResp) => {
    setCarregandoUes(true);
    let tipo = tipoResp ?? tipoResponsavel
    if(dreId && (tipo == undefined)){
      setCarregandoUes(false);
      return false;
    }

    const resposta = await ServicoResponsaveis.obterUesSemAtribuicao(
      dreId,
      tipo
    ).catch(e => erros(e));

    if (resposta?.data?.length) {
      const lista = resposta.data.map(item => {
        return { ...item, id: item.codigo };
      });
      setUesSemAtribuicao(lista);
    } else {
      setUesSemAtribuicao([]);
    }
    if (dreId && tipo != undefined) {
      await obterListaUesAtribuidas(tipo);
    }

    setCarregandoUes(false);
  }, [dreId, responsavel, obterListaUesAtribuidas]);

  useEffect(() => {
    if (dreId && responsavel != undefined) {
      obterListaUES();
    } else {
      setUesSemAtribuicao([]);
      setResponsavel();
      setUesAtribuidas([]);
    }
  }, [dreId, responsavel, obterListaUES]);

  useEffect(() => {
    if (!responsavel) setAuditoria({});
  }, [responsavel]);

  return (
    <>
      <Cabecalho pagina="Atribuição de responsáveis" />
      <Card>
        <Col span={24}>
          <Row gutter={[16, 8]} type="flex" justify="end">
            <Col>
              <Button
                id={SGP_BUTTON_VOLTAR}
                label="Voltar"
                icon="arrow-left"
                color={Colors.Azul}
                border
                onClick={onClickVoltar}
              />
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
                    listaTipoResponsavel?.length === 1 ||
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
                  ueSelecionaGrid = {codigoUeSelecionadoGrid}
                  temResponsavel = {responsavel != undefined}
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
