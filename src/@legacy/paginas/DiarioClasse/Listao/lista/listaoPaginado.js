import {
  faCalendarDay,
  faChalkboardTeacher,
  faFileAlt,
  faPencilRuler,
  faSpellCheck,
  faCheck,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Base, ListaPaginada } from '~/componentes';
import { BIMESTRE_FINAL, OPCAO_TODOS } from '~/constantes';
import {
  salvarAnosLetivos,
  salvarDres,
  salvarModalidades,
  salvarPeriodos,
  salvarTurmas,
  salvarUnidadesEscolares,
} from '~/redux/modulos/filtro/actions';
import {
  selecionarTurma,
  setRecarregarFiltroPrincipal,
} from '~/redux/modulos/usuario/actions';

import {
  LISTAO_TAB_AVALIACOES,
  LISTAO_TAB_DIARIO_BORDO,
  LISTAO_TAB_FECHAMENTO,
  LISTAO_TAB_FREQUENCIA,
  LISTAO_TAB_PLANO_AULA,
  PARAMETROS,
} from '../listaoConstantes';
import ListaoContext from '../listaoContext';
import { ROUTES } from '@/core/enum/routes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

const ListaoPaginado = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    consideraHistorico,
    anoLetivo,
    codigoUe,
    codigoDre,
    modalidade,
    semestre,
    codigoTurma,
    bimestre,
    setTabAtual,
    listaAnosLetivo,
    listaDres,
    listaUes,
    listaModalidades,
    listaSemestres,
    listaTurmas,
    setCarregarFiltrosSalvos,
    setComponenteCurricularInicial,
    setBimestreOperacoes,
  } = useContext(ListaoContext);

  const [filtros, setFiltros] = useState({});
  const [colunas, setColunas] = useState([]);

  const temSemetreQuandoEjaouCelp =
    Number(modalidade) === ModalidadeEnum.EJA ||
    Number(modalidade) === ModalidadeEnum.CELP
      ? !!semestre
      : true;

  const filtroEhValido = !!(
    anoLetivo &&
    codigoDre &&
    codigoUe &&
    modalidade &&
    temSemetreQuandoEjaouCelp &&
    codigoTurma &&
    bimestre
  );

  const filtrar = useCallback(() => {
    if (filtroEhValido) {
      const params = {
        consideraHistorico,
        anoLetivo,
        dreCodigo: codigoDre,
        ueCodigo: codigoUe,
        modalidade,
        turmaCodigo: codigoTurma === OPCAO_TODOS ? '' : codigoTurma,
        semestre,
        bimestre,
      };
      setFiltros({ ...params });
    } else {
      setFiltros({});
    }
  }, [
    consideraHistorico,
    anoLetivo,
    codigoDre,
    codigoUe,
    modalidade,
    semestre,
    codigoTurma,
    bimestre,
    filtroEhValido,
  ]);

  useEffect(() => {
    filtrar();
  }, [filtrar]);

  const carregarFiltros = (tab, params) => {
    if (tab) {
      const turmasSemTodos = listaTurmas?.filter(
        item => item?.codigo !== OPCAO_TODOS
      );
      const turmasList = turmasSemTodos?.map(turma => {
        return {
          ...turma,
          id: turma.id,
          desc: turma.nomeFiltro ? turma.nomeFiltro : turma.nome,
          modalidadeTurmaNome: turma.modalidadeTurmaNome,
          valor: turma.codigo,
          ano: turma.ano,
          ensinoEspecial: turma.ensinoEspecial,
        };
      });

      const modalidadesList = listaModalidades?.map(item => {
        return {
          ...item,
          desc: item.descricao,
        };
      });
      const dresList = listaDres?.map(item => {
        return {
          ...item,
          desc: item.nome,
          valor: item.codigo,
        };
      });
      const uesList = listaUes?.map(item => {
        return {
          ...item,
          desc: item.nome,
          valor: item.codigo,
        };
      });
      dispatch(salvarAnosLetivos(listaAnosLetivo));
      dispatch(salvarModalidades(modalidadesList));
      dispatch(salvarPeriodos(listaSemestres));
      dispatch(salvarDres(dresList));
      dispatch(salvarUnidadesEscolares(uesList));
      dispatch(salvarTurmas(turmasList));

      const turma = {
        anoLetivo,
        modalidade,
        dre: codigoDre,
        unidadeEscolar: codigoUe,
        turma: params?.turmaCodigo ? String(params?.turmaCodigo) : '',
        periodo: semestre || 0,
        consideraHistorico,
      };

      dispatch(selecionarTurma({ ...turma }));
      dispatch(setRecarregarFiltroPrincipal(true));
      setTabAtual(tab);
      setBimestreOperacoes();
      setComponenteCurricularInicial(params?.componenteCurricularCodigo);
      navigate(ROUTES.LISTAO_OPERACOES);

      setCarregarFiltrosSalvos(true);
    }
  };

  const desabilitarIconeFechamento = (tab, params) =>
    tab === LISTAO_TAB_FECHAMENTO && !params?.periodoFechamentoIniciado;

  const escolherCursor = desabilitarIcone =>
    desabilitarIcone ? 'not-allowed' : 'pointer';

  const montarIcone = (icon, tab, params) => {
    const parametro = PARAMETROS[tab];
    const temPendencia = params[parametro];
    const iconePendencia = temPendencia ? faExclamationTriangle : faCheck;
    const corPendencia = temPendencia ? 'LaranjaCalendario' : 'Verde';

    const desabilitarIcone = desabilitarIconeFechamento(tab, params);
    const cursor = escolherCursor(desabilitarIcone);

    const corIcone = desabilitarIcone ? Base.CinzaMako : Base.Azul;
    const corIconePendencia = desabilitarIcone
      ? Base.CinzaMako
      : Base[corPendencia];

    return (
      <>
        <FontAwesomeIcon
          className="cor-branco-hover"
          style={{
            fontSize: '16px',
            color: corIcone,
            cursor,
          }}
          icon={icon}
        />
        <FontAwesomeIcon
          className="cor-branco-hover"
          style={{
            fontSize: '16px',
            color: corIconePendencia,
            marginLeft: '12px',
            cursor,
          }}
          icon={iconePendencia}
        />
      </>
    );
  };

  const montarColunas = useCallback(() => {
    const ehBimestreFinal = String(bimestre) === BIMESTRE_FINAL;
    const tamanhoColsTelas = '13%';

    const confPadrao = tab => {
      return {
        align: 'center',
        width: tamanhoColsTelas,
        ellipsis: true,
        onCell: params => {
          const desabilitarIcone = desabilitarIconeFechamento(tab, params);
          const cursor = escolherCursor(desabilitarIcone);
          const onClick = desabilitarIcone
            ? () => {}
            : () => carregarFiltros(tab, params);

          return {
            onClick,
            style: { cursor },
          };
        },
      };
    };

    const cols = [
      {
        title: 'Minhas turmas',
        dataIndex: 'nomeTurma',
        width: '36%',
        ellipsis: true,
      },
      {
        title: 'Turno',
        dataIndex: 'turno',
        width: '12%',
        align: 'center',
        ellipsis: true,
      },
    ];

    if (Number(modalidade) === ModalidadeEnum.INFANTIL && !ehBimestreFinal) {
      cols.push(
        {
          title: 'Frequência',
          ...confPadrao(LISTAO_TAB_FREQUENCIA),
          render: (_, params) =>
            montarIcone(faCalendarDay, LISTAO_TAB_FREQUENCIA, params),
        },
        {
          title: 'Diário de bordo',
          ...confPadrao(LISTAO_TAB_DIARIO_BORDO),
          render: (_, params) =>
            montarIcone(faFileAlt, LISTAO_TAB_DIARIO_BORDO, params),
        }
      );
    }

    if (Number(modalidade) !== ModalidadeEnum.INFANTIL && !ehBimestreFinal) {
      cols.push(
        {
          title: 'Frequência',
          ...confPadrao(LISTAO_TAB_FREQUENCIA),
          render: (_, params) =>
            montarIcone(faCalendarDay, LISTAO_TAB_FREQUENCIA, params),
        },
        {
          title: 'Plano de aula',
          ...confPadrao(LISTAO_TAB_PLANO_AULA),
          render: (_, params) =>
            montarIcone(faChalkboardTeacher, LISTAO_TAB_PLANO_AULA, params),
        },
        {
          title: 'Avaliações',
          ...confPadrao(LISTAO_TAB_AVALIACOES),
          render: (_, params) =>
            montarIcone(faSpellCheck, LISTAO_TAB_AVALIACOES, params),
        },
        {
          title: 'Fechamento',
          ...confPadrao(LISTAO_TAB_FECHAMENTO),
          render: (_, params) =>
            montarIcone(faPencilRuler, LISTAO_TAB_FECHAMENTO, params),
        }
      );
    }

    if (ehBimestreFinal) {
      cols.push({
        title: 'Fechamento',
        ...confPadrao(LISTAO_TAB_FECHAMENTO),
        render: (_, params) =>
          montarIcone(faPencilRuler, LISTAO_TAB_FECHAMENTO, params),
      });
    }

    setColunas([...cols]);
  }, [modalidade, bimestre]);

  useEffect(() => {
    montarColunas();
  }, [montarColunas]);

  return (
    <Col span={24} style={{ marginTop: '20px' }}>
      {filtros?.anoLetivo &&
      filtros?.dreCodigo &&
      filtros?.ueCodigo &&
      filtros?.modalidade &&
      filtros?.bimestre ? (
        <ListaPaginada
          url="v1/turmas/listagem-turmas"
          id="lista-paginada-listao"
          colunaChave="colunaChave"
          colunas={colunas}
          filtro={filtros}
          filtroEhValido={filtroEhValido}
          naoFiltrarQuandocarregando
          mapearNovoDto={data => {
            return data?.length
              ? data.map(linha => {
                  return {
                    ...linha,
                    colunaChave: `${linha?.nomeTurma}-${linha?.componenteCurricularCodigo}`,
                  };
                })
              : [];
          }}
        />
      ) : (
        ''
      )}
    </Col>
  );
};

export default ListaoPaginado;
