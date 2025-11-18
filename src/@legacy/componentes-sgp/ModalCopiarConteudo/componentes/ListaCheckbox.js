import React from 'react';
import t from 'prop-types';

// Componentes
import { CheckboxComponent } from '~/componentes';
import {
  SGP_CHECKBOX_LICAO_CASA,
  SGP_CHECKBOX_OBJETIVOS_APRENDIZAGEM_MEUS_OBJETIVOS,
  SGP_CHECKBOX_OBJETIVOS_ESPECIFICOS_DESENVOLVIMENTO_AULA,
  SGP_CHECKBOX_RECUPERACAO_CONTINUA,
} from '~/constantes/ids/checkbox';

function ListaCheckbox({ onChange, valores }) {
  return (
    <>
      <CheckboxComponent
        id={SGP_CHECKBOX_OBJETIVOS_APRENDIZAGEM_MEUS_OBJETIVOS}
        className="mb-2"
        label="Objetivos de aprendizagem e meus objetivos (Currículo da Cidade)"
        name="objetivosAprendizagem"
        onChangeCheckbox={target => onChange(target, 'objetivosAprendizagem')}
        disabled
        checked={valores.objetivosAprendizagem}
      />
      <CheckboxComponent
        id={SGP_CHECKBOX_OBJETIVOS_ESPECIFICOS_DESENVOLVIMENTO_AULA}
        className="mb-2"
        label="Objetivos específicos e desenvolvimento da aula"
        name="desenvolvimentoAula"
        onChangeCheckbox={target => onChange(target, 'desenvolvimentoAula')}
        disabled
        checked={valores.desenvolvimentoAula}
      />
      <CheckboxComponent
        id={SGP_CHECKBOX_RECUPERACAO_CONTINUA}
        className="mb-2"
        label="Recuperação Contínua"
        name="recuperacaoContinua"
        onChangeCheckbox={target => onChange(target, 'recuperacaoContinua')}
        disabled={false}
        checked={valores.recuperacaoContinua}
      />
      <CheckboxComponent
        id={SGP_CHECKBOX_LICAO_CASA}
        className="mb-2"
        label="Lição de Casa"
        name="licaoCasa"
        onChangeCheckbox={target => onChange(target, 'licaoCasa')}
        disabled={false}
        checked={valores.licaoCasa}
      />
    </>
  );
}

ListaCheckbox.propTypes = {
  onChange: t.func,
  valores: t.oneOfType([t.object]),
};

ListaCheckbox.defaultProps = {
  onChange: null,
  valores: null,
};

export default ListaCheckbox;
