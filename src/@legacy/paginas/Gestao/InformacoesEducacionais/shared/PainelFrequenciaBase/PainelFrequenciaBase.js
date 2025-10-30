import React, { useState, useEffect, useCallback } from 'react';
import { Table, DatePicker, Row, Col, Space, ConfigProvider } from 'antd';
import ptBR from 'antd/es/locale/pt_BR';
import Button from '~/componentes/button';
import nivelParaCor from './nivelParaCor';
import ServicoFrequenciaDiaria from '~/servicos/InformacoesEducacionais/ServicoFrequenciaDiaria';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import './painelFrequenciaBase.css';

dayjs.locale('pt-br');

function getDefaultColumns(tipoExtra) {
  const extra =
    tipoExtra === 'ue'
      ? [
          {
            title: 'Turma',
            dataIndex: 'turma',
            key: 'turma',
            align: 'left',
            width: 120,
          },
        ]
      : [
          {
            title: 'Unidade educacional (UE)',
            dataIndex: 'ue',
            key: 'ue',
            align: 'left',
          },
        ];
  return [
    {
      title: 'Indicação',
      dataIndex: 'indicacao',
      key: 'indicacao',
      width: 64,
      align: 'center',
      render: (_, record) => {
        const color = nivelParaCor(record.nivelFrequencia);
        return (
          <div className="indicacao-cell">
            <span className="indicacao-badge" style={{ background: color }} />
          </div>
        );
      },
    },
    ...extra,
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
}

export default function PainelFrequenciaBase({ tipoExtra, codigo, anoLetivo }) {
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [numeroRegistros, setNumeroRegistros] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [dataFrequencia, setDataFrequencia] = useState(() => dayjs());

  const fetch = useCallback(async () => {
    if (!codigo || !anoLetivo) {
      setDados([]);
      setTotalRegistros(0);
      return;
    }
    setLoading(true);
    try {
      const resposta =
        tipoExtra === 'ue'
          ? await ServicoFrequenciaDiaria.ObterFrequenciaDiariaUe({
              anoLetivo,
              codigoUe: codigo,
              dataFrequencia: dataFrequencia
                ? dataFrequencia.format('YYYY-MM-DD')
                : undefined,
              numeroPagina: pagina,
              numeroRegistros: numeroRegistros,
            })
          : await ServicoFrequenciaDiaria.ObterFrequenciaDiariaDre({
              anoLetivo,
              codigoDre: codigo,
              dataFrequencia: dataFrequencia
                ? dataFrequencia.format('YYYY-MM-DD')
                : undefined,
              numeroPagina: pagina,
              numeroRegistros: numeroRegistros,
            });

      const lista =
        tipoExtra === 'ue'
          ? resposta.data?.turmas || []
          : resposta.data?.ues || [];
      setDados(
        lista.map((item, idx) => ({
          key:
            tipoExtra === 'ue'
              ? `${item.turma || idx}`
              : `${item.ue || 'ue'}-${idx}`,
          ...item,
        }))
      );
      setTotalRegistros(Number(resposta.data?.totalRegistros) || lista.length);
    } catch {
      setDados([]);
      setTotalRegistros(0);
    } finally {
      setLoading(false);
    }
  }, [codigo, anoLetivo, pagina, dataFrequencia, numeroRegistros, tipoExtra]);

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

  const columns = getDefaultColumns(tipoExtra);

  return (
    <ConfigProvider locale={ptBR}>
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
            tipoExtra === 'ue'
              ? `${range[0]}-${range[1]} de ${total} turmas`
              : `${range[0]}-${range[1]} de ${total} unidades educacionais`,
          locale: { items_per_page: '' },
        }}
        bordered
        size="small"
        locale={{ emptyText: 'Sem dados' }}
        className="painel-frequencia-tabela"
      />
    </ConfigProvider>
  );
}
