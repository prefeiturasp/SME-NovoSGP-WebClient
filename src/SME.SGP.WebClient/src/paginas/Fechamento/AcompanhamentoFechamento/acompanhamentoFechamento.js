import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from 'antd';

import {
  Base,
  Button,
  Card,
  Colors,
  Label,
  Loader,
  PainelCollapse,
} from '~/componentes';
import {
  Cabecalho,
  Paginacao,
  AlertaModalidadeInfantil,
} from '~/componentes-sgp';

import {
  setCarregandoAcompanhamentoFechamento,
  setTurmasAcompanhamentoFechamento,
} from '~/redux/modulos/acompanhamentoFechamento/actions';

import {
  ehTurmaInfantil,
  erros,
  history,
  ServicoAcompanhamentoFechamento,
} from '~/servicos';

import { Filtros } from './Filtros';
import { SecaoFechamento } from './SecaoFechamento';
import { SecaoConselhoClasse } from './SecaoConselhoClasse';

const AcompanhamentoFechamento = () => {
  const [ehInfantil, setEhInfantil] = useState(false);
  const [parametrosFiltro, setParametrosFiltro] = useState();
  const [dadosStatusFechamento, setDadosStatusFechamento] = useState([]);
  const [dadosStatusConsselhoClasse, setDadosStatusConselhoClasse] = useState(
    []
  );

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const permissoesTela = { podeIncluir: false, podeAlterar: false };

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const carregandoAcompanhamentoFechamento = useSelector(
    state => state.acompanhamentoFechamento.carregandoAcompanhamentoFechamento
  );

  const turmasAcompanhamentoFechamento = useSelector(
    state => state.acompanhamentoFechamento.turmasAcompanhamentoFechamento
  );

  const numeroRegistros = turmasAcompanhamentoFechamento?.totalRegistros;
  const pageSize = 10;
  const exibiPaginacao = numeroRegistros > pageSize;

  const dispatch = useDispatch();
  const aoClicarBotaoVoltar = () => history.push('/');

  const onChangeFiltros = async (params, paginaAlterada = 1) => {
    dispatch(setCarregandoAcompanhamentoFechamento(true));
    const retorno = await ServicoAcompanhamentoFechamento.obterTurmas({
      ...params,
      numeroPagina: paginaAlterada,
    })
      .catch(e => erros(e))
      .finally(() => dispatch(setCarregandoAcompanhamentoFechamento(false)));
    if (retorno?.data?.totalRegistros) {
      dispatch(setTurmasAcompanhamentoFechamento(retorno.data));
    } else {
      dispatch(setTurmasAcompanhamentoFechamento());
    }
    if (params) {
      setParametrosFiltro(params);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setTurmasAcompanhamentoFechamento(undefined));
    };
  }, [dispatch]);

  useEffect(() => {
    const infantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setEhInfantil(infantil);
  }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  const obterFechamentos = async turmaId => {
    const retorno = await ServicoAcompanhamentoFechamento.obterFechamentos({
      turmaId,
      bimestre: parametrosFiltro.bimestre,
    }).catch(e => erros(e));

    if (retorno?.data) {
      setDadosStatusFechamento(retorno.data);
    }
  };

  const obterConselhoClasse = async turmaId => {
    const retorno = await ServicoAcompanhamentoFechamento.obterConselhoClasse({
      turmaId,
      bimestre: parametrosFiltro.bimestre,
    }).catch(e => erros(e));

    if (retorno?.data) {
      setDadosStatusConselhoClasse(retorno.data);
    }
  };

  const onChangeCollapse = turmaId => {
    if (turmaId) {
      dispatch(setCarregandoAcompanhamentoFechamento(true));
      Promise.all([obterFechamentos(turmaId), obterConselhoClasse(turmaId)])
        .catch(e => erros(e))
        .finally(() => dispatch(setCarregandoAcompanhamentoFechamento(false)));
    }
  };

  const onChangePaginacao = pagina => {
    onChangeFiltros(parametrosFiltro, pagina);
  };

  return (
    <>
      <AlertaModalidadeInfantil />
      <Cabecalho pagina="Acompanhamento do fechamento" classes="mb-2" />
      <Loader loading={carregandoAcompanhamentoFechamento} ignorarTip>
        <Card>
          <div className="col-md-12 p-0">
            <div className="row mb-2">
              <div className="col-sm-12 d-flex justify-content-end">
                <Button
                  id="botao-voltar"
                  label="Voltar"
                  icon="arrow-left"
                  color={Colors.Azul}
                  onClick={aoClicarBotaoVoltar}
                  border
                />
              </div>
            </div>
            <div className="mb-4">
              <Filtros
                onChangeFiltros={onChangeFiltros}
                ehInfantil={ehInfantil}
              />
            </div>
            {!!turmasAcompanhamentoFechamento?.items?.length && (
              <>
                <div className="mb-3 pt-3">
                  <Label
                    text="Dados por turma"
                    tamanhoFonte="18"
                    altura="24"
                    className="mb-2"
                  />
                  <PainelCollapse accordion onChange={onChangeCollapse}>
                    {turmasAcompanhamentoFechamento.items.map(dadosTurmas => (
                      <PainelCollapse.Painel
                        key={dadosTurmas?.turmaId}
                        accordion
                        espacoPadrao
                        corBorda={Base.AzulBordaCollapse}
                        temBorda
                        header={dadosTurmas?.nome}
                      >
                        <>
                          <SecaoFechamento
                            dadosStatusFechamento={dadosStatusFechamento}
                          />
                          <Divider style={{ background: Base.CinzaDivisor }} />
                          <SecaoConselhoClasse
                            dadosStatusConsselhoClasse={
                              dadosStatusConsselhoClasse
                            }
                            dadosTurmas={dadosTurmas}
                            parametrosFiltro={parametrosFiltro}
                          />
                        </>
                      </PainelCollapse.Painel>
                    ))}
                  </PainelCollapse>
                </div>
                {exibiPaginacao && (
                  <div className="col-12 d-flex justify-content-center mt-2">
                    <Paginacao
                      numeroRegistros={numeroRegistros}
                      pageSize={pageSize}
                      onChangePaginacao={onChangePaginacao}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </Loader>
    </>
  );
};

export default AcompanhamentoFechamento;
