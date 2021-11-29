import {
  faCalendarDay,
  faChalkboardTeacher,
  faFileAlt,
  faPencilRuler,
  faSpellCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ListaPaginada, Base } from '~/componentes';
import { BIMESTRE_FINAL, OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import ListaoContext from './listaoContext';

const ListaoPaginado = () => {
  const {
    anoLetivo,
    codigoUe,
    codigoDre,
    modalidade,
    semestre,
    codigoTurma,
    bimestre,
  } = useContext(ListaoContext);

  const [filtros, setFiltros] = useState({});
  const [colunas, setColunas] = useState([]);

  const temSemetreQuandoEja =
    modalidade === String(ModalidadeDTO.EJA) ? !!semestre : true;

  const valido = !!(
    anoLetivo &&
    codigoDre &&
    codigoUe &&
    modalidade &&
    temSemetreQuandoEja &&
    codigoTurma &&
    bimestre
  );
  const filtroEhValido = valido;

  const filtrar = useCallback(() => {
    if (filtroEhValido) {
      const params = {
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

  const montarIcone = icon => {
    return (
      <FontAwesomeIcon
        className="cor-branco-hover"
        style={{
          fontSize: '16px',
          color: Base.Azul,
          cursor: 'pointer',
        }}
        icon={icon}
      />
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
      },
      {
        title: 'Turno',
        dataIndex: 'turno',
        width: '12%',
      },
    ];

    if (modalidade === String(ModalidadeDTO.INFANTIL) && !ehBimestreFinal) {
      cols.push(
        {
          title: 'Frequência',
          ...confPadrao,
          render: () => montarIcone(faCalendarDay),
        },
        {
          title: 'Diário de bordo',
          ...confPadrao,
          render: () => montarIcone(faFileAlt),
        }
      );
    }

    if (modalidade !== String(ModalidadeDTO.INFANTIL) && !ehBimestreFinal) {
      cols.push(
        {
          title: 'Frequência',
          ...confPadrao,
          render: () => montarIcone(faCalendarDay),
        },
        {
          title: 'Plano de aula',
          ...confPadrao,
          render: () => montarIcone(faChalkboardTeacher),
        },
        {
          title: 'Avaliações',
          ...confPadrao,
          render: () => montarIcone(faSpellCheck),
        },
        {
          title: 'Fechamento',
          ...confPadrao,
          render: () => montarIcone(faPencilRuler),
        }
      );
    }

    if (ehBimestreFinal) {
      cols.push({
        title: 'Fechamento',
        ...confPadrao,
        render: () => montarIcone(faPencilRuler),
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
          colunas={colunas}
          filtro={filtros}
          filtroEhValido={filtroEhValido}
        />
      ) : (
        ''
      )}
    </Col>
  );
};

export default ListaoPaginado;
