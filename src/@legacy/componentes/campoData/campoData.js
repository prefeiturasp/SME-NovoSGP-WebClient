import 'moment/locale/pt-br';

import DatePickerMoment from './datePickerMoment';
import { LoadingOutlined, CalendarOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { Field } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import * as Yup from 'yup';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

import { Base } from '../colors';
import Label from '../label';

import { Campo, IconeEstilizado } from './campoDataNovo.css';

class MomentSchema extends Yup.mixed {
  constructor() {
    super({ type: 'momentschema' });
    this.transforms.push(value => {
      if (this.isType(value)) return moment(value);
      return moment.invalid();
    });
  }
}

const CampoData = ({
  formatoData,
  placeholder,
  label,
  name,
  id,
  form,
  desabilitado,
  className,
  onChange,
  valor,
  desabilitarData,
  diasParaHabilitar,
  somenteHora,
  temErro,
  mensagemErro,
  carregando,
  campoOpcional,
  executarOnChangeExterno,
  valorPadrao,
  diasParaSinalizar,
  intervaloDatas,
  labelRequired,
  allowClear,
}) => {
  const habilitarDatas = dataAtual => {
    let retorno = true;
    const ehParaHabilitar =
      !!diasParaHabilitar &&
      diasParaHabilitar.length >= 1 &&
      !!diasParaHabilitar.find(x => x === dataAtual.format('YYYY-MM-DD'));

    if (
      !!diasParaHabilitar === false &&
      typeof desabilitarData === 'function'
    ) {
      retorno = desabilitarData(dataAtual);
    } else if (
      !!diasParaHabilitar &&
      diasParaHabilitar.length >= 1 &&
      typeof desabilitarData === 'function'
    ) {
      retorno = !ehParaHabilitar || desabilitarData(dataAtual);
    } else if (
      !!diasParaHabilitar &&
      diasParaHabilitar.length >= 1 &&
      !!desabilitarData === false
    ) {
      retorno = !ehParaHabilitar;
    } else if (!!diasParaHabilitar === false && !!desabilitarData === false) {
      retorno = false;
    }

    return retorno;
  };

  const possuiErro = () => {
    return (form && form.errors[name] && form.touched[name]) || temErro;
  };

  const executaOnBlur = event => {
    const { relatedTarget } = event;
    if (relatedTarget && relatedTarget.getAttribute('type') === 'button') {
      event.preventDefault();
    }
  };

  const Icone = carregando ? (
    <LoadingOutlined style={{ fontSize: '16px', lineHeight: 0 }} spin />
  ) : (
    <CalendarOutlined style={{ fontSize: '16px', lineHeight: 0 }} />
  );

  const dataRender = (dataRenderizar, dataAtualSelecionada) => {
    const style = {};
    if (diasParaSinalizar?.length) {
      const temDiaNaLista = diasParaSinalizar.find(dataSinalizar =>
        dataSinalizar?.isSame(
          moment(dataRenderizar).format('YYYY-MM-DD'),
          'date'
        )
      );
      if (
        temDiaNaLista &&
        moment.isMoment(dataAtualSelecionada) &&
        !dataRenderizar?.isSame(
          moment(dataAtualSelecionada).format('YYYY-DD-MM'),
          'date'
        )
      ) {
        style.color = Base.AzulAnakiwa;
        style.border = `1px solid ${Base.AzulAnakiwa}`;
      }
    }
    return (
      <div
        className="ant-picker-cell-inner"
        aria-selected="false"
        aria-disabled="false"
        style={style}
      >
        {dataRenderizar.date()}
      </div>
    );
  };

  const campoDataAntComValidacoes = () => {
    return (
      <Field name={name} id={name}>
        {({ field: { value }, form: { setFieldValue, setFieldTouched } }) => (
          <div>
            <div>
              <DatePickerMoment
                disabled={desabilitado}
                format={formatoData}
                locale={locale}
                placeholder={placeholder}
                suffixIcon={Icone}
                name={name}
                id={id || name}
                onBlur={executaOnBlur}
                className={
                  form
                    ? `${possuiErro() ? 'is-invalid' : ''} ${className || ''}`
                    : ''
                }
                onChange={valorData => {
                  if (!executarOnChangeExterno) {
                    setFieldValue(name, valorData || '');
                    setFieldTouched(name, true, true);
                  }
                  onChange(valorData);
                }}
                disabledDate={habilitarDatas}
                showToday={false}
                value={value || null}
                defaultPickerValue={valorPadrao}
                dataRender={dataRender}
              />
            </div>
          </div>
        )}
      </Field>
    );
  };

  const campoDataAntSemValidacoes = () => {
    return (
      <DatePickerMoment
        disabled={desabilitado}
        locale={locale}
        format={formatoData}
        placeholder={placeholder}
        // suffixIcon={<i className="fas fa-calendar-alt" />}
        suffixIcon={Icone}
        name={name}
        id={id || name}
        className={`${possuiErro() ? 'is-invalid' : ''} ${className || ''}`}
        onBlur={executaOnBlur}
        onChange={valorData => {
          onChange(valorData || '');
        }}
        value={valor || null}
        disabledDate={habilitarDatas}
        showToday={false}
        defaultPickerValue={valorPadrao}
        dateRender={dataRender}
        allowClear={allowClear}
      />
    );
  };

  const campoHoraAntComValidacoes = () => {
    return (
      <Field
        disabled={desabilitado}
        locale={locale}
        format={formatoData}
        component={DatePickerMoment.TimePicker}
        placeholder={placeholder}
        name={name}
        id={id || name}
        onBlur={executaOnBlur}
        className={
          form ? `${possuiErro() ? 'is-invalid' : ''} ${className || ''}` : ''
        }
        onChange={valorHora => {
          form.setFieldValue(name, valorHora || '');
          onChange(valorHora);
          form.setFieldTouched(name, true, true);
        }}
        value={form.values[name] || null}
        showToday={false}
      />
    );
  };

  const campoHoraAntSemValidacoes = () => {
    return (
      <DatePickerMoment.TimePicker
        disabled={desabilitado}
        locale={locale}
        format={formatoData}
        placeholder={placeholder}
        name={name}
        id={id || name}
        onBlur={executaOnBlur}
        className={`${possuiErro() ? 'is-invalid' : ''} ${className || ''}`}
        onChange={valorHora => {
          onChange(valorHora);
        }}
        value={valor || null}
        showToday={false}
      />
    );
  };

  const campoIntervaloDatas = () => {
    return (
      <>
        <IconeEstilizado icon={faLongArrowAltRight} />
        <DatePickerMoment.RangePicker
          disabled={desabilitado}
          locale={locale}
          format={formatoData}
          suffixIcon={Icone}
          name={name}
          id={id || name}
          className={`${possuiErro() ? 'is-invalid' : ''} ${className || ''}`}
          onBlur={executaOnBlur}
          onChange={valorData => {
            onChange(valorData || '');
          }}
          separator=""
          value={valor || [null, null]}
          disabledDate={habilitarDatas}
          showToday={false}
          defaultPickerValue={valorPadrao}
          dateRender={dataRender}
        />
      </>
    );
  };

  const validaTipoCampo = () => {
    if (somenteHora) {
      return form ? campoHoraAntComValidacoes() : campoHoraAntSemValidacoes();
    }

    if (intervaloDatas) {
      return campoIntervaloDatas();
    }

    return form ? campoDataAntComValidacoes() : campoDataAntSemValidacoes();
  };

  const obterErros = () => {
    return (form && form.touched[name] && form.errors[name]) || temErro ? (
      <span style={{ color: Base.Vermelho, marginBottom: '5px' }}>
        {(form && form.errors[name]) || mensagemErro}
      </span>
    ) : (
      ''
    );
  };

  return (
    <>
      <Campo>
        {label ? (
          <Label
            text={label}
            control={name}
            campoOpcional={campoOpcional}
            isRequired={labelRequired}
          />
        ) : (
          <></>
        )}
        {validaTipoCampo()}
        {obterErros()}
      </Campo>
    </>
  );
};

CampoData.propTypes = {
  className: PropTypes.string,
  formatoData: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  desabilitado: PropTypes.bool,
  somenteHora: PropTypes.bool,
  onChange: PropTypes.func,
  valor: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
  name: PropTypes.string,
  id: PropTypes.string,
  desabilitarData: PropTypes.func,
  diasParaHabilitar: PropTypes.oneOfType([PropTypes.array]),
  temErro: PropTypes.bool,
  mensagemErro: PropTypes.string,
  carregando: PropTypes.bool,
  campoOpcional: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  executarOnChangeExterno: PropTypes.bool,
  valorPadrao: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  diasParaSinalizar: PropTypes.oneOfType([PropTypes.array]),
  intervaloDatas: PropTypes.bool,
  labelRequired: PropTypes.bool,
  allowClear: PropTypes.bool,
};

CampoData.defaultProps = {
  className: '',
  formatoData: 'DD/MM/YYYY HH:mm:ss',
  placeholder: 'placeholder',
  label: '',
  desabilitado: false,
  somenteHora: false,
  onChange: () => {},
  valor: null,
  form: null,
  name: null,
  id: null,
  desabilitarData: null,
  diasParaHabilitar: null,
  temErro: null,
  mensagemErro: null,
  carregando: false,
  campoOpcional: '',
  executarOnChangeExterno: false,
  valorPadrao: '',
  diasParaSinalizar: [],
  intervaloDatas: false,
  labelRequired: false,
  allowClear: true,
};

const momentSchema = new MomentSchema();

Yup.addMethod(
  Yup.mixed,
  'dataMenorIgualQue',
  // eslint-disable-next-line func-names
  function (nomeDataInicial, nomeDataFinal, mensagem) {
    // eslint-disable-next-line func-names
    return this.test('dataMenorIgualQue', mensagem, function () {
      let dataValida = true;
      const dataInicial = this.parent[nomeDataInicial];
      const dataFinal = this.parent[nomeDataFinal];

      if (
        dataInicial &&
        dataFinal &&
        dataInicial.isSameOrAfter(dataFinal, 'date')
      ) {
        dataValida = false;
      }
      return dataValida;
    });
  }
);

Yup.addMethod(
  Yup.mixed,
  'dataMenorQue',
  // eslint-disable-next-line func-names
  function (nomeDataInicial, nomeDataFinal, mensagem) {
    // eslint-disable-next-line func-names
    return this.test('dataMenorQue', mensagem, function () {
      let dataValida = true;
      const dataInicial = this.parent[nomeDataInicial];
      const dataFinal = this.parent[nomeDataFinal];

      if (dataInicial && dataFinal && dataInicial.isAfter(dataFinal, 'date')) {
        dataValida = false;
      }
      return dataValida;
    });
  }
);

export { CampoData, momentSchema };
