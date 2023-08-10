import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { TabelaRetratil } from '~/componentes';

const TabelaRetratilRelatorioPAP = ({
  onChangeAlunoSelecionado,
  children,
  permiteOnChangeAluno,
}) => {
  const estudantesRelatorioPAP = useSelector(
    store => store.relatorioPAP?.estudantesRelatorioPAP
  );

  return (
    <>
      {estudantesRelatorioPAP?.length && (
        <TabelaRetratil
          onChangeAlunoSelecionado={onChangeAlunoSelecionado}
          permiteOnChangeAluno={permiteOnChangeAluno}
          alunos={estudantesRelatorioPAP}
          pularDesabilitados
          exibirProcessoConcluido
        >
          {children}
        </TabelaRetratil>
      )}
    </>
  );
};

TabelaRetratilRelatorioPAP.propTypes = {
  onChangeAlunoSelecionado: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  permiteOnChangeAluno: PropTypes.func,
};

TabelaRetratilRelatorioPAP.defaultProps = {
  onChangeAlunoSelecionado: () => {},
  children: () => {},
  permiteOnChangeAluno: null,
};

export default TabelaRetratilRelatorioPAP;
