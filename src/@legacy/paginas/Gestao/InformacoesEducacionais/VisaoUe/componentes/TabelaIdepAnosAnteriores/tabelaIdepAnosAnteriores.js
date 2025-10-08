import { useEffect, useState } from 'react';
import TabelaIdepAnosAnterioresDetalhes from './tabelaIdepAnosAnterioresDetalhes';
import ServicoIdepTabela from '~/servicos/InformacoesEducacionais/ServicoIdepTabela';
import { erros } from '~/servicos/alertas';
import PropTypes from 'prop-types';
import { Loader } from '~/componentes';

export default function TabelaIdepAnosAnteriores({ ueCodigo }) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const obterDados = async () => {
      setCarregando(true);
      try {
        const response = await ServicoIdepTabela.obterIdepTabela(
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
    <TabelaIdepAnosAnterioresDetalhes dados={dados} carregando={carregando} />
  );
}

TabelaIdepAnosAnteriores.propTypes = {
  ueCodigo: PropTypes.string.isRequired,
};

TabelaIdepAnosAnteriores.defaultProps = {
  ueCodigo: null,
};
