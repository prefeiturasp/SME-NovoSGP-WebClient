import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import {
  MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO,
  OPCAO_TODOS,
} from '@/@legacy/constantes';
import {
  SGP_BUTTON_FILTRAR,
  SGP_BUTTON_GERAR,
} from '@/@legacy/constantes/ids/button';
import { SGP_TABLE_RELATORIO_DINAMICO_NAAPA } from '@/@legacy/constantes/ids/table';
import { erros, sucesso } from '@/@legacy/servicos';
import ServicoRelatorioDinamicoNAAPA from '@/@legacy/servicos/Paginas/Gestao/NAAPA/ServicoRelatorioDinamicoNAAPA';
import ServicoRelatorioEncaminhamentoNAAPA from '@/@legacy/servicos/Paginas/Relatorios/NAAPA/ServicoRelatorioEncaminhamentoNAAPA';
import { ROUTES } from '@/core/enum/routes';
import { Col, Pagination } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { HttpStatusCode } from 'axios';
import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Base, Button, Colors, DataTable } from '~/componentes';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import RelatorioDinamicoNAAPAContext from '../relatorioDinamicoNAAPAContext';
import { TabApoioAcompanhamentoCardsTotalizadores } from './tabs/tabApoioAcompanhamentoCardsTotalizadores';
import { TabEncaminhamentoCardsTotalizadores } from './tabs/tabEncaminhamentoCardsTotalizadores';

