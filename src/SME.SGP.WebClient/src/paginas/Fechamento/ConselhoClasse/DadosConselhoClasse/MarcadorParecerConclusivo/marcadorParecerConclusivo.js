import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { statusParecerConclusivo } from '~/dtos';
import { Loader } from '~/componentes';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import { erros } from '~/servicos';
import { LabelParecer, IconeEstilizado } from './marcadorParecerConclusivo.css';

const MarcadorParecerConclusivo = () => {
  const [sincronizando, setSincronizando] = useState(false);

  const dadosPrincipaisConselhoClasse = useSelector(
    store => store.conselhoClasse.dadosPrincipaisConselhoClasse
  );
  const {
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
  } = dadosPrincipaisConselhoClasse;

  const marcadorParecerConclusivo = useSelector(
    store => store.conselhoClasse.marcadorParecerConclusivo
  );

  const gerandoParecerConclusivo = useSelector(
    store => store.conselhoClasse.gerandoParecerConclusivo
  );

  const [parecer, setParecer] = useState('');

  useEffect(() => {
    const nomeConcatenado = marcadorParecerConclusivo?.emAprovacao
      ? `${marcadorParecerConclusivo?.nome} (Aguardando aprovação)`
      : marcadorParecerConclusivo?.nome;
    const nomeParecer =
      Object.keys(marcadorParecerConclusivo).length &&
      `Parecer conclusivo: ${nomeConcatenado || 'Sem parecer'}`;

    setParecer(nomeParecer);
  }, [marcadorParecerConclusivo]);

  const montarDescricao = () => {
    if (gerandoParecerConclusivo) {
      return 'Gerando parecer conclusivo';
    }
    return parecer;
  };

  const sincronizar = async () => {
    setSincronizando(true);
    const retorno = await ServicoConselhoClasse.gerarParecerConclusivo(
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo
    )
      .catch(e => erros(e))
      .finally(() => setSincronizando(false));
    if (retorno?.data) {
      ServicoConselhoClasse.setarParecerConclusivo(retorno.data);
    }
  };

  const exibirIconeSincronizar = () => {
    return (
      statusParecerConclusivo.RETIDO === parecer ||
      statusParecerConclusivo.RETIDO_FREQUENCIA === parecer
    );
  };

  return (
    <>
      {parecer ? (
        <div className="col-m-12 d-flex ml-3 my-3">
          {marcadorParecerConclusivo?.emAprovacao ? (
            <Tooltip title="Aguardando aprovação">
              <LabelParecer>
                <Loader loading={gerandoParecerConclusivo} tip="">
                  <span>{montarDescricao()}</span>
                </Loader>
              </LabelParecer>
            </Tooltip>
          ) : (
            <LabelParecer>
              <Loader loading={gerandoParecerConclusivo} tip="">
                <span>{montarDescricao()}</span>
              </Loader>
            </LabelParecer>
          )}
          {exibirIconeSincronizar && (
            <Tooltip title="Gerar Parecer Conclusivo">
              <IconeEstilizado
                icon={faSyncAlt}
                onClick={sincronizar}
                sincronizando={sincronizando}
              />
            </Tooltip>
          )}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default MarcadorParecerConclusivo;
