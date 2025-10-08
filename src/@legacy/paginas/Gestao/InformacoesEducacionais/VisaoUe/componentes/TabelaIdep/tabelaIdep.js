import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import ServicoIdepTabela from '~/servicos/InformacoesEducacionais/ServicoIdepTabela';
import { erros } from '~/servicos/alertas';
import TabelaIdepDetalhes from './tabelaIdepDetalhes';

export default function TabelaIdep({ anoLetivo, ueCodigo }) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const obterDados = async () => {
      setCarregando(true);
      try {
        const response = await ServicoIdepTabela.obterIdepTabela(
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
      <TabelaIdepDetalhes
        dados={dados}
        carregando={carregando}
        ueCodigo={ueCodigo}
      />
    </>
  );
}

TabelaIdep.propTypes = {
  anoLetivo: PropTypes.string.isRequired,
  ueCodigo: PropTypes.string.isRequired,
};

TabelaIdep.defaultProps = {
  anoLetivo: null,
  ueCodigo: null,
};
