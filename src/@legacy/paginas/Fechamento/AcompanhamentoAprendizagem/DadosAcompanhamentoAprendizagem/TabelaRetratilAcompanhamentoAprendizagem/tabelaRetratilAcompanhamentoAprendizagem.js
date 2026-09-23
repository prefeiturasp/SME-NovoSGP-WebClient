import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import TabelaRetratil from '~/componentes/TabelaRetratil';

import comDefaultProps from '~/utils/comDefaultProps';
const TabelaRetratilAcompanhamentoAprendizagem = ({
  onChangeAlunoSelecionado,
  permiteOnChangeAluno,
  alunosValidar,
  children,
}) => {
  const alunosAcompanhamentoAprendizagem = useSelector(
    store => store.acompanhamentoAprendizagem.alunosAcompanhamentoAprendizagem
  );

  const codigoAlunoSelecionado = useSelector(
    store => store.acompanhamentoAprendizagem.codigoAlunoSelecionado
  );

  return (
    <>
      {alunosAcompanhamentoAprendizagem?.length ? (
        <TabelaRetratil
          onChangeAlunoSelecionado={onChangeAlunoSelecionado}
          permiteOnChangeAluno={permiteOnChangeAluno}
          alunos={alunosAcompanhamentoAprendizagem}
          alunosValidar={alunosValidar}
          codigoAlunoSelecionado={codigoAlunoSelecionado}
          pularDesabilitados
          larguraAluno="60%"
          tituloCabecalho="Detalhes da criança"
        >
          {children}
        </TabelaRetratil>
      ) : (
        ''
      )}
    </>
  );
};

TabelaRetratilAcompanhamentoAprendizagem.propTypes = {
  onChangeAlunoSelecionado: PropTypes.func,
  permiteOnChangeAluno: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.any]),
};

TabelaRetratilAcompanhamentoAprendizagem.defaultProps = {
  onChangeAlunoSelecionado: () => {},
  permiteOnChangeAluno: () => {},
  children: () => {},
};

export default comDefaultProps(TabelaRetratilAcompanhamentoAprendizagem, TabelaRetratilAcompanhamentoAprendizagem.defaultProps);