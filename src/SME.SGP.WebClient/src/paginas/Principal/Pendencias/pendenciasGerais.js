import React, { useCallback, useEffect, useState } from 'react';
import shortid from 'shortid';
import { CampoTexto, Loader, Base } from '~/componentes';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Paginacao from '~/componentes-sgp/Paginacao/paginacao';
import Card from '~/componentes/card';
import CardCollapse from '~/componentes/cardCollapse';
import SelectComponent from '~/componentes/select';
import { TOKEN_EXPIRADO } from '~/constantes';
import { erros, ServicoRelatorioPendencias } from '~/servicos';
import ServicoPendencias from '~/servicos/Paginas/ServicoPendencias';
import { onchangeMultiSelect } from '~/utils/funcoes/gerais';
import LocalizadorPadrao from '~/componentes/LocalizadorPadrao';
import { Titulo } from '~/paginas/CalendarioEscolar/Calendario/index.css';

const PendenciasGerais = () => {
  const [carregando, setCarregando] = useState(false);
  const [dadosPendencias, setDadosPendencias] = useState([]);
  const [numeroRegistros, setNumeroRegistros] = useState(0);
  const [collapseExpandido, setCollapseExpandido] = useState();
  const [tipoPendenciaGrupo, setTipoPendenciaGrupo] = useState();
  const [codigoTurma, setCodigoTurma] = useState();
  const [titulo, setTitulo] = useState();
  const [listaTipoPendenciaGrupos, setListaTipoPendenciaGrupos] = useState(
    true
  );
  const [listaTurmas, setListaTurmas] = useState([]);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);

  const configCabecalho = {
    altura: '45px',
    corBorda: Base.Roxo,
  };

  const obterPendencias = useCallback(async paginaAtual => {
    setCarregando(true);
    const resposta = await ServicoPendencias.obterPendenciasListaPaginada(
      codigoTurma,
      tipoPendenciaGrupo,
      titulo,
      paginaAtual
    )
      .catch(e => {
        if (e?.message.indexOf(TOKEN_EXPIRADO) >= 0) return;
        erros(e);
      })
      .finally(() => setCarregando(false));

    if (resposta?.data?.items) {
      setDadosPendencias(resposta.data);
      setNumeroRegistros(resposta.data.totalRegistros);
    } else {
      setDadosPendencias([]);
    }
    setCollapseExpandido();
  }, [codigoTurma, tipoPendenciaGrupo, titulo]);

  useEffect(() => {
    obterPendencias();
  }, [obterPendencias]);

  const titutoPersonalizado = item => {
    return (
      <div className="row pl-2">
        {item.tipo ? (
          <>
            <span style={{ color: Base.Roxo }}>Tipo:</span>
            {item.tipo}
            <span className="mr-3 ml-3">|</span>
          </>
        ) : (
          ''
        )}
        {item.turma ? (
          <>
            <span style={{ color: Base.Roxo }}>Turma:</span>
            {item.turma}
            <span className="mr-3 ml-3">|</span>
          </>
        ) : (
          ''
        )}
        {item.bimestre ? (
          <>
            <span style={{ color: Base.Roxo }}>Bimestre:</span>
            {item.bimestre}
            <span className="mr-3 ml-3">|</span>
          </>
        ) : (
          ''
        )}
        {item.titulo ? (
          <>
            <span style={{ color: Base.Roxo }}>Título:</span>
            {item.titulo}
          </>
        ) : (
          ''
        )}
      </div>
    );
  };
  
  const onChangeTipoPendenciaGrupo = valor => {
    setTipoPendenciaGrupo(valor);
    //setClicouBotaoGerar(false);
  };

  const obterTurmas = useCallback(async () => {
    setCarregandoTurmas(true);
    const retorno = await ServicoPendencias.buscarTurmas(
      codigoTurma
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTurmas(false));

    if (retorno?.data?.length) {
      const lista = retorno?.data;
      setListaTurmas(lista);
      if (lista.length === 1) {
        setCodigoTurma([String(lista[0].codigo)]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoTurma]);

  useEffect(() => {
    if (tipoPendenciaGrupo) {
      obterTurmas();
    } else {
      setCodigoTurma();
      setListaTurmas([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoPendenciaGrupo, obterTurmas]);

  const [
    carregandoTipoPendenciaGrupo,
    setCarregandoTipoPendenciaGrupo,
  ] = useState(false);

  const obterTipoPendenciaGrupo = useCallback(async () => {
    setCarregandoTipoPendenciaGrupo(true);
    const retorno = await ServicoRelatorioPendencias.obterTipoPendenciasGrupos({
      opcaoTodos: false,
    })
      .catch(e => erros(e))
      .finally(() => setCarregandoTipoPendenciaGrupo(false));
    const dados = retorno?.data?.length ? retorno?.data : [];
    setListaTipoPendenciaGrupos(dados);
  }, []);

  useEffect(() => {
    obterTipoPendenciaGrupo();
    setTipoPendenciaGrupo();
    setListaTipoPendenciaGrupos([]);
  }, [obterTipoPendenciaGrupo]);

  const onChangeTurma = valor => setCodigoTurma(valor);
  const onChangeTitulo = valor => {
    setTitulo(valor.target.value);
  }

  return (
    <Loader loading={carregando}>
      <Card className="mb-4 mt-4">
        <div className="col-md-12">
          <div className="col-md-12 pl-1 mb-3">
            <Cabecalho pagina="Pendências" />
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-2 mb-2">
              <Loader loading={carregandoTipoPendenciaGrupo} ignorarTip>
                <SelectComponent
                  id="tipo"
                  label="Tipo"
                  name="tipoId"
                  lista={listaTipoPendenciaGrupos}
                  valueOption="valor"
                  valueText="descricao"
                  valueSelect={tipoPendenciaGrupo}
                  placeholder="Selecione o tipo"
                  disabled=""
                  allowClear={false}
                  onChange={valores => {
                    onchangeMultiSelect(
                      valores,
                      tipoPendenciaGrupo,
                      onChangeTipoPendenciaGrupo
                    );
                  }}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-2 mb-2">
              <Loader loading={carregandoTurmas} ignorarTip>
                <SelectComponent
                  id="turma"
                  lista={listaTurmas}
                  label="Turma"
                  name="turmaId"
                  valueOption="codigo"
                  valueText="nomeFiltro"
                  valueSelect={codigoTurma}
                  onChange={onChangeTurma}
                  placeholder="Selecione a turma"
                  disabled={!tipoPendenciaGrupo || listaTurmas?.length === 1}
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-6 mb-2">
              <CampoTexto
                name="nomeTitulo"
                id="nomeTitulo"
                label="Título"
                placeholder="Nome do Título"
                iconeBusca
                allowClear
                onChange={onChangeTitulo}
                value={titulo}
                desabilitado={!tipoPendenciaGrupo || !codigoTurma}
              />
            </div>
          </div>
          <div className="col-md-12">
            {dadosPendencias?.items?.length ? (
              dadosPendencias.items.map((item, index) => {
                return (
                  <div key={shortid.generate()} className="mb-3">
                    <CardCollapse
                      key={`pendencia-${shortid.generate()}-collapse-key`}
                      titulo={titutoPersonalizado(item)}
                      indice={`pendencia-${shortid.generate()}-collapse-indice`}
                      alt={`pendencia-${shortid.generate()}-alt`}
                      configCabecalho={configCabecalho}
                      styleCardBody={{ backgroundColor: Base.CinzaBadge }}
                      show={collapseExpandido === index}
                      onClick={() => {
                        setCollapseExpandido(index);
                      }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.detalhe,
                        }}
                      />
                    </CardCollapse>
                  </div>
                );
              })
            ) : (
              <div className="text-center">Você não tem nenhuma pendência.</div>
            )}
          </div>

          {dadosPendencias?.items?.length && numeroRegistros ? (
            <div className="col-md-12">
              <Paginacao
                numeroRegistros={numeroRegistros}
                onChangePaginacao={obterPendencias}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </Card>
    </Loader>
  );
};

export default PendenciasGerais;
