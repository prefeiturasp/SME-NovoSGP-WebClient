import { Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import shortid from 'shortid';
import { CampoTexto, Loader, Base } from '~/componentes';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Paginacao from '~/componentes-sgp/Paginacao/paginacao';
import Card from '~/componentes/card';
import CardCollapse from '~/componentes/cardCollapse';
import SelectComponent from '~/componentes/select';
import { erros, ServicoRelatorioPendencias } from '~/servicos';
import ServicoPendencias from '~/servicos/Paginas/ServicoPendencias';
import {
  SGP_SELECT_TIPO_PENDENCIA,
  SGP_SELECT_TURMA,
  SGP_SELECT_NOME_TIPO_PENDENCIA,
} from '~/constantes/ids/select';
import { Container, TextoTitulo } from './pendenciasGerais.css';

const PendenciasGerais = () => {
  const [carregando, setCarregando] = useState(false);
  const [dadosPendencias, setDadosPendencias] = useState([]);
  const [numeroRegistros, setNumeroRegistros] = useState(0);
  const [numeroRegistrosPagina, setNumeroRegistrosPagina] = useState(10);
  const [collapseExpandido, setCollapseExpandido] = useState();
  const [tipoPendenciaGrupo, setTipoPendenciaGrupo] = useState();
  const [codigoTurma, setCodigoTurma] = useState();
  const [titulo, setTitulo] = useState('');
  const [tituloExibicao, setTituloExibicao] = useState('');
  const [listaTipoPendenciaGrupos, setListaTipoPendenciaGrupos] = useState(
    true
  );
  const [listaTurmas, setListaTurmas] = useState([]);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregouTurmas, setCarregouTurmas] = useState(false);
  const [
    carregandoTipoPendenciaGrupo,
    setCarregandoTipoPendenciaGrupo,
  ] = useState(false);
  const [timeoutTitulo, setTimeoutTitulo] = useState();

  const configCabecalho = {
    altura: '45px',
    corBorda: Base.Roxo,
  };

  const obterPendencias = useCallback(
    async (paginaAtual, numeroPag) => {
      if (carregouTurmas) {
        setCarregando(true);
        const resposta = await ServicoPendencias.obterPendenciasListaPaginada(
          codigoTurma,
          tipoPendenciaGrupo,
          titulo,
          paginaAtual,
          numeroPag
        )
          .catch(e => erros(e))
          .finally(() => setCarregando(false));

        if (resposta?.data?.items) {
          setDadosPendencias(resposta.data);
          setNumeroRegistros(resposta.data.totalRegistros);
        } else {
          setDadosPendencias([]);
        }
        setCollapseExpandido();
      }
    },
    [carregouTurmas, codigoTurma, tipoPendenciaGrupo, titulo]
  );

  const onChangePaginacao = async pagina => {
    obterPendencias(pagina, numeroRegistrosPagina);
  };

  const onChangeNumeroLinhas = async (paginaAtual, numeroLinhas) => {
    setNumeroRegistros(numeroLinhas);
    setNumeroRegistrosPagina(numeroLinhas);
    obterPendencias(paginaAtual, numeroLinhas);
  };

  const obterTurmas = async () => {
    setCarregandoTurmas(true);
    const retorno = await ServicoPendencias.buscarTurmas()
      .catch(e => erros(e))
      .finally(() => setCarregandoTurmas(false));

    if (retorno?.data?.length) {
      const lista = retorno?.data;
      setListaTurmas(lista);
    }
    setCarregouTurmas(true);
  };

  const obterTipoPendenciaGrupo = async () => {
    setCarregandoTipoPendenciaGrupo(true);
    const retorno = await ServicoRelatorioPendencias.obterTipoPendenciasGrupos({
      opcaoTodos: false,
    })
      .catch(e => erros(e))
      .finally(() => setCarregandoTipoPendenciaGrupo(false));
    const dados = retorno?.data?.length ? retorno?.data : [];
    setListaTipoPendenciaGrupos(dados);
  };

  useEffect(() => {
    obterTurmas();
    obterTipoPendenciaGrupo();
    setTipoPendenciaGrupo();
    setListaTipoPendenciaGrupos([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeTurma = valor => setCodigoTurma(valor);
  const onChangeTipoPendenciaGrupo = valor => setTipoPendenciaGrupo(valor);

  useEffect(() => {
    if (titulo.length >= 3 || titulo.length === 0) obterPendencias();
  }, [obterPendencias, titulo]);

  const validarObterPendenciasDebounce = useCallback(
    (texto, onChangeFiltros) => {
      if (timeoutTitulo) {
        clearTimeout(timeoutTitulo);
      }
      const timeout = setTimeout(() => {
        onChangeFiltros(texto);
      }, 700);

      setTimeoutTitulo(timeout);
    },
    [timeoutTitulo]
  );

  const onChangeDebounce = (text, setValue) => {
    if (text?.length >= 3 || !text) {
      validarObterPendenciasDebounce(text, setValue);
    }
  };

  const onChangeTitulo = valor => {
    setTituloExibicao(valor.target.value);
    onChangeDebounce(valor.target.value, setTitulo);
  };

  const titutoPersonalizado = item => {
    return (
      <Container>
        {item.tipo ? (
          <div className="text-nowrap">
            <span style={{ color: Base.Roxo }}>Tipo:&nbsp;</span>
            {item.tipo}
            <span className="mr-3 ml-3">|</span>
          </div>
        ) : (
          ''
        )}
        {item.turma ? (
          <div className="text-nowrap">
            <span style={{ color: Base.Roxo }}>Turma:&nbsp;</span>
            {item.turma}
            <span className="mr-3 ml-3">|</span>
          </div>
        ) : (
          ''
        )}
        {item.bimestre ? (
          <div className="text-nowrap">
            <span style={{ color: Base.Roxo }}>Bimestre:&nbsp;</span>
            {item.bimestre}
            <span className="mr-3 ml-3">|</span>
          </div>
        ) : (
          ''
        )}
        {item.titulo ? (
          <TextoTitulo>
            <span style={{ color: Base.Roxo }}>Título:&nbsp;</span>
            <Tooltip title={item.titulo}>{item.titulo}</Tooltip>
          </TextoTitulo>
        ) : (
          ''
        )}
      </Container>
    );
  };

  return (
    <Loader loading={carregando}>
      <Card className="mb-4 mt-4">
        <div className="col-md-12">
          <div className="col-md-12 mb-3">
            <Cabecalho
              pagina="Pendências"
              style={{ background: '#fff' }}
              removeAffix
            />
          </div>
          <div className="row justify-content-left px-3">
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-2 mb-2">
              <Loader loading={carregandoTipoPendenciaGrupo} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_TIPO_PENDENCIA}
                  label="Tipo"
                  name="tipoId"
                  lista={listaTipoPendenciaGrupos}
                  valueOption="valor"
                  valueText="descricao"
                  valueSelect={tipoPendenciaGrupo}
                  placeholder="Selecione o tipo"
                  allowClear
                  onChange={onChangeTipoPendenciaGrupo}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-2 mb-2">
              <Loader loading={carregandoTurmas} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_TURMA}
                  lista={listaTurmas}
                  label="Turma"
                  name="turmaId"
                  valueOption="codigo"
                  valueText="nomeFiltro"
                  valueSelect={codigoTurma}
                  onChange={onChangeTurma}
                  placeholder="Selecione a turma"
                  disabled={listaTurmas?.length === 0}
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-6 mb-2">
              <CampoTexto
                name="nomeTitulo"
                id={SGP_SELECT_NOME_TIPO_PENDENCIA}
                label="Título"
                placeholder="Digite o título da pendência"
                iconeBusca
                allowClear
                onChange={onChangeTitulo}
                value={tituloExibicao}
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
                        // eslint-disable-next-line react/no-danger
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
                mostrarNumeroLinhas
                numeroRegistros={numeroRegistros}
                onChangePaginacao={onChangePaginacao}
                onChangeNumeroLinhas={onChangeNumeroLinhas}
                pageSize={numeroRegistrosPagina}
                pageSizeOptions={['10', '20', '50', '100']}
                locale={{ items_per_page: '' }}
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
