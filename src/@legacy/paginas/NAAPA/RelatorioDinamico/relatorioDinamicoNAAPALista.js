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
import { HttpStatusCode } from 'axios';
import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Base, Button, Colors, DataTable } from '~/componentes';
import RelatorioDinamicoNAAPACardTotalizador from './relatorioDinamicoNAAPACardTotalizador';
import RelatorioDinamicoNAAPAContext from './relatorioDinamicoNAAPAContext';

const RelatorioDinamicoNAAPALista = ({ form, dadosQuestionario }) => {
  const consideraHistorico = form.values?.consideraHistorico;
  const anoLetivo = form.values?.anoLetivo;
  const dreCodigo = form.values?.dreCodigo;
  const listaDres = form.values?.listaDres;
  const ueCodigo = form.values?.ueCodigo;
  const listaUes = form.values?.listaUes;
  const modalidade = form.values?.modalidade;
  const semestre = form.values?.semestre;
  const anosEscolaresCodigos = form.values?.anosEscolaresCodigos;

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

  const [dados, setDados] = useState();

  const ids = dataSource?.map(item => item?.id);

  const exibirCardsPorModalidade = modalidade && modalidade === OPCAO_TODOS;

  let exibirCardsPorAno = modalidade && modalidade !== OPCAO_TODOS;

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
      title: 'Unidade Escolar (UE)',
      dataIndex: 'unidadeEscolar',
    },
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

  if (dreCodigo !== OPCAO_TODOS) {
    colunas.unshift({
      title: 'DRE',
      dataIndex: 'dre',
    });
  }

  const obterDados = useCallback(
    async (pagina, registrosPagina) => {
      const dadosMapeados =
        await QuestionarioDinamicoFuncoes.mapearQuestionarios(
          dadosQuestionario
        );

      const params = {
        historico: consideraHistorico,
        anoLetivo,
        dreId: '',
        ueId: '',
        modalidade: modalidade === OPCAO_TODOS ? '' : modalidade,
        semestre,
        anos: [],
        filtroAvancado: [],
      };

      if (dreCodigo !== OPCAO_TODOS) {
        params.dreId = listaDres?.find?.(dre => dre?.codigo === dreCodigo)?.id;
      }

      if (ueCodigo !== OPCAO_TODOS) {
        params.ueId = listaUes?.find?.(ue => ue?.codigo === ueCodigo)?.id;
      }

      if (anosEscolaresCodigos?.length) {
        params.anos =
          anosEscolaresCodigos[0] === OPCAO_TODOS ? [] : anosEscolaresCodigos;
      }

      if (dadosMapeados?.secoes?.[0]?.questoes?.length) {
        params.filtroAvancado = dadosMapeados.secoes[0].questoes.filter(
          questao => questao?.resposta
        );
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
          setDataSource(encaminhamentosNAAPAPaginado.items);
          setNumeroRegistros(encaminhamentosNAAPAPaginado?.totalRegistros);
          setDesabilitarGerar(false);
        } else {
          setNumeroRegistros(0);
          setDataSource([]);
        }

        setDados(resposta.data);
      } else {
        setDataSource([]);
        setNumeroRegistros(0);
      }

      setExibirLoader(false);
    },
    [anoLetivo, modalidade, dreCodigo, ueCodigo, anosEscolaresCodigos, semestre]
  );

  useEffect(() => {
    if (
      !anoLetivo ||
      !dreCodigo ||
      !ueCodigo ||
      !modalidade ||
      !anosEscolaresCodigos?.length
    ) {
      setDataSource([]);
    }
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

  const onClickGerar = values => {
    const valuesClone = _.cloneDeep(values);

    setGerandoRelatorio(true);

    const params = {
      dreCodigo: valuesClone?.dreCodigo,
      ueCodigo: valuesClone?.ueCodigo,
      ids,
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
      {dataSource?.length ? (
        <RelatorioDinamicoNAAPACardTotalizador
          exibirCardsPorModalidade={exibirCardsPorModalidade}
          exibirCardsPorAno={exibirCardsPorAno}
          totalEncaminhamentos={dados?.totalRegistro}
          totalRegistroPorModalidadesAno={dados?.totalRegistroPorModalidadesAno}
        />
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
          disabled={desabilitarGerar || !ids?.length}
        />
      </Col>
      <Col xs={24}>
        <DataTable
          loading={exibirLoader}
          id={SGP_TABLE_RELATORIO_DINAMICO_NAAPA}
          columns={colunas}
          dataSource={dataSource}
          pagination={false}
          semHover
        />
      </Col>
      {dados?.totalRegistro ? (
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
