import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_SEMESTRE } from '~/constantes/ids/select';
import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros } from '~/servicos';

export const Semestre = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaSemestres, setListaSemestres] = useState([]);

  const { anoLetivo, dreCodigo, ueCodigo, modalidade } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;

  const ehEJA = Number(modalidade) === ModalidadeDTO.EJA;

  const limparDados = () => {
    setListaSemestres([]);
    form.setFieldValue(name, undefined);
  };

  const obterSemestres = useCallback(async () => {
    setExibirLoader(true);

    const retorno = await AbrangenciaServico.obterSemestres(
      consideraHistorico,
      anoLetivo,
      modalidade,
      dreCodigo === OPCAO_TODOS ? '' : dreCodigo,
      ueCodigo === OPCAO_TODOS ? '' : ueCodigo
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista?.length === 1) {
        form.setFieldValue(name, String(lista[0]?.valor));
      }

      setListaSemestres(lista);
    } else {
      limparDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consideraHistorico, anoLetivo, modalidade, dreCodigo, ueCodigo]);

  useEffect(() => {
    limparDados();
    if (modalidade && ehEJA) obterSemestres();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ehEJA, modalidade]);

  const desabilitar =
    !modalidade ||
    (modalidade && !ehEJA) ||
    listaSemestres?.length === 1 ||
    disabled;

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        label="Semestre"
        valueText="desc"
        valueOption="valor"
        onChange={onChange}
        lista={listaSemestres}
        disabled={desabilitar}
        showSearch={showSearch}
        id={SGP_SELECT_SEMESTRE}
        labelRequired={ehEJA && labelRequired}
        placeholder="Selecione um semestre"
      />
    </Loader>
  );
};

Semestre.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Semestre.defaultProps = {
  form: null,
  disabled: false,
  name: 'semestre',
  showSearch: true,
  onChange: () => null,
  labelRequired: true,
};
