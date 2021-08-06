import React, { useState, useEffect } from 'react';
import t from 'prop-types';

// Componentes
import { SelectComponent } from '~/componentes';

// Servicos
import AtribuicaoCJServico from '~/servicos/Paginas/AtribuicaoCJ';

// Funções
import { valorNuloOuVazio } from '~/utils/funcoes/gerais';

function ModalidadesDropDown({ label, form, onChange, disabled }) {
  const [listaModalidades, setListaModalidades] = useState([]);

  const { ueId, anoLetivo, modalidadeId } = form.values;

  useEffect(() => {
    async function buscarModalidades() {
      const { data } = await AtribuicaoCJServico.buscarModalidades(
        ueId,
        anoLetivo
      );
      if (data) {
        setListaModalidades(
          data.map(item => ({
            desc: item.nome,
            valor: String(item.id),
          }))
        );
      }
    }
    if (!ueId) return;
    buscarModalidades();
  }, [ueId, anoLetivo]);

  useEffect(() => {
    if (listaModalidades.length === 1) {
      form.setFieldValue('modalidadeId', listaModalidades[0].valor);
      onChange(listaModalidades[0].valor);
    }
  }, [listaModalidades]);

  useEffect(() => {
    onChange();
    if (!valorNuloOuVazio(modalidadeId)) {
      onChange(modalidadeId);
    }
  }, [modalidadeId]);

  return (
    <SelectComponent
      label={!label ? null : label}
      form={form}
      name="modalidadeId"
      className="fonte-14"
      onChange={onChange}
      lista={listaModalidades}
      valueOption="valor"
      valueText="desc"
      placeholder="Modalidade"
      disabled={disabled}
    />
  );
}

ModalidadesDropDown.propTypes = {
  form: t.oneOfType([t.objectOf(t.object), t.any]),
  onChange: t.func,
  label: t.string,
  disabled: t.bool,
  anoLetivo: t.string,
};

ModalidadesDropDown.defaultProps = {
  form: {},
  onChange: () => {},
  label: null,
  disabled: false,
  anoLetivo: '',
};

export default ModalidadesDropDown;
