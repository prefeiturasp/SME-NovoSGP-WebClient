import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ListaFrequenciaPorBimestre from '~/componentes-sgp/ListaFrequenciaPorBimestre/listaFrequenciaPorBimestre';
import CardCollapse from '~/componentes/cardCollapse';
import { ModalidadeDTO } from '~/dtos';
import { erros } from '~/servicos';
import ServicoAcompanhamentoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoAcompanhamentoFrequencia';

const FrequenciaCardCollapse = props => {
  const dadosAlunoObjectCard = useSelector(
    store => store.acompanhamentoAprendizagem.dadosAlunoObjectCard
  );

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const ehInfantil = turmaSelecionada?.modalidade === ModalidadeDTO.INFANTIL;
  const { codigoEOL } = dadosAlunoObjectCard;

  const { semestreSelecionado } = props;

  const [dados, setDados] = useState([]);

  const componenteCurricularSelecionado = useSelector(
    state => state.registroIndividual.componenteCurricularSelecionado
  );

  const obterInformacoesEscolaresDoAluno = useCallback(async () => {
    const resposta = await ServicoAcompanhamentoFrequencia.obterInformacoesDeFrequenciaAlunoPorSemestre(
      turmaSelecionada?.id,
      semestreSelecionado,
      codigoEOL,
      componenteCurricularSelecionado
    ).catch(e => erros(e));

    if (resposta?.data) {
      setDados(resposta.data);
    } else {
      setDados([]);
    }
  }, [
    turmaSelecionada,
    codigoEOL,
    semestreSelecionado,
    componenteCurricularSelecionado,
  ]);

  useEffect(() => {
    obterInformacoesEscolaresDoAluno();
  }, [obterInformacoesEscolaresDoAluno]);

  const [exibir, setExibir] = useState(true);

  const onClickExpandir = () => setExibir(!exibir);

  return (
    <div className="col-md-12 mb-2">
      <CardCollapse
        key="frequencia-acompanhamento-aprendizagem-collapse"
        onClick={onClickExpandir}
        titulo="Frequência"
        indice="frequencia-acompanhamento-aprendizagem"
        show={exibir}
        alt="frequencia-acompanhamento-aprendizagem"
      >
        {dados?.length ? (
          <ListaFrequenciaPorBimestre
            dados={dados}
            turmaId={turmaSelecionada?.id}
            codigoAluno={codigoEOL}
            esconderBimestre={ehInfantil}
          />
        ) : (
          ''
        )}
      </CardCollapse>
    </div>
  );
};

FrequenciaCardCollapse.propTypes = {
  semestreSelecionado: PropTypes.string,
};

FrequenciaCardCollapse.defaultProps = {
  semestreSelecionado: '',
};

export default FrequenciaCardCollapse;
