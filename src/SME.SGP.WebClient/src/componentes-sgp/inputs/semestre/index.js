import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_SEMESTRE } from '~/constantes/ids/select';
import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros } from '~/servicos';

export const Semestre = ({
  name,
  form,
  onChange,
  disabled,
  ueCodigo,
  dreCodigo,
  showSearch,
  labelRequired,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaSemestres, setListaSemestres] = useState([]);

  const { anoLetivo, modalidade } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;

  const ehEJA = Number(modalidade) === ModalidadeDTO.EJA;

  const obterSemestres = useCallback(async () => {
    setExibirLoader(true);

    const retorno = await AbrangenciaServico.obterSemestres(
      consideraHistorico,
      anoLetivo,
      modalidade,
      dreCodigo,
      ueCodigo
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      setListaSemestres(lista);
    } else {
      setListaSemestres([]);
      form.setFieldValue(name, undefined);
    }
  }, [
    form,
    name,
    consideraHistorico,
    anoLetivo,
    modalidade,
    dreCodigo,
    ueCodigo,
  ]);

  useEffect(() => {
    if (modalidade && ehEJA) {
      obterSemestres();
    }
  }, [ehEJA, modalidade, obterSemestres]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        label="Semestre"
        valueText="desc"
        valueOption="valor"
        onChange={onChange()}
        placeholder="Semestre"
        lista={listaSemestres}
        showSearch={showSearch}
        id={SGP_SELECT_SEMESTRE}
        labelRequired={labelRequired}
        disabled={!modalidade || disabled}
      />
    </Loader>
  );
};

Semestre.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  ueCodigo: PropTypes.string,
  dreCodigo: PropTypes.string,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Semestre.defaultProps = {
  form: null,
  ueCodigo: '',
  dreCodigo: '',
  disabled: false,
  name: 'semestre',
  showSearch: false,
  onChange: () => null,
  labelRequired: false,
};
