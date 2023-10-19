import { Col, Row } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import {
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_BIMESTRE,
  SGP_SELECT_DRE,
  SGP_SELECT_MODALIDADE,
  SGP_SELECT_SEMESTRE,
  SGP_SELECT_TURMA,
  SGP_SELECT_UE,
} from '~/constantes/ids/select';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';
import { OPCAO_TODOS } from '~/constantes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { AbrangenciaServico, erros, ServicoFiltroRelatorio } from '~/servicos';
import { ordenarDescPor } from '~/utils';
import ListaoContext from '../listaoContext';

const ListaoFiltros = () => {
  const {
    setConsideraHistorico,
    consideraHistorico,
    setAnoLetivo,
    anoLetivo,
    setCodigoDre,
    codigoDre,
    setCodigoUe,
    codigoUe,
    modalidade,
    setModalidade,
    semestre,
    setSemestre,
    setCodigoTurma,
    codigoTurma,
    setBimestre,
    bimestre,
    setCarregarFiltrosSalvos,
    carregarFiltrosSalvos,
    listaAnosLetivo,
    setListaAnosLetivo,
    listaDres,
    setListaDres,
    listaUes,
    setListaUes,
    listaModalidades,
    setListaModalidades,
    listaSemestres,
    setListaSemestres,
    listaTurmas,
    setListaTurmas,
    listaBimestres,
    setListaBimestres,
  } = useContext(ListaoContext);

  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);

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
    if (carregarFiltrosSalvos) return;

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
        const { codigo } = lista[0];
        setCodigoDre(codigo);
      }

      setListaDres(lista);
    } else {
      setCodigoDre();
      setListaDres([]);
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (carregarFiltrosSalvos) return;

    if (anoLetivo) {
      obterDres();
    }
  }, [anoLetivo]);

  const obterUes = useCallback(async () => {
    setCarregandoUes(true);
    const resposta = await AbrangenciaServico.buscarUes(
      codigoDre,
      `v1/abrangencias/${consideraHistorico}/dres/${codigoDre}/ues?anoLetivo=${anoLetivo}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoUes(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        const { codigo } = lista[0];
        setCodigoUe(codigo);
      }

      setListaUes(lista);
    } else {
      setCodigoUe();
      setListaUes([]);
    }
  }, [codigoDre, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (carregarFiltrosSalvos) return;

    if (codigoDre) {
      obterUes();
    }
  }, [codigoDre, obterUes]);

  const obterModalidades = useCallback(async () => {
    setCarregandoModalidades(true);
    const retorno = await ServicoFiltroRelatorio.obterModalidades(
      codigoUe,
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoModalidades(false));

    if (retorno?.data?.length) {
      const lista = retorno.data;

      if (lista?.length === 1) {
        setModalidade(lista[0].valor);
      }
      setListaModalidades(lista);
    }
  }, [anoLetivo, codigoUe, consideraHistorico]);

  useEffect(() => {
    if (carregarFiltrosSalvos) return;

    if (codigoUe) {
      obterModalidades();
    }
  }, [codigoUe, obterModalidades]);

  const obterSemestres = useCallback(async () => {
    setCarregandoSemestres(true);
    const retorno = await AbrangenciaServico.obterSemestres(
      consideraHistorico,
      anoLetivo,
      modalidade,
      codigoDre,
      codigoUe
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoSemestres(false));

    if (retorno?.data?.length) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista?.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestres(lista);
    } else {
      setListaSemestres([]);
    }
  }, [anoLetivo, modalidade, consideraHistorico, codigoDre, codigoUe]);

  useEffect(() => {
    if (carregarFiltrosSalvos) return;

    if (
      (modalidade && String(modalidade) === String(ModalidadeEnum.EJA)) ||
      String(modalidade) === String(ModalidadeEnum.CELP)
    ) {
      obterSemestres();
    }
  }, [obterSemestres, modalidade]);

  const obterTurmas = useCallback(async () => {
    setCarregandoTurmas(true);

    const retorno = await AbrangenciaServico.buscarTurmas(
      codigoUe,
      modalidade,
      '',
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTurmas(false));

    if (retorno?.data?.length) {
      const lista = retorno?.data;
      if (lista.length > 1) {
        lista.unshift({ codigo: OPCAO_TODOS, nomeFiltro: 'Todas' });
        setCodigoTurma(OPCAO_TODOS);
      }
      setListaTurmas(lista);
      if (lista.length === 1) {
        setCodigoTurma([String(lista[0].codigo)]);
      }
    }
  }, [anoLetivo, consideraHistorico, codigoUe, modalidade]);

  useEffect(() => {
    if (carregarFiltrosSalvos) return;

    if (modalidade) {
      obterTurmas();
    }
  }, [modalidade, obterTurmas]);

  const obterBimestres = useCallback(() => {
    const bi = [];
    bi.push({ descricao: '1º Bimestre', valor: 1 });
    bi.push({ descricao: '2º Bimestre', valor: 2 });

    if (
      modalidade !== String(ModalidadeEnum.EJA) ||
      modalidade !== String(ModalidadeEnum.CELP)
    ) {
      bi.push({ descricao: '3º Bimestre', valor: 3 });
      bi.push({ descricao: '4º Bimestre', valor: 4 });
    }
    if (modalidade !== String(ModalidadeEnum.INFANTIL)) {
      bi.push({ descricao: 'Final', valor: 0 });
    }

    setListaBimestres(bi);
  }, [modalidade]);

  useEffect(() => {
    if (carregarFiltrosSalvos) return;

    if (modalidade) {
      obterBimestres();
    }
  }, [modalidade, obterBimestres]);

  const onCheckedConsideraHistorico = e => {
    setListaAnosLetivo([]);
    setAnoLetivo();

    setListaDres([]);
    setCodigoDre();

    setListaUes([]);
    setCodigoUe();

    setListaModalidades([]);
    setModalidade();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setCodigoTurma();

    setListaBimestres([]);
    setBimestre();

    setConsideraHistorico(e.target.checked);

    setCarregarFiltrosSalvos(false);
  };

  const onChangeAnoLetivo = ano => {
    setListaDres([]);
    setCodigoDre();

    setListaUes([]);
    setCodigoUe();

    setListaModalidades([]);
    setModalidade();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setCodigoTurma();

    setListaBimestres([]);
    setBimestre();

    setAnoLetivo(ano);

    setCarregarFiltrosSalvos(false);
  };

  const onChangeDre = dre => {
    setListaUes([]);
    setCodigoUe();

    setListaModalidades([]);
    setModalidade();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setCodigoTurma();

    setListaBimestres([]);
    setBimestre();

    setCodigoDre(dre);

    setCarregarFiltrosSalvos(false);
  };

  const onChangeUe = ue => {
    setListaModalidades([]);
    setModalidade();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setCodigoTurma();

    setListaBimestres([]);
    setBimestre();

    setCodigoUe(ue);

    setCarregarFiltrosSalvos(false);
  };

  const onChangeModalidade = novaModalidade => {
    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setCodigoTurma();

    setListaBimestres([]);
    setBimestre();

    setModalidade(novaModalidade);

    setCarregarFiltrosSalvos(false);
  };

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setCarregarFiltrosSalvos(false);
  };
  const onChangeTurma = valor => {
    setCodigoTurma(valor);
    setCarregarFiltrosSalvos(false);
  };
  const onChangeBimestre = valor => {
    setBimestre(valor);
    setCarregarFiltrosSalvos(false);
  };

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <CheckboxComponent
            id={SGP_CHECKBOX_EXIBIR_HISTORICO}
            label="Exibir histórico?"
            onChangeCheckbox={onCheckedConsideraHistorico}
            checked={consideraHistorico}
          />
        </Col>

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
              valueSelect={codigoDre || undefined}
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
              disabled={!codigoDre || listaUes?.length === 1}
              onChange={onChangeUe}
              valueSelect={codigoUe || undefined}
              placeholder="Selecione uma UE"
              showSearch
            />
          </Loader>
        </Col>

        <Col sm={24} md={12} lg={8}>
          <Loader loading={carregandoModalidades} ignorarTip>
            <SelectComponent
              id={SGP_SELECT_MODALIDADE}
              label="Modalidade"
              placeholder="Selecione a modalidade"
              lista={listaModalidades}
              valueOption="valor"
              valueText="descricao"
              disabled={listaModalidades.length === 1 || !codigoUe}
              onChange={onChangeModalidade}
              valueSelect={modalidade}
            />
          </Loader>
        </Col>

        {Number(modalidade) === ModalidadeEnum.EJA ||
        Number(modalidade) === ModalidadeEnum.CELP ? (
          <Col sm={24} md={12} lg={8}>
            <Loader loading={carregandoSemestres} ignorarTip>
              <SelectComponent
                id={SGP_SELECT_SEMESTRE}
                lista={listaSemestres}
                valueOption="valor"
                valueText="desc"
                label="Semestre"
                placeholder="Selecione o semestre"
                disabled={!modalidade || listaSemestres?.length === 1}
                valueSelect={semestre}
                onChange={onChangeSemestre}
              />
            </Loader>
          </Col>
        ) : (
          <></>
        )}

        <Col sm={24} md={12} lg={8}>
          <Loader loading={carregandoTurmas} ignorarTip>
            <SelectComponent
              id={SGP_SELECT_TURMA}
              lista={listaTurmas}
              valueOption="codigo"
              valueText="nomeFiltro"
              label="Turma"
              modalidade
              disabled={!modalidade || listaTurmas?.length === 1}
              valueSelect={codigoTurma}
              onChange={onChangeTurma}
              placeholder="Turma"
              showSearch
            />
          </Loader>
        </Col>

        <Col sm={24} md={12} lg={8}>
          <SelectComponent
            id={SGP_SELECT_BIMESTRE}
            lista={listaBimestres}
            valueOption="valor"
            valueText="descricao"
            label="Bimestre"
            disabled={listaBimestres?.length === 1 || !listaBimestres?.length}
            valueSelect={bimestre}
            onChange={onChangeBimestre}
            placeholder="Selecione o bimestre"
          />
        </Col>
      </Row>
    </Col>
  );
};

export default ListaoFiltros;
