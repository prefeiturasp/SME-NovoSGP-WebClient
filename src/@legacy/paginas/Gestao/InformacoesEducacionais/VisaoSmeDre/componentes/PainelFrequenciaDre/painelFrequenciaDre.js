import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import ptBR from 'antd/lib/locale/pt_BR';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import ServicoFrequenciaDiariaDre from '~/servicos/InformacoesEducacionais/ServicoFrequenciaDiariaDre';
import './painelFrequenciaDre.css';

function formatDateIso(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}

function formatDisplayDate(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function toIsoDateString(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

function nivelToColor(nivel) {
  if (!nivel) return '#ccc';
  const n = String(nivel)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  if (n.includes('alta') || n.includes('alto')) return '#2ECC71';
  if (n.includes('media') || n.includes('medio') || n.includes('média'))
    return '#F1C40F';
  if (n.includes('baixa') || n.includes('baixo')) return '#E74C3C';

  return '#ccc';
}

dayjs.locale('pt-br');

export default function PainelFrequenciaDre({ dreCodigo, anoLetivo }) {
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [numeroRegistros, setNumeroRegistros] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [dataFrequencia, setDataFrequencia] = useState(() => dayjs());

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };
  const key = 'painel-frequencia-dre';

  const fetch = useCallback(async () => {
    if (!dreCodigo || !anoLetivo) {
      setDados([]);
      setTotalPaginas(0);
      setTotalRegistros(0);
      return;
    }
    setLoading(true);
    try {
      const resposta =
        await ServicoFrequenciaDiariaDre.ObterFrequenciaDiariaDre({
          anoLetivo,
          codigoDre: dreCodigo,
          dataFrequencia: dataFrequencia
            ? dataFrequencia.format('YYYY-MM-DD')
            : undefined,
          numeroPagina: pagina,
          numeroRegistros: numeroRegistros,
        });

      const ues = resposta.data?.ues || [];
      setDados(
        ues.map((u, idx) => ({
          key: `${u.ue || 'ue'}-${idx}`,
          data: formatDateIso(u.data),
          ue: u.ue,
          quantidadeEstudantes: u.quantidadeEstudantes,
          estudantesPresentes: u.estudantesPresentes,
          percentualFrequencia: u.percentualFrequencia,
          nivelFrequencia: u.nivelFrequencia,
        }))
      );

      setTotalPaginas(Number(resposta.data?.totalPaginas) || 0);
      setTotalRegistros(Number(resposta.data?.totalRegistros) || ues.length);
    } catch {
      setDados([]);
      setTotalPaginas(0);
      setTotalRegistros(0);
    } finally {
      setLoading(false);
    }
  }, [dreCodigo, anoLetivo, pagina, dataFrequencia, numeroRegistros]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const prevDay = () => {
    setDataFrequencia(d =>
      d ? d.subtract(1, 'day') : dayjs().subtract(1, 'day')
    );
    setPagina(1);
  };
  const nextDay = () => {
    setDataFrequencia(d => (d ? d.add(1, 'day') : dayjs().add(1, 'day')));
    setPagina(1);
  };
  const nextDisabled =
    !dataFrequencia || !dataFrequencia.isBefore(dayjs(), 'day');

  const columns = [
    {
      title: 'Indicação',
      dataIndex: 'indicacao',
      key: 'indicacao',
      width: 64,
      render: (_, record) => {
        const color = nivelToColor(record.nivelFrequencia);
        return (
          <div className="indicacao-cell">
            <span className="indicacao-badge" style={{ background: color }} />
          </div>
        );
      },
    },
    {
      title: 'Nível de frequência',
      dataIndex: 'nivelFrequencia',
      key: 'nivelFrequencia',
      align: 'center',
      width: 140,
    },
    {
      title: 'Unidade educacional (UE)',
      dataIndex: 'ue',
      key: 'ue',
      align: 'left',
    },
    {
      title: 'Qtde. estudantes',
      dataIndex: 'quantidadeEstudantes',
      key: 'quantidadeEstudantes',
      align: 'center',
      width: 140,
    },
    {
      title: 'Estudantes presentes',
      dataIndex: 'estudantesPresentes',
      key: 'estudantesPresentes',
      align: 'center',
      width: 160,
    },
    {
      title: '% de frequência',
      dataIndex: 'percentualFrequencia',
      key: 'percentualFrequencia',
      align: 'center',
      width: 120,
      render: v => (v != null ? `${v}%` : '-'),
    },
  ];

  return (
    <>
      <div className="painel-frequencia-top">
        <div className="painel-frequencia-intro">
          <h2 className="painel-frequencia-title">Painel de frequência</h2>
          <p className="painel-frequencia-desc">
            Aqui, você encontra informações sobre a frequência escolar dos
            alunos matriculados nas Unidades Educacionais (UEs) de São Paulo em{' '}
            {anoLetivo}. Busque uma DRE ou UE específica na barra de pesquisa ou
            consulte os dados na tabela abaixo.
          </p>
        </div>

        <div className="painel-frequencia-controls">
          <div className="painel-frequencia-date">
            <label className="painel-frequencia-date-label">
              Dados do dia:
            </label>
            <div className="painel-frequencia-date-row">
              <DatePicker
                value={dataFrequencia}
                format="DD/MM/YYYY"
                onChange={date => {
                  if (date) {
                    setDataFrequencia(date);
                    setPagina(1);
                  }
                }}
                allowClear={false}
              />
              <button
                type="button"
                className="btn-day btn-day-prev"
                onClick={prevDay}
                aria-label="Dia anterior"
              >
                ← Dia anterior
              </button>
              <button
                type="button"
                className={`btn-day btn-day-next ${
                  nextDisabled ? 'disabled' : ''
                }`}
                onClick={nextDay}
                aria-label="Próximo dia"
                disabled={nextDisabled}
              >
                Próximo dia →
              </button>
            </div>
          </div>

          <div className="painel-frequencia-legend">
            <span className="legend-item">
              <span className="legend-square legend-alto" /> Alta
            </span>
            <span className="legend-item">
              <span className="legend-square legend-medio" /> Média
            </span>
            <span className="legend-item">
              <span className="legend-square legend-baixo" /> Baixa
            </span>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dados}
        loading={loading}
        pagination={{
          pageSize: numeroRegistros,
          current: pagina,
          total: totalRegistros,
          onChange: (p, size) => {
            setPagina(p);
            if (size && size !== numeroRegistros) setNumeroRegistros(size);
          },
          showSizeChanger: true,
          pageSizeOptions: ['10', '25', '50', '100'],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} unidades educacionais`,
          locale: { items_per_page: '' },
        }}
        bordered
        size="small"
        locale={{ emptyText: 'Sem dados' }}
        className="painel-frequencia-table"
      />
    </>
  );
}

PainelFrequenciaDre.propTypes = {
  dreCodigo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anoLetivo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PainelFrequenciaDre.defaultProps = {
  dreCodigo: null,
  anoLetivo: null,
};
