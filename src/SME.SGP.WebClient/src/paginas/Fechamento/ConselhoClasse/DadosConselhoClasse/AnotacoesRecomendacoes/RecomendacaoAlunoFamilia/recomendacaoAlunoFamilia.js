import { Divider } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CardCollapse from '~/componentes/cardCollapse';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import ListaRecomendacaoAluno from './listaRecomendacaoAluno';
import ListaRecomendacaoFamilia from './listaRecomendacaoFamilia';

const RecomendacaoAlunoFamilia = props => {
  const {
    onChangeRecomendacaoAluno,
    onChangeRecomendacaoFamilia,
    dadosIniciais,
    alunoDesabilitado,
  } = props;

  const dentroPeriodo = useSelector(
    store => store.conselhoClasse.dentroPeriodo
  );

  const desabilitarCampos = useSelector(
    store => store.conselhoClasse.desabilitarCampos
  );

  const [exibirCardRecomendacao, setExibirCardRecomendacao] = useState(true);

  const onClickExpandirRecomendacao = () =>
    setExibirCardRecomendacao(!exibirCardRecomendacao);

  const onChangeAluno = valor => onChangeRecomendacaoAluno(valor);

  const onChangeFamilia = valor => onChangeRecomendacaoFamilia(valor);

  return (
    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
      <CardCollapse
        key="recomendacao-aluno-familia-collapse"
        onClick={onClickExpandirRecomendacao}
        titulo="Recomendações ao estudante e a família"
        indice="recomendacao-aluno-familia-collapse"
        show={exibirCardRecomendacao}
        alt="recomendacao-aluno-familia"
      >
        {exibirCardRecomendacao ? (
          <div className="row">
            <div className="col-md-12">
              <ListaRecomendacaoAluno />
            </div>
            <div className="col-md-12 mb-3 mt-3">
              <JoditEditor
                id="recomendacao-aluno"
                value={dadosIniciais.recomendacaoAluno}
                onChange={onChangeAluno}
                desabilitar={
                  alunoDesabilitado || desabilitarCampos || !dentroPeriodo
                }
                height="300px"
              />
            </div>
            <Divider />
            <div className="col-md-12">
              <ListaRecomendacaoFamilia />
            </div>
            <div className="col-md-12 mt-3">
              <JoditEditor
                id="recomendacao-familia"
                value={dadosIniciais.recomendacaoFamilia}
                onChange={onChangeFamilia}
                desabilitar={
                  alunoDesabilitado || desabilitarCampos || !dentroPeriodo
                }
                height="300px"
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </CardCollapse>
    </div>
  );
};

RecomendacaoAlunoFamilia.propTypes = {
  onChangeRecomendacaoAluno: PropTypes.func,
  onChangeRecomendacaoFamilia: PropTypes.func,
  dadosIniciais: PropTypes.oneOfType([PropTypes.object]),
  alunoDesabilitado: PropTypes.bool,
};

RecomendacaoAlunoFamilia.defaultProps = {
  onChangeRecomendacaoAluno: () => {},
  onChangeRecomendacaoFamilia: () => {},
  dadosIniciais: {},
  alunoDesabilitado: false,
};

export default RecomendacaoAlunoFamilia;
