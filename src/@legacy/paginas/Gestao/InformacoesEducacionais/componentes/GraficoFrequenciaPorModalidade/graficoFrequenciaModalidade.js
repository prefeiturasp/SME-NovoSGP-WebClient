import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';
import ServicoFrequencia from '~/servicos/InformacoesEducacionais/ServicoFrequencia';
import { gerarCoresDinamicas } from '~/utils/coresDinamicas';

const GraficoFrequenciaModalidade = ({
  dreId,
  periodicidade: periodicidadeProp = 'mensal',
}) => {
  const [dados, setDados] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [dataAtual] = useState(moment().format('DD/MM/YYYY'));
  const [cores, setCores] = useState([]);
  const [periodicidade, setPeriodicidade] = useState(periodicidadeProp);
  const listaPeriodicidade = [
    { valor: 'mensal', desc: 'Mensal (ano atual)' },
    { valor: 'anual', desc: 'Anual' },
  ];

  const formatarDadosMensais = resposta => {
    if (!resposta?.data?.length) return [];
    const nomesMes = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const mapa = new Map();

    resposta.data.forEach(item => {
      const chave = `${item.ano}-${item.mes}-${item.modalidade}`;
      const existente = mapa.get(chave) || {
        aulas: 0,
        presencas: 0,
        modalidade: item.modalidade,
        mesNumero: item.mes,
        ano: item.ano,
      };
      const aulas = item.totalAulas || 0;
      const ausencias = item.totalAusencias || 0;
      existente.aulas += aulas;
      existente.presencas += Math.max(aulas - ausencias, 0);
      mapa.set(chave, existente);
    });

    return Array.from(mapa.values())
      .map(r => ({
        mes: `${String(r.mesNumero).padStart(2, '0')}/${r.ano}`,
        mesLabel: nomesMes[r.mesNumero - 1] || r.mesNumero,
        ordemMes: r.ano * 100 + r.mesNumero,
        modalidade: r.modalidade,
        valor: r.aulas ? Number(((r.presencas / r.aulas) * 100).toFixed(2)) : 0,
      }))
      .sort((a, b) => a.ordemMes - b.ordemMes);
  };

  const agruparDadosAnuais = resposta => {
    if (!resposta?.data?.length) return [];
    const mapa = new Map();

    resposta.data.forEach(item => {
      const chave = item.modalidade;
      const existente = mapa.get(chave) || {
        aulas: 0,
        presencas: 0,
        modalidade: item.modalidade,
      };
      const aulas = item.totalAulas || 0;
      const ausencias = item.totalAusencias || 0;
      existente.aulas += aulas;
      existente.presencas += Math.max(aulas - ausencias, 0);
      mapa.set(chave, existente);
    });

    return Array.from(mapa.values()).map(r => ({
      modalidade: r.modalidade,
      valor: r.aulas ? Number(((r.presencas / r.aulas) * 100).toFixed(2)) : 0,
    }));
  };

  const carregarDadosApi = useCallback(async () => {
    if (dreId === undefined || dreId === null) {
      setDados([]);
      return;
    }

    setExibirLoader(true);
    try {
      const dreIdFinal = dreId;
      const ehTodas = dreIdFinal === OPCAO_TODOS || dreIdFinal === '-99';
      let resposta;

      if (periodicidade === 'mensal') {
        resposta = ehTodas
          ? await ServicoFrequencia.obterFrequenciaMensal()
          : await ServicoFrequencia.obterFrequenciaMensal(dreIdFinal);

        if (resposta.status === 200 && resposta.data) {
          const dadosFormatados = formatarDadosMensais(resposta);
          setDados(dadosFormatados);
          const modalidadesUnicas = [
            ...new Set(dadosFormatados.map(i => i.modalidade)),
          ];
          setCores(gerarCoresDinamicas(modalidadesUnicas.length));
        } else setDados([]);
      } else {
        resposta = ehTodas
          ? await ServicoFrequencia.obterFrequenciaGlobal()
          : await ServicoFrequencia.obterFrequenciaGlobal(dreIdFinal);

        if (resposta.status === 200 && resposta.data) {
          const dadosFormatados = agruparDadosAnuais(resposta);
          setDados(dadosFormatados);
          const modalidadesUnicas = [
            ...new Set(dadosFormatados.map(i => i.modalidade)),
          ];
          setCores(gerarCoresDinamicas(modalidadesUnicas.length));
        } else setDados([]);
      }
    } catch (error) {
      if (error.response?.data?.mensagens?.length > 0)
        erros(error.response.data.mensagens.join(', '));
      else erros('Erro ao carregar dados de frequência');
      setDados([]);
    } finally {
      setExibirLoader(false);
    }
  }, [dreId, periodicidade]);

  useEffect(() => {
    carregarDadosApi();
  }, [dreId, periodicidade, carregarDadosApi]);

  // Sincroniza periodicidade local com prop se vier a mudar
  useEffect(() => {
    setPeriodicidade(periodicidadeProp);
  }, [periodicidadeProp]);

  const ehMensal = periodicidade === 'mensal';
  const titulo = 'Frequência';

  return (
    <>
      <div className="mb-3">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h5
              className="mb-2"
              style={{
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 0,
              }}
            >
              {titulo}
            </h5>
            <p
              className="text-muted"
              style={{
                fontSize: '14px',
                marginTop: 0,
                marginBottom: 0,
                color: '#42474a',
              }}
            >
              É o índice da média de frequência dos estudantes nas Unidades
              Educacionais da Rede Municipal de São Paulo.
            </p>
          </div>
          <div style={{ minWidth: 220, marginTop: 16 }}>
            <SelectComponent
              label=""
              lista={listaPeriodicidade}
              valueOption="valor"
              valueText="desc"
              onChange={valor => setPeriodicidade(valor)}
              valueSelect={periodicidade}
              placeholder="Selecione a periodicidade"
            />
          </div>
        </div>
      </div>
      <Loader
        loading={exibirLoader}
        className={exibirLoader ? 'text-center' : ''}
        tip="Carregando dados de frequência..."
      >
        {dados?.length ? (
          <GraficoBarras
            data={dados}
            isGroup={ehMensal ? true : false}
            xField={ehMensal ? 'mesLabel' : 'modalidade'}
            yField="valor"
            seriesField="modalidade"
            colors={cores.length ? cores : undefined}
            xAxisVisible
            legendVisible={ehMensal}
            labelVisible
            tooltip={{
              formatter: datum => ({
                name: datum.modalidade,
                value: `${datum.valor}%`,
              }),
            }}
          />
        ) : !exibirLoader ? (
          <div className="text-center">Sem dados</div>
        ) : null}
      </Loader>
    </>
  );
};

GraficoFrequenciaModalidade.propTypes = {
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  periodicidade: PropTypes.string,
};

GraficoFrequenciaModalidade.defaultProps = {
  dreId: null,
  periodicidade: 'mensal',
};

export default GraficoFrequenciaModalidade;
