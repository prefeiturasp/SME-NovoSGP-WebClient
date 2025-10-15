import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './detalhesUe.css';
import ServicoDetalhesUe from '~/servicos/InformacoesEducacionais/ServicoDetalhesUe';
import { erros } from '~/servicos';
import { Loader } from '~/componentes';

function DetalhesUe({ codigoUe, nomeUe, nomeDre }) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function obterDados() {
      try {
        setLoading(true);
        const resposta = await ServicoDetalhesUe.obterDetalhesUe(codigoUe);
        setDados(resposta.data);
      } catch (error) {
        setDados(null);
        erros(error);
      } finally {
        setLoading(false);
      }
    }

    if (codigoUe) {
      obterDados();
    }
  }, [codigoUe]);

  if (loading) {
    return (
      <div className="mt-4">
        <Loader
          loading={loading}
          className={loading ? 'text-center' : ''}
          tip="Carregando..."
        />
      </div>
    );
  }

  return (
    <div className="detalhes-ue">
      <div className="escola-info">
        <h2>{nomeUe}</h2>
        <p>DRE {nomeDre}</p>
      </div>

      <div className="escola-dados">
        <p>
          <strong>Diretor(a):</strong> {dados.diretor}
        </p>
        <p>
          <strong>Telefone:</strong> {dados.telefone}
        </p>
        <p>
          <strong>E-mail:</strong> {dados.email}
        </p>
        <p>
          <strong>Número EOL:</strong> {dados.codigoEol}
        </p>
        <p>
          <strong>Número INEP:</strong> {dados.codigoInep}
        </p>
      </div>
    </div>
  );
}

DetalhesUe.propTypes = {
  codigoUe: PropTypes.string.isRequired,
  nomeUe: PropTypes.string,
  nomeDre: PropTypes.string,
};

DetalhesUe.defaultProps = {
  codigoUe: null,
  nomeUe: 'Nome da Escola',
  nomeDre: 'Nome da DRE',
};

export default DetalhesUe;
