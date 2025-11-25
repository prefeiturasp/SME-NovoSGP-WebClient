import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { onchangeMultiSelect } from '~/utils';
import FechaReabCadastroContext from '../fechaReabCadastroContext';
import { ModalidadeTipoCalendarioEnum } from '@/core/enum/modalidade-tipo-calendario-enum';

const BimestreReabertura = ({ form, onChangeCampos, aplicacaoSondagem }) => {
  const {
    desabilitarCampos,
    calendarioSelecionado,
    setListaBimestres,
    listaBimestres,
  } = useContext(FechaReabCadastroContext);

  const { bimestres } = form.values;

  const nomeCampo = 'bimestres';

  const descricaoCicloBimestre = aplicacaoSondagem ? 'Ciclo' : 'Bimestre';

  const montarListaBimestres = tipoModalidade => {
    const listaNova = [
      {
        valor: 1,
        descricao: `Primeiro ${descricaoCicloBimestre}`,
      },
      {
        valor: 2,
        descricao: `Segundo ${descricaoCicloBimestre}`,
      },
    ];

    if (
      tipoModalidade !== ModalidadeTipoCalendarioEnum.EJA &&
      tipoModalidade !== ModalidadeTipoCalendarioEnum.CELP
    ) {
      listaNova.push(
        {
          valor: 3,
          descricao: `Terceiro ${descricaoCicloBimestre}`,
        },
        {
          valor: 4,
          descricao: `Quarto ${descricaoCicloBimestre}`,
        },
      );

      if (aplicacaoSondagem) {
        listaNova.push(
          {
            valor: 5,
            descricao: 'Quinto Ciclo'
          },
        );
      }

    } else {
      setListaBimestres(listaNova.filter(({ valor }) => valor !== 5));
    }

    listaNova.push({
      valor: OPCAO_TODOS,
      descricao: 'Todos',
    });
    setListaBimestres(listaNova);
  };

  useEffect(() => {
    if (calendarioSelecionado?.modalidade) {
      montarListaBimestres(calendarioSelecionado?.modalidade);
    } else {
      setListaBimestres([]);
    }
  }, [calendarioSelecionado, aplicacaoSondagem]);

  const onChangeBimestre = novosValores => {
    form.setFieldValue(nomeCampo, novosValores || []);
    form.setFieldTouched(nomeCampo, true, true);
  };

  return (
    <SelectComponent
      form={form}
      name={nomeCampo}
      lista={listaBimestres}
      valueOption="valor"
      valueText="descricao"
      label={`${aplicacaoSondagem ? 'Ciclos' : 'Bimestres'}`}
      placeholder={`Selecione ${aplicacaoSondagem ? 'ciclo' : 'bimestre'}(s)`}
      multiple
      setValueOnlyOnChange
      disabled={desabilitarCampos}
      onChange={valores => {
        onchangeMultiSelect(valores, bimestres, onChangeBimestre);
        onChangeCampos();
      }}
      labelRequired
    />
  );
};

BimestreReabertura.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  aplicacaoSondagem: PropTypes.bool,
};

BimestreReabertura.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  aplicacaoSondagem: false,
};

export default BimestreReabertura;
