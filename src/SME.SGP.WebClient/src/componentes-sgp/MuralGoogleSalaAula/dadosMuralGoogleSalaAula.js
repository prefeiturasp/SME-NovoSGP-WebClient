import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import Loader from '~/componentes/loader';
import { erros } from '~/servicos';
import ServicoMuralGoogleSalaAula from '~/servicos/Paginas/MuralGoogleSalaAula/ServicoMuralGoogleSalaAula';

const DadosMuralGoogleSalaAula = props => {
  const { aulaId } = props;

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
            <div className="mb-3">
              <div>
                {`Data/Hora da publicação: ${
                  item?.dataPublicacao
                    ? moment(item.dataPublicacao).format('DD/MM/YYYY HH:mm')
                    : ''
                }`}
              </div>
              <div>{item?.email}</div>
              <div>{item?.mensagem}</div>
            </div>
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
};

DadosMuralGoogleSalaAula.defaultProps = {
  aulaId: 0,
};

export default DadosMuralGoogleSalaAula;
