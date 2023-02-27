import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import shortid from 'shortid';
import Loader from '~/componentes/loader';
import { erros } from '~/servicos';
import ServicoMuralGoogleSalaAula from '~/servicos/Paginas/MuralGoogleSalaAula/ServicoMuralGoogleSalaAula';
import CampoMensagem from './campoMensagem';
import CampoMensagemInfantil from './campoMensagemInfantil';

const DadosMuralGoogleSalaAula = props => {
  const { aulaId, podeAlterar, ehTurmaInfantil } = props;

  const [carregandoDados, setCarregandoDados] = useState(false);
  const [dados, setDados] = useState([]);
  const [atividades, setAtividades] = useState();

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

  const obterDadosAtividadesGoogleSalaAula = useCallback(async () => {
    setCarregandoDados(true);
    const resposta = await ServicoMuralGoogleSalaAula.obterDadosAtividadesGoogleSalaAula(
      aulaId
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDados(false));

    if (resposta?.data?.length) {
      setAtividades(resposta.data);
      return;
    }
    setAtividades([]);
  }, [aulaId]);

  useEffect(() => {
    if (ehTurmaInfantil) {
      obterDadosAtividadesGoogleSalaAula();
    }
  }, [aulaId, ehTurmaInfantil, obterDadosAtividadesGoogleSalaAula]);

  const montarDados = () => {
    if (ehTurmaInfantil)
      return <CampoMensagemInfantil mural={dados} atividades={atividades} />;

    if (dados?.length) {
      return dados.map(item => (
        <CampoMensagem
          podeAlterar={podeAlterar}
          item={item}
          key={shortid.generate()}
        />
      ));
    }

    return (
      <div className={`text-center ${carregandoDados ? 'mb-5 mt-4' : ''}`}>
        {!carregandoDados ? 'Sem dados' : ''}
      </div>
    );
  };

  return <Loader loading={carregandoDados}>{montarDados()}</Loader>;
};

DadosMuralGoogleSalaAula.propTypes = {
  aulaId: PropTypes.number,
  podeAlterar: PropTypes.bool,
  ehTurmaInfantil: PropTypes.bool,
};

DadosMuralGoogleSalaAula.defaultProps = {
  aulaId: 0,
  podeAlterar: true,
  ehTurmaInfantil: false,
};

export default DadosMuralGoogleSalaAula;
