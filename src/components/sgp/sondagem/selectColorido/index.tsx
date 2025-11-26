import { Empty, Select as SelectAnt, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import './index.css';

interface SelectColoridoProps extends SelectProps {
  tipoQuestao?: 'escrita' | 'reescrita' | 'producao' | 'leitura' | 'numeros' | 'mapeamento';
  anoTurma?: string;
}

const SelectColorido: React.FC<SelectColoridoProps> = ({
  tipoQuestao,
  anoTurma,
  value,
  onChange,
  ...props
}) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#000000');

  const filterOption = (input: string, option?: DefaultOptionType) => {
    const optionValue = option?.value?.toString()?.toLowerCase();
    const description = option?.label?.toString()?.toLowerCase();

    const hasValue = !!optionValue && optionValue?.indexOf(input?.toLowerCase()) >= 0;
    const hasDesc = !!description && description?.toLowerCase().indexOf(input?.toLowerCase()) >= 0;

    return hasValue || hasDesc;
  };

  const getColorByValue = useCallback(
    (selectedValue: any): { bg: string; text: string } => {
      if (!selectedValue || !props.options) return { bg: '#FFFFFF', text: '#000000' };

      let cores: string[];
      let textColors: string[];
      console.log('Testar com switch duplo e criar o switch de matematica', anoTurma);
      switch (tipoQuestao) {
        case 'escrita':
          switch (anoTurma) {
            case '1':
              cores = ['#FF3131', '#FFDE59', '#FF914D', '#5170FF', '#00BF63', '#FFFFFF'];
              textColors = ['#FFFFFF', '#42474A', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#42474A'];
              break;
            case '2':
              cores = ['#FF3131', '#FFDE59', '#FF914D', '#D9D2E9', '#D0C2EF', '#C3B0EB', '#AF92ED'];
              textColors = [
                '#FFFFFF',
                '#42474A',
                '#FFFFFF',
                '#42474A',
                '#42474A',
                '#42474A',
                '#FFFFFF',
              ];
              break;
            case '3':
              cores = ['#FF3131', '#FFDE59', '#FF914D', '#D9D2E9', '#D0C2EF', '#C3B0EB', '#AF92ED'];
              textColors = [
                '#FFFFFF',
                '#42474A',
                '#FFFFFF',
                '#42474A',
                '#42474A',
                '#42474A',
                '#FFFFFF',
              ];
              break;
          }
          break;
        case 'leitura':
          cores = ['#7ED957', '#FFDE59', '#F18888'];
          textColors = ['#363636', '#363636', '#FFFFFF'];
          break;
        case 'numeros':
          cores = ['#D9EEFA', '#BBE0F6', '#8ED5FF', '#38B6FF'];
          textColors = ['#42474A', '#42474A', '#42474A', '#42474A'];
          break;
        case 'mapeamento':
          cores = ['#7ED957', '#FFDE59', '#F18888'];
          textColors = ['#42474A', '#42474A', '#42474A'];
          break;
        default:
          cores = ['#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575'];
          textColors = ['#42474A', '#42474A', '#FFFFFF', '#FFFFFF'];
      }

      const index = props.options.findIndex((opt: any) => opt.value === selectedValue);
      return index >= 0
        ? { bg: cores[index % cores.length], text: textColors[index % textColors.length] }
        : { bg: '#FFFFFF', text: '#000000' };
    },
    [props.options, tipoQuestao, anoTurma],
  );

  const handleChange = (newValue: any, option: any) => {
    const colors = getColorByValue(newValue);
    setBackgroundColor(colors.bg);
    setTextColor(colors.text);
    if (onChange) {
      onChange(newValue, option);
    }
  };

  // Define cor inicial quando o componente monta ou value muda
  useEffect(() => {
    if (value) {
      const colors = getColorByValue(value);
      setBackgroundColor(colors.bg);
      setTextColor(colors.text);
    }
  }, [value, getColorByValue]);

  return (
    <>
      <style>{`
        .select-colorido-${props.id} .ant-select-selector {
          background-color: ${backgroundColor} !important;
          border-color: ${backgroundColor} !important;
        }
        .select-colorido-${props.id} .ant-select-selection-item {
          color: ${textColor} !important;
        }
        .select-colorido-${props.id} .ant-select-arrow {
          color: ${textColor} !important;}
      `}</style>
      <SelectAnt
        notFoundContent={
          <Empty
            description="Sem dados"
            className="ant-empty-small"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        }
        showSearch
        filterOption={filterOption}
        getPopupContainer={(trigger) => trigger.parentElement}
        value={value}
        onChange={handleChange}
        {...props}
        className={`select-colorido select-colorido-${props.id} ${props.className || ''}`}
      />
    </>
  );
};

export default SelectColorido;
