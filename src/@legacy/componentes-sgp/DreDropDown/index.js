import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Componentes
import { SelectComponent } from '~/componentes';

// Servicos
import AbrangenciaServico from '~/servicos/Abrangencia';

// Funções
import { valorNuloOuVazio } from '~/utils/funcoes/gerais';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import Loader from '~/componentes/loader';

function DreDropDown({
  form,
  onChange,
  label,
  url,
  desabilitado,
  opcaoTodas,
  temModalidade,
  labelRequired,
}) {
  const [carregando, setCarregando] = useState(false);
  const [listaDres, setListaDres] = useState([]);

  const buscarDres = async () => {
    setCarregando(true);
    const { data } = await AbrangenciaServico.buscarDres(url);
    if (data) {
      const lista = data
        .map(item => ({
          desc: item.nome,
          valor: item.codigo,
          abrev: item.abreviacao,
        }))
        .sort(FiltroHelper.ordenarLista('desc'));

      setListaDres(lista);

      if (lista.length === 1) {
        setTimeout(() => {
          form.setFieldValue('dreId', lista[0].valor);
        }, 100);
      }

      if (opcaoTodas && lista.length > 1) {
        lista.unshift({ desc: 'Todas', valor: '0' });
      }
    }
    setCarregando(false);
  };

  useEffect(() => {
    if (temModalidade) buscarDres();
  }, [url]);

  useEffect(() => {
    if (!valorNuloOuVazio(form.values.dreId)) {
      onChange(form.values.dreId, listaDres);
    }
  }, [form.values.dreId, onChange]);

  return (
    <Loader loading={carregando} tip="">
      <SelectComponent
        label={!label ? null : label}
        form={form}
        name="dreId"
        className="fonte-14"
        onChange={valor => onChange(valor, listaDres, true)}
        lista={listaDres}
        valueOption="valor"
        valueText="desc"
        placeholder="Diretoria Regional De Educação (DRE)"
        disabled={!listaDres.length || listaDres.length === 1 || desabilitado}
        showSearch
        labelRequired={labelRequired}
      />
    </Loader>
  );
}

DreDropDown.propTypes = {
  form: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.any,
  ]),
  onChange: PropTypes.func,
  label: PropTypes.string,
  url: PropTypes.string,
  desabilitado: PropTypes.bool,
  opcaoTodas: PropTypes.bool,
  temModalidade: PropTypes.bool,
  labelRequired: PropTypes.bool,
};

DreDropDown.defaultProps = {
  form: {},
  onChange: () => {},
  label: null,
  url: null,
  desabilitado: false,
  opcaoTodas: false,
  temModalidade: true,
  labelRequired: false,
};

export default DreDropDown;
