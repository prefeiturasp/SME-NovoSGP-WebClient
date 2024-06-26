import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_SEMESTRE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';

export const Semestre = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
  nameList,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo, dreCodigo, ueCodigo, modalidade } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;
  const listaSemestres = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  let ehEJAouCelp =
    Number(modalidade) === ModalidadeEnum.EJA ||
    Number(modalidade) === ModalidadeEnum.CELP;

  if (modalidade?.length && Array.isArray(modalidade)) {
    ehEJAouCelp = !!modalidade.find(
      valor =>
        Number(valor) === ModalidadeEnum.EJA ||
        Number(valor) === ModalidadeEnum.CELP
    );
  }

  const limparDados = () => {
    form.setFieldValue(nameList, []);
    form.setFieldValue(name, undefined);
  };

  const obterSemestres = useCallback(async () => {
    if (!anoLetivo || !dreCodigo || !ueCodigo || !modalidade) return;

    setExibirLoader(true);

    let modalidadeConsulta = cloneDeep(modalidade);

    if (Array.isArray(modalidade) && ehEJAouCelp) {
      const ejaCelp = modalidadeConsulta.filter(
        valor =>
          Number(valor) === ModalidadeEnum.EJA ||
          Number(valor) === ModalidadeEnum.CELP
      );
      if (ejaCelp?.length === 1) {
        modalidadeConsulta = ejaCelp[0];
      }
      if (ejaCelp?.length === 2) {
        modalidadeConsulta = undefined;
      }
    }

    const retorno = await AbrangenciaServico.obterSemestres(
      consideraHistorico,
      anoLetivo,
      modalidadeConsulta,
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
        if (setInitialValues) {
          form.initialValues[name] = String(lista[0]?.valor);
        }
        form.setFieldValue(name, String(lista[0]?.valor));
      }

      if (setInitialValues) {
        form.initialValues[nameList] = lista;
      }
      form.setFieldValue(nameList, lista);
    } else {
      limparDados();
    }
  }, [consideraHistorico, anoLetivo, modalidade, dreCodigo, ueCodigo]);

  useEffect(() => {
    if (form.initialValues[nameList]?.length && setInitialValues) return;

    limparDados();
    if (modalidade && ehEJAouCelp) obterSemestres();
  }, [ehEJAouCelp, modalidade]);

  const desabilitar =
    !modalidade ||
    (modalidade && !ehEJAouCelp) ||
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
        lista={listaSemestres}
        disabled={desabilitar}
        showSearch={showSearch}
        id={SGP_SELECT_SEMESTRE}
        labelRequired={ehEJAouCelp && labelRequired}
        placeholder="Selecione um semestre"
        setValueOnlyOnChange
        onChange={newValue => {
          form.setFieldValue('modoEdicao', true);

          form.setFieldValue(name, newValue || '');
          form.setFieldTouched(name, true, true);
          onChange(newValue);
        }}
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
  nameList: PropTypes.string,
};

Semestre.defaultProps = {
  form: null,
  disabled: false,
  name: 'semestre',
  showSearch: true,
  onChange: () => null,
  labelRequired: true,
  nameList: 'listaSemestres',
};
