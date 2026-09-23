import { useEffect, useState } from 'react';
import TabelaIdebAnosAnterioresDetalhes from './tabelaIdebAnosAnterioresDetalhes';
import ServicoIdebTabela from '~/servicos/InformacoesEducacionais/ServicoIdebTabela';
import { erros } from '~/servicos/alertas';
import PropTypes from 'prop-types';
import { Loader } from '~/componentes';

import comDefaultProps from '~/utils/comDefaultProps';
function TabelaIdebAnosAnteriores({ ueCodigo, anoLetivo }) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const obterDados = async () => {
      setCarregando(true);
      try {
        const response = await ServicoIdebTabela.obterIdebTabela(
          null,
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
  }, [ueCodigo]);

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
    <TabelaIdebAnosAnterioresDetalhes dados={dados} anoLetivo={anoLetivo} />
  );
}

TabelaIdebAnosAnteriores.propTypes = {
  ueCodigo: PropTypes.string.isRequired,
  anoLetivo: PropTypes.string.isRequired,
};

TabelaIdebAnosAnteriores.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
};

export default comDefaultProps(TabelaIdebAnosAnteriores, TabelaIdebAnosAnteriores.defaultProps);
