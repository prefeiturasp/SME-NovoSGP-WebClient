import { useState } from 'react';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import Select from '~/componentes/select';
import { TIPO_FREQUENCIA_ENUM } from '../../../../../../../core/enum/tipo-frequencia-enum';
import './graficoFrequenciaSemanal.css';
import GraficoFrequenciaSemanal from './GraficoFrequenciaSemanal';

function GraficoFrequenciaSemanalCollapse({ ueCodigo, anoLetivo }) {
  const [exibirGraficoFrequencia, setExibirGraficoFrequencia] = useState(true);
  const [frequencia, setFrequencia] = useState({
    label: 'Frequência semanal',
    value: TIPO_FREQUENCIA_ENUM.FREQUENCIA_SEMANAL,
  });

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'distorcao-prof-coll';

  const listaOpcoes = [
    {
      label: 'Frequência semanal',
      value: TIPO_FREQUENCIA_ENUM.FREQUENCIA_SEMANAL,
    },
    {
      label: 'Frequência diária',
      value: TIPO_FREQUENCIA_ENUM.FREQUENCIA_DIARIA,
    },
  ];

  return (
    <>
      <CardCollapse
        titulo="Frequência"
        show={exibirGraficoFrequencia}
        onClick={() => setExibirGraficoFrequencia(!exibirGraficoFrequencia)}
        configCabecalho={configCabecalho}
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
      >
        {exibirGraficoFrequencia && (
          <>
            <h5 className="tabela-frequencia-title">Média de frequência</h5>
            <div className="tabela-frequencia-header">
              <p className="tabela-frequencia-text">
                O gráfico representa a média de frequência semanal dos
                estudantes no último mês
              </p>
              <Select
                valueSelect={frequencia}
                className="tabela-frequencia-select"
                onChange={setFrequencia}
                lista={listaOpcoes}
                valueOption="value"
                valueText="label"
                placeholder="Selecione uma opção"
              />
            </div>
            <div>
              <GraficoFrequenciaSemanal
                ueCodigo={ueCodigo}
                anoLetivo={anoLetivo}
              />
            </div>
          </>
        )}
      </CardCollapse>
    </>
  );
}

GraficoFrequenciaSemanalCollapse.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoFrequenciaSemanalCollapse.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
};

export default GraficoFrequenciaSemanalCollapse;
