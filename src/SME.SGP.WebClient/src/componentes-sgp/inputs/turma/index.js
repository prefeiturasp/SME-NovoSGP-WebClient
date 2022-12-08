import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_TURMA } from '~/constantes/ids/select';
import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros } from '~/servicos';

export const Turma = ({
  name,
  form,
  onChange,
  disabled,
  ueCodigo,
  showSearch,
  labelRequired,
}) => {
  const [listaTurmas, setListaTurmas] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo, modalidade, semestre } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;

  const ehEJA = Number(modalidade) === ModalidadeDTO.EJA;

  const obterTurmas = useCallback(async () => {
    setExibirLoader(true);

    const retorno = await AbrangenciaServico.buscarTurmas(
      ueCodigo,
      modalidade,
      '',
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setListaTurmas(retorno?.data);
    } else {
      setListaTurmas([]);
    }
  }, [ueCodigo, modalidade, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (modalidade) {
      obterTurmas();
    } else {
      setListaTurmas([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidade]);

  const desabilitar = !modalidade || (ehEJA && !semestre) || disabled;

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        form={form}
        name={name}
        label="Turma"
        placeholder="Turma"
        lista={listaTurmas}
        id={SGP_SELECT_TURMA}
        onChange={onChange()}
        valueOption="id"
        valueText="nomeFiltro"
        disabled={desabilitar}
        showSearch={showSearch}
        labelRequired={labelRequired}
      />
    </Loader>
  );
};

Turma.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  ueCodigo: PropTypes.string,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Turma.defaultProps = {
  form: null,
  ueCodigo: '',
  disabled: false,
  name: 'turmaId',
  showSearch: false,
  onChange: () => null,
  labelRequired: false,
};
