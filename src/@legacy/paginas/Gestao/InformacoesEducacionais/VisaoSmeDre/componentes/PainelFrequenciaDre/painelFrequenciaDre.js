import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, DatePicker, Row, Col, Space, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import ptBR from 'antd/es/locale/pt_BR';
import CardCollapse from '~/componentes/cardCollapse';
import Button from '~/componentes/button';
import { Base } from '~/componentes';
import ServicoFrequenciaDiariaDre from '~/servicos/InformacoesEducacionais/ServicoFrequenciaDiariaDre';
import './painelFrequenciaDre.css';

dayjs.locale('pt-br');

function nivelToColor(nivel) {
  if (!nivel) return '#ccc';
  const texto = String(nivel)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  const cores = {
    alto: '#2ECC71',
    alta: '#2ECC71',
    medio: '#F1C40F',
    media: '#F1C40F',
    baixa: '#E74C3C',
    baixo: '#E74C3C',
  };
  for (const chave in cores) {
    if (texto.includes(chave)) return cores[chave];
  }
  return '#ccc';
}

export default function PainelFrequenciaDre({ dreCodigo, anoLetivo }) {
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [numeroRegistros, setNumeroRegistros] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [dataFrequencia, setDataFrequencia] = useState(() => dayjs());
  const [exibirCard, setExibirCard] = useState(false);

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
      align: 'center',
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
      title: 'Unidade educacional (UE)',
      dataIndex: 'ue',
      key: 'ue',
      align: 'left',
    },
    {
      title: 'Nível de frequência',
      dataIndex: 'nivelFrequencia',
      key: 'nivelFrequencia',
      align: 'center',
      width: 140,
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
    <ConfigProvider locale={ptBR}>
      <div className="painel-frequencia painel-frequencia-padding">
        <div className="painel-frequencia-introducao">
          <h2 className="painel-frequencia-titulo">Painel de frequência</h2>
          <p className="painel-frequencia-descricao">
            Aqui, você encontra informações sobre a frequência escolar dos
            alunos matriculados nas Unidades Educacionais (UEs) de São Paulo em{' '}
            {anoLetivo}. Busque uma DRE ou UE específica na barra de pesquisa ou
            consulte os dados na tabela abaixo.
          </p>
        </div>

        <div className="painel-frequencia-controles">
          <Row
            align="middle"
            justify="space-between"
            className="painel-frequencia-data-row"
          >
            <Col>
              <Space align="center">
                <span className="painel-frequencia-data-label">
                  Dados do dia:
                </span>
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
                  className="painel-frequencia-datepicker"
                  locale={ptBR}
                />
              </Space>
            </Col>
            <Col>
              <Space align="center" size={16}>
                <Button
                  label="← Dia anterior"
                  color="Roxo"
                  style="secondary"
                  border={true}
                  height="38px"
                  fontSize="1rem"
                  onClick={prevDay}
                  disabled={false}
                  className="btn-dia-anterior"
                />
                <Button
                  label="Próximo dia →"
                  color="Roxo"
                  style="primary"
                  border={false}
                  height="38px"
                  fontSize="1rem"
                  onClick={nextDay}
                  disabled={nextDisabled}
                  className={`btn-dia-proximo${
                    nextDisabled ? ' btn-dia-desabilitado' : ''
                  }`}
                />
              </Space>
            </Col>
          </Row>

          <div className="painel-frequencia-legenda">
            <span className="painel-frequencia-legenda-titulo">
              Nível de frequência:
            </span>
            <span className="painel-frequencia-legenda-item">
              <span className="quadrado-nivel-frequencia painel-frequencia-legenda-alto" />{' '}
              Alto
            </span>
            <span className="painel-frequencia-legenda-item">
              <span className="quadrado-nivel-frequencia painel-frequencia-legenda-medio" />{' '}
              Médio
            </span>
            <span className="painel-frequencia-legenda-item">
              <span className="quadrado-nivel-frequencia painel-frequencia-legenda-baixo" />{' '}
              Baixo
            </span>
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
          className="painel-frequencia-tabela"
        />
      </div>
    </ConfigProvider>
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
