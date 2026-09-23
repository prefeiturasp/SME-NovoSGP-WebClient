import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import ServicoIdebTabela from '~/servicos/InformacoesEducacionais/ServicoIdebTabela';
import { erros } from '~/servicos/alertas';
import TabelaIdebDetalhes from './tabelaIdebDetalhes';

import comDefaultProps from '~/utils/comDefaultProps';
function TabelaIdeb({ anoLetivo, ueCodigo }) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const obterDados = async () => {
      setCarregando(true);
      try {
        const response = await ServicoIdebTabela.obterIdebTabela(
          anoLetivo,
          ueCodigo
        );

        setDados(response.data);
      } catch (error) {
        erros(error);
      } finally {
        setCarregando(false);
      }
    };

    obterDados();
  }, [anoLetivo, ueCodigo]);

  if (carregando) {
    return (
      <div className="mt-4">
        <Loader
          loading={carregando}
          className={carregando ? 'text-center' : ''}
          tip="Carregando..."
        />
      </div>
    );
  }

  return (
    <>
      <TabelaIdebDetalhes
        dados={dados}
        carregando={carregando}
        ueCodigo={ueCodigo}
        anoLetivo={anoLetivo}
      />
    </>
  );
}

TabelaIdeb.propTypes = {
  anoLetivo: PropTypes.string.isRequired,
  ueCodigo: PropTypes.string.isRequired,
};

TabelaIdeb.defaultProps = {
  anoLetivo: null,
  ueCodigo: null,
};

export default comDefaultProps(TabelaIdeb, TabelaIdeb.defaultProps);
