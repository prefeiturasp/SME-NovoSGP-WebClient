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
import { Base, ListaPaginada } from '~/componentes';
import { BIMESTRE_FINAL, OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO, RotasDto } from '~/dtos';
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
import { history } from '~/servicos';
import {
  LISTAO_TAB_AVALIACOES,
  LISTAO_TAB_DIARIO_BORDO,
  LISTAO_TAB_FECHAMENTO,
  LISTAO_TAB_FREQUENCIA,
  LISTAO_TAB_PLANO_AULA,
  PARAMETROS,
} from '../listaoConstantes';
import ListaoContext from '../listaoContext';

const ListaoPaginado = () => {
  const dispatch = useDispatch();

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

  const temSemetreQuandoEja =
    modalidade === String(ModalidadeDTO.EJA) ? !!semestre : true;

  const filtroEhValido = !!(
    anoLetivo &&
    codigoDre &&
    codigoUe &&
    modalidade &&
    temSemetreQuandoEja &&
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
      history.push(RotasDto.LISTAO_OPERACOES);

      setCarregarFiltrosSalvos(true);
    }
  };

  const montarIcone = (icon, tab, params) => {
    const parametro = PARAMETROS[tab];
    const temPendencia = params[parametro];
    const iconePendencia = temPendencia ? faExclamationTriangle : faCheck;
    const corPendencia = temPendencia ? 'LaranjaCalendario' : 'Verde';

    return (
      <>
        <FontAwesomeIcon
          className="cor-branco-hover"
          style={{
            fontSize: '16px',
            color: Base.Azul,
            cursor: 'pointer',
          }}
          icon={icon}
          onClick={() => carregarFiltros(tab, params)}
        />
        <FontAwesomeIcon
          className="cor-branco-hover"
          style={{
            fontSize: '16px',
            color: Base[corPendencia],
            marginLeft: '12px',
          }}
          icon={iconePendencia}
        />
      </>
    );
  };

  const montarColunas = useCallback(() => {
    const ehBimestreFinal = bimestre === String(BIMESTRE_FINAL);
    const tamanhoColsTelas = '13%';

    const confPadrao = {
      align: 'center',
      width: tamanhoColsTelas,
      ellipsis: true,
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

    if (modalidade === String(ModalidadeDTO.INFANTIL) && !ehBimestreFinal) {
      cols.push(
        {
          title: 'Frequência',
          ...confPadrao,
          render: (_, params) =>
            montarIcone(faCalendarDay, LISTAO_TAB_FREQUENCIA, params),
        },
        {
          title: 'Diário de bordo',
          ...confPadrao,
          render: (_, params) =>
            montarIcone(faFileAlt, LISTAO_TAB_DIARIO_BORDO, params),
        }
      );
    }

    if (modalidade !== String(ModalidadeDTO.INFANTIL) && !ehBimestreFinal) {
      cols.push(
        {
          title: 'Frequência',
          ...confPadrao,
          render: (_, params) =>
            montarIcone(faCalendarDay, LISTAO_TAB_FREQUENCIA, params),
        },
        {
          title: 'Plano de aula',
          ...confPadrao,
          render: (_, params) =>
            montarIcone(faChalkboardTeacher, LISTAO_TAB_PLANO_AULA, params),
        },
        {
          title: 'Avaliações',
          ...confPadrao,
          render: (_, params) =>
            montarIcone(faSpellCheck, LISTAO_TAB_AVALIACOES, params),
        },
        {
          title: 'Fechamento',
          ...confPadrao,
          render: (_, params) =>
            montarIcone(faPencilRuler, LISTAO_TAB_FECHAMENTO, params),
        }
      );
    }

    if (ehBimestreFinal) {
      cols.push({
        title: 'Fechamento',
        ...confPadrao,
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
          colunaChave="nomeTurma"
          colunas={colunas}
          filtro={filtros}
          filtroEhValido={filtroEhValido}
          naoFiltrarQuandocarregando
        />
      ) : (
        ''
      )}
    </Col>
  );
};

export default ListaoPaginado;
