import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import shortid from 'shortid';
import Loader from '~/componentes/loader';
import { erros } from '~/servicos';
import ServicoMuralGoogleSalaAula from '~/servicos/Paginas/MuralGoogleSalaAula/ServicoMuralGoogleSalaAula';
import CampoMensagem from './campoMensagem';

const DadosMuralGoogleSalaAula = props => {
  const { aulaId, podeAlterar } = props;

  const [carregandoDados, setCarregandoDados] = useState(false);
  const [dados, setDados] = useState([]);

  const obterDadosMuralGoogleSalaAula = useCallback(async () => {
    setCarregandoDados(true);
    const resposta = await ServicoMuralGoogleSalaAula.obterDadosMuralGoogleSalaAula(
      aulaId
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDados(false));

    if (resposta?.data?.length) {
      setDados(resposta.data);
    } else {
      setDados([]);
    }
  }, [aulaId]);

  useEffect(() => {
    obterDadosMuralGoogleSalaAula();
  }, [aulaId, obterDadosMuralGoogleSalaAula]);

  return (
    <Loader loading={carregandoDados}>
      {dados?.length ? (
        dados.map(item => {
          return (
            <CampoMensagem
              podeAlterar={podeAlterar}
              item={item}
              key={shortid.generate()}
            />
          );
        })
      ) : (
        <div className={`text-center ${carregandoDados ? 'mb-5 mt-4' : ''}`}>
          {!carregandoDados ? 'Sem dados' : ''}
        </div>
      )}
    </Loader>
  );
};

DadosMuralGoogleSalaAula.propTypes = {
  aulaId: PropTypes.number,
  podeAlterar: PropTypes.bool,
};

DadosMuralGoogleSalaAula.defaultProps = {
  aulaId: 0,
  podeAlterar: true,
};

export default DadosMuralGoogleSalaAula;
