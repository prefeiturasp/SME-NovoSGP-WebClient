import { useState } from 'react';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import Select from '~/componentes/select';
import { TIPO_FREQUENCIA_ENUM } from '../../../../../../../core/enum/tipo-frequencia-enum';
import './graficoFrequenciaSemanal.css';
import GraficoFrequenciaSemanal from './GraficoFrequenciaSemanal';
import PainelFrequenciaUe from '../PainelFrequenciaUe/painelFrequenciaUe';
import { Col, Row } from 'antd';

function GraficoFrequenciaSemanalCollapse({ ueCodigo, anoLetivo, ueNome }) {
  const [exibirGraficoFrequenciaVisaoUe, setExibirGraficoFrequenciaVisaoUe] =
    useState(false);

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

  const [frequenciaValue, setFrequenciaValue] = useState(listaOpcoes[0].value);

  const selectedOption = listaOpcoes.find(op => op.value === frequenciaValue);

  const handleChangeFrequencia = option => {
    if (option && typeof option === 'object' && 'value' in option) {
      setFrequenciaValue(Number(option.value));
    } else {
      setFrequenciaValue(Number(option));
    }
  };

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'frequencia-visao-ue-prof-coll';

  return (
    <CardCollapse
      titulo="Frequência"
      show={exibirGraficoFrequenciaVisaoUe}
      onClick={() =>
        setExibirGraficoFrequenciaVisaoUe(!exibirGraficoFrequenciaVisaoUe)
      }
      configCabecalho={configCabecalho}
      key={`${key}-collapse-key`}
      indice={`${key}-collapse-indice`}
    >
      {exibirGraficoFrequenciaVisaoUe && (
        <>
          <h5 className="tabela-frequencia-title">Média de frequência</h5>
          <div className="tabela-frequencia-header">
            <p className="tabela-frequencia-text">
              {selectedOption &&
              selectedOption.value === TIPO_FREQUENCIA_ENUM.FREQUENCIA_DIARIA
                ? `O gráfico representa a média de frequência diária dos alunos da ${ueNome} no último mês`
                : 'O gráfico representa a média de frequência semanal dos estudantes no último mês'}
            </p>
            <Select
              valueSelect={selectedOption}
              className="tabela-frequencia-select"
              onChange={handleChangeFrequencia}
              lista={listaOpcoes}
              valueOption="value"
              valueText="label"
              placeholder="Selecione uma opção"
              id="frequencia-select"
            />
          </div>
          {selectedOption &&
          selectedOption.value === TIPO_FREQUENCIA_ENUM.FREQUENCIA_DIARIA ? (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <PainelFrequenciaUe
                  anoLetivo={anoLetivo}
                  ueCodigo={ueCodigo}
                  nomeUe={ueNome}
                />
              </Col>
            </Row>
          ) : (
            <div>
              <GraficoFrequenciaSemanal
                ueCodigo={ueCodigo}
                anoLetivo={anoLetivo}
              />
            </div>
          )}
        </>
      )}
    </CardCollapse>
  );
}

export default GraficoFrequenciaSemanalCollapse;
GraficoFrequenciaSemanalCollapse.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueNome: PropTypes.string,
};

GraficoFrequenciaSemanalCollapse.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
  ueNome: '',
};
