import { LocalizadorProfessor } from '@/components/sgp/inputs/form/localizador-professor';
import { TipoRelatorioProdutividadeFrequenciaEnum } from '@/core/enum/tipo-relatorio-produtividade-frequencia-enum';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useEffect } from 'react';

export const LocalizadorProfessorRelProdutividade: React.FC = () => {
  const form = useFormInstance();

  const tipoRelatorioProdutividade: TipoRelatorioProdutividadeFrequenciaEnum = useWatch(
    'tipoRelatorioProdutividade',
  );

  const habilitar =
    tipoRelatorioProdutividade === TipoRelatorioProdutividadeFrequenciaEnum.Analitico ||
    tipoRelatorioProdutividade === TipoRelatorioProdutividadeFrequenciaEnum.MediaPorProfessor;

  useEffect(() => {
    if (!habilitar) {
      form.setFieldValue('localizadorProfessor', undefined);
      form.setFieldValue('localizadorProfessorDados', []);
    }
  }, [form, habilitar, tipoRelatorioProdutividade]);

  return (
    <LocalizadorProfessor
      inputCodigoProps={{ disabled: !habilitar }}
      autoCompleteNameProps={{ disabled: !habilitar }}
    />
  );
};