const RelatorioDinamicoNAAPALista = ({ form, dadosSecoes }) => {
  const consideraHistorico = form.values?.consideraHistorico;
  const anoLetivo = form.values?.anoLetivo;
  const dreCodigo = form.values?.dreCodigo;
  const listaDres = form.values?.listaDres;
  const ueCodigo = form.values?.ueCodigo;
  const listaUes = form.values?.listaUes;
  const modalidade = form.values?.modalidade;
  const anosEscolaresCodigos = form.values?.anosEscolaresCodigos;
  const situacaoIds = form.values?.situacaoIds;
  const exibirEncerrados = form.values?.exibirEncerrados;
  const fluxoAlertaIds = form.values?.fluxoAlertaIds;
  const portaEntradaIds = form.values?.portaEntradaIds;

  const {
    dataSource,
    setDataSource,
    initialValues,
    setGerandoRelatorio,
    desabilitarGerar,
    setDesabilitarGerar,
  } = useContext(RelatorioDinamicoNAAPAContext);

  const [numeroRegistrosPagina, setNumeroRegistrosPagina] = useState(10);
  const [numeroRegistros, setNumeroRegistros] = useState(1);
  const [exibirLoader, setExibirLoader] = useState(false);

  const todosEmModalidade =
    modalidade?.length > 1 ||
    !!modalidade?.find(item => String(item) === OPCAO_TODOS);
  const encaminhamentosNAAPAPaginado = dataSource?.encaminhamentosNAAPAPaginado;

  const exibirCardsPorModalidade = todosEmModalidade;

  let exibirCardsPorAno = !todosEmModalidade;

  if (exibirCardsPorAno) {
    const anosTodasSelecionado =
      anosEscolaresCodigos?.length === 1 &&
      anosEscolaresCodigos[0] === OPCAO_TODOS;
    const maisDeUmAnoSelecionado = anosEscolaresCodigos?.length > 1;
    if (anosTodasSelecionado || maisDeUmAnoSelecionado) {
      exibirCardsPorAno = true;
    }
  }

  const colunas = [
    {
      title: 'Criança/Estudante',
      dataIndex: 'estudante',
    },
    {
      title: 'Ano',
      dataIndex: 'descricaoAno',
    },
    {
      title: 'Ações',
      dataIndex: 'id',
      width: '150px',
      render: id => (
        <Link
          to={`${ROUTES.ENCAMINHAMENTO_NAAPA}/${id}`}
          target="_blank"
          style={{ color: Base.Azul }}
        >
          Ver encaminhamento
        </Link>
      ),
    },
  ];

  if (dreCodigo === OPCAO_TODOS) {
    colunas.unshift({
      title: 'DRE',
      dataIndex: 'dre',
    });
  }

  if (ueCodigo === OPCAO_TODOS) {
    colunas.unshift({
      title: 'Unidade Escolar (UE)',
      dataIndex: 'unidadeEscolar',
    });
  }

  const obterDados = useCallback(
    async (pagina, registrosPagina) => {
      const dadosMapeados =
        await QuestionarioDinamicoFuncoes.mapearQuestionarios(
          dadosSecoes,
          true
        );

      const formsValidos = !!dadosMapeados?.formsValidos;

      if (formsValidos || dadosMapeados?.secoes?.length) {
        const modalidades = todosEmModalidade ? [] : modalidade;

        const params = {
          historico: consideraHistorico,
          anoLetivo,
          dreId: '',
          ueId: '',
          modalidades,
          anos: [],
          filtroAvancado: [],
        };

        if (dreCodigo !== OPCAO_TODOS) {
          params.dreId = listaDres?.find?.(
            dre => dre?.codigo === dreCodigo
          )?.id;
        }

        if (ueCodigo !== OPCAO_TODOS) {
          params.ueId = listaUes?.find?.(ue => ue?.codigo === ueCodigo)?.id;
        }

        if (anosEscolaresCodigos?.length) {
          params.anos =
            anosEscolaresCodigos[0] === OPCAO_TODOS ? [] : anosEscolaresCodigos;
        }

        if (dadosMapeados?.secoes?.[0]?.questoes?.length) {
          let filtroAvancado = [];

          dadosMapeados.secoes.forEach(secao => {
            const questoesComResposta = secao.questoes.filter(
              questao => questao?.resposta
            );
            secao.questoes = questoesComResposta;

            if (secao.questoes?.length) {
              filtroAvancado = [...filtroAvancado, ...secao.questoes];
            }
          });

          params.filtroAvancado = filtroAvancado;
        }

        setExibirLoader(true);

        const resposta = await ServicoRelatorioDinamicoNAAPA.obterDados(
          params,
          pagina,
          registrosPagina
        ).catch(e => erros(e));

        if (resposta?.status === HttpStatusCode.Ok) {
          const encaminhamentosNAAPAPaginado =
            resposta?.data?.encaminhamentosNAAPAPaginado;

          if (encaminhamentosNAAPAPaginado?.items?.length) {
            setNumeroRegistros(encaminhamentosNAAPAPaginado?.totalRegistros);
            setDesabilitarGerar(false);
          } else {
            setNumeroRegistros(0);
          }

          setDataSource(resposta.data);
        } else {
          setDataSource([]);
          setNumeroRegistros(0);
        }

        setExibirLoader(false);
      }
    },
    [anoLetivo, modalidade, dreCodigo, ueCodigo, anosEscolaresCodigos]
  );

  useEffect(() => {
    setDataSource([]);
  }, [anoLetivo, dreCodigo, ueCodigo, modalidade, anosEscolaresCodigos]);

  const validaAntesDeFiltrar = () => {
    const arrayCampos = Object.keys(initialValues);

    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });

    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        obterDados(1, numeroRegistrosPagina);
      }
    });
  };

  const onClickGerar = () => {
    setGerandoRelatorio(true);

    const params = {
      consideraHistorico: consideraHistorico,
      anoLetivo: anoLetivo,
      dreCodigo: dreCodigo,
      ueCodigo: ueCodigo,
      modalidades: modalidade,
      anosEscolaresCodigos: anosEscolaresCodigos,
      situacaoIds: situacaoIds,
      exibirEncerrados: exibirEncerrados,
      fluxoAlertaIds: fluxoAlertaIds,
      portaEntradaIds: portaEntradaIds,
    };

    ServicoRelatorioEncaminhamentoNAAPA.gerar(params)
      .then(retorno => {
        if (retorno?.status === HttpStatusCode.Ok) {
          sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
          setDesabilitarGerar(true);
        }
      })
      .catch(e => erros(e))
      .finally(() => setGerandoRelatorio(false));
  };

  return (
    <>
      {encaminhamentosNAAPAPaginado?.items?.length ? (
        <ContainerTabsCard type="card">
          <TabPane tab="Encaminhamento" key={1}>
            <TabEncaminhamentoCardsTotalizadores
              exibirCardsPorModalidade={exibirCardsPorModalidade}
              exibirCardsPorAno={exibirCardsPorAno}
              totalEncaminhamentos={dataSource?.totalRegistro}
              totalRegistroPorModalidadesAno={
                dataSource?.totalRegistroPorModalidadesAno
              }
            />
          </TabPane>
          <TabPane tab="Apoio e acompanhamento" key={2}>
            <TabApoioAcompanhamentoCardsTotalizadores
              totalDeAtendimento={dataSource?.totalDeAtendimento}
            />
          </TabPane>
        </ContainerTabsCard>
      ) : (
        <></>
      )}
      <Col>
        <Button
          id={SGP_BUTTON_FILTRAR}
          label="Filtrar"
          icon="filter"
          color={Colors.Azul}
          disabled={exibirLoader}
          onClick={() => {
            validaAntesDeFiltrar();
          }}
          border
        />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_GERAR}
          icon="print"
          label="Gerar"
          color={Colors.Azul}
          border
          bold
          onClick={() => onClickGerar()}
          disabled={
            desabilitarGerar ||
            !encaminhamentosNAAPAPaginado?.items?.length ||
            !form.isValid
          }
        />
      </Col>
      <Col xs={24}>
        <DataTable
          loading={exibirLoader}
          id={SGP_TABLE_RELATORIO_DINAMICO_NAAPA}
          columns={colunas}
          dataSource={encaminhamentosNAAPAPaginado?.items}
          pagination={false}
          semHover
        />
      </Col>
      {dataSource?.totalRegistro ? (
        <Col xs={24}>
          <Pagination
            showSizeChanger
            total={numeroRegistros}
            locale={{ items_per_page: '' }}
            pageSize={numeroRegistrosPagina}
            onChange={(page, pageSize) => {
              obterDados(page, pageSize);
            }}
            onShowSizeChange={(_, pageSize) => {
              setNumeroRegistrosPagina(pageSize);
            }}
          />
        </Col>
      ) : (
        <></>
      )}
    </>
  );
};

export default RelatorioDinamicoNAAPALista;
