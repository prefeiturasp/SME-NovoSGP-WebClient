import { NomeEstudanteLista } from '@/@legacy/componentes-sgp';
import { ROUTES } from '@/core/enum/routes';
import { store } from '@/core/redux';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'antd';
import { ListaPaginada, DataTable } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_TABLE_ENCAMINHAMENTO_NAAPA } from '~/constantes/ids/table';
import { setTabAtivaEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { verificarDataFimMaiorInicio } from '~/utils';
import mockTabelaEncaminhamentos from './mockTabelaEncaminhamentos';

const TabelaEncaminhamentoNAAPAPaginacao = props => {
  const {
    ue,
    dre,
    turmaId,
    situacao,
    anoLetivo,
    codigoNomeAluno,
    prioridade,
    tipo,
    suspeitaViolencia,
    consideraHistorico,
    dataAberturaQueixaFim,
    dataAberturaQueixaInicio,
    onSelecionarItems,
    exibirEncaminhamentosEncerrados,
    obterDadosFiltros,
    ordenacoesSelecionadas,
    usarMock = true,
  } = props;

  const navigate = useNavigate();

  const [filtros, setFiltros] = useState();
  const [dados, setDados] = useState([]);

  const filtroEhValido = !!(anoLetivo && dre?.id && ue?.id);

  const colunas = [
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      render: tipo => tipo,
    },
    {
      title: 'Unidade Educacional',
      dataIndex: 'ue',
      render: ue => ue || '-',
    },
    {
      title: 'Criança/Estudante',
      dataIndex: 'nomeAluno',
      render: (_, linha) => {
        if (!linha?.nomeAluno || linha?.nomeAluno === '-') {
          return '-';
        }
        return (
          <NomeEstudanteLista
            nome={`${linha.nomeAluno} (${linha.codigoAluno})`}
            ehMatriculadoTurmaPAP={linha.ehMatriculadoTurmaPAP}
          />
        );
      },
    },
    {
      title: 'Turma',
      dataIndex: 'turma',
      render: turma => turma || '-',
    },
    {
      title: 'Data de entrada da queixa',
      dataIndex: 'dataAberturaQueixaInicio',
      render: data => {
        if (!data || data === '-') return '-';
        return window.moment(data).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Data do último atendimento',
      dataIndex: 'dataUltimoAtendimento',
      render: data => {
        if (!data || data === '-') return '-';
        return window.moment(data).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      render: situacao => situacao || '-',
    },
    {
      title: 'Suspeita de violência',
      dataIndex: 'suspeitaViolencia',
      align: 'center',
      render: suspeita => {
        return (
          <Checkbox
            checked={suspeita === 'Sim'}
            style={{ cursor: 'default' }}
          />
        );
      },
    },
  ];

  if (ue?.codigo === OPCAO_TODOS) {
    colunas.unshift({
      title: 'Unidade Escolar (UE)',
      dataIndex: 'ue',
    });
  }

  const filtrar = useCallback(() => {
    const params = {
      exibirHistorico: consideraHistorico,
      anoLetivo,
      dreId: dre?.id,
      codigoUe: ue?.codigo,
      turmaId: turmaId === OPCAO_TODOS ? '' : turmaId,
      codigoNomeAluno,
      dataAberturaQueixaInicio: dataAberturaQueixaInicio
        ? dataAberturaQueixaInicio.format('YYYY-MM-DD')
        : '',
      dataAberturaQueixaFim: dataAberturaQueixaFim
        ? dataAberturaQueixaFim.format('YYYY-MM-DD')
        : '',
      situacao,
      prioridade,
      tipo,
      suspeitaViolencia,
      exibirEncerrados: exibirEncaminhamentosEncerrados,
    };

    if (ordenacoesSelecionadas?.length) {
      params.ordenacao = ordenacoesSelecionadas.map(item => item?.value);
    }

    const dataFimMaiorInicio = verificarDataFimMaiorInicio(
      dataAberturaQueixaInicio,
      dataAberturaQueixaFim
    );

    if (dataFimMaiorInicio || usarMock) {
      setFiltros({ ...params });
    }
  }, [
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    turmaId,
    codigoNomeAluno,
    dataAberturaQueixaInicio,
    dataAberturaQueixaFim,
    situacao,
    prioridade,
    tipo,
    suspeitaViolencia,
    exibirEncaminhamentosEncerrados,
    ordenacoesSelecionadas,
    usarMock,
  ]);

  useEffect(() => {
    if (usarMock) {
      setDados(mockTabelaEncaminhamentos);
    } else {
      filtrar();
    }
  }, [filtrar, usarMock]);

  const exibirTabela =
    usarMock || (filtros?.anoLetivo && filtros?.dreId && filtros?.codigoUe);

  if (usarMock) {
    return (
      <DataTable
        id={SGP_TABLE_ENCAMINHAMENTO_NAAPA}
        columns={colunas}
        dataSource={dados}
        selectMultipleRows={true}
        selectedRowKeys={[]}
        onSelectRow={ids => {
          const itensSelecionados = dados.filter(item => ids.includes(item.id));
          onSelecionarItems(itensSelecionados);
        }}
        onClickRow={linha => {
          store.dispatch(setTabAtivaEncaminhamentoNAAPA(0));
          const dadosSalvarState = obterDadosFiltros();
          navigate(`${ROUTES.ENCAMINHAMENTO_NAAPA}/${linha?.id}`, {
            state: dadosSalvarState,
          });
        }}
        pagination={true}
        pageSize={10}
        idLinha="id"
      />
    );
  }

  return exibirTabela ? (
    <ListaPaginada
      url="v1/encaminhamento-naapa-tabela"
      id={SGP_TABLE_ENCAMINHAMENTO_NAAPA}
      colunas={colunas}
      filtro={filtros}
      onClick={linha => {
        store.dispatch(setTabAtivaEncaminhamentoNAAPA(0));
        const dadosSalvarState = obterDadosFiltros();
        navigate(`${ROUTES.ENCAMINHAMENTO_NAAPA}/${linha?.id}`, {
          state: dadosSalvarState,
        });
      }}
      filtroEhValido={filtroEhValido}
      multiSelecao
      selecionarItems={valores => onSelecionarItems(valores)}
    />
  ) : (
    <></>
  );
};

export default TabelaEncaminhamentoNAAPAPaginacao;
