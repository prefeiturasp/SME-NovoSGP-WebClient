import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { SGP_BUTTON_FILTRAR } from '@/@legacy/constantes/ids/button';
import { SGP_TABLE_RELATORIO_DINAMICO_NAAPA } from '@/@legacy/constantes/ids/table';
import { erros } from '@/@legacy/servicos';
import ServicoRelatorioDinamicoNAAPA from '@/@legacy/servicos/Paginas/Gestao/NAAPA/ServicoRelatorioDinamicoNAAPA';
import { Col, Pagination } from 'antd';
import { HttpStatusCode } from 'axios';
import { useCallback, useContext, useState } from 'react';
import { Button, Colors, DataTable } from '~/componentes';
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

  const { dataSource, setDataSource } = useContext(
    RelatorioDinamicoNAAPAContext
  );

  console.log(dataSource);

  const [numeroRegistrosPagina, setNumeroRegistrosPagina] = useState(10);
  const [numeroRegistros, setNumeroRegistros] = useState(1);
  const [exibirLoader, setExibirLoader] = useState(false);

  const [dados, setDados] = useState();

  const colunas = [
    {
      title: 'DRE',
      dataIndex: 'dre',
    },
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
      dataIndex: 'ano',
    },
  ];

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

  return (
    <>
      {dados && (
        <RelatorioDinamicoNAAPACardTotalizador
          modalidade={modalidade === OPCAO_TODOS ? null : modalidade}
          totalEncaminhamentos={dados?.totalRegistro}
          totalRegistroPorModalidadesAno={dados?.totalRegistroPorModalidadesAno}
        />
      )}
      <Col xs={24} sm={12}>
        <Button
          id={SGP_BUTTON_FILTRAR}
          label="Filtrar"
          icon="filter"
          color={Colors.Azul}
          disabled={exibirLoader}
          onClick={() => {
            obterDados(1, numeroRegistrosPagina);
          }}
          border
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
    </>
  );
};

export default RelatorioDinamicoNAAPALista;
