import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Label } from '~/componentes';
import UploadArquivos from '~/componentes-sgp/UploadArquivos/uploadArquivos';
import { setArquivoRemovido } from '~/redux/modulos/questionarioDinamico/actions';
import { erros, sucesso } from '~/servicos';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';

const CampoDinamicoUploadArquivos = props => {
  const {
    dados,
    desabilitado,
    urlUpload,
    funcaoRemoverArquivoCampoUpload,
    onChange,
  } = props;
  const { form, questaoAtual, label, prefixId } = dados;
  const dispatch = useDispatch();

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const onRemoveFile = async arquivo => {
    const codigoArquivo = arquivo.xhr;

    if (arquivo.arquivoId) {
      if (
        form &&
        form?.setFieldValue &&
        form?.values?.[questaoAtual?.id]?.length
      ) {
        const novoMap = form?.values?.[questaoAtual?.id];
        const indice = novoMap.findIndex(
          item => arquivo.arquivoId === item.arquivoId
        );

        if (indice !== -1) {
          novoMap.splice(indice, 1);

          form.setFieldValue(String(questaoAtual?.id), novoMap);
          form.setFieldTouched(String(questaoAtual?.id), true);
          dispatch(setArquivoRemovido(true));
          sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
        }
      }
      onChange();
      return true;
    }

    const resposta = await funcaoRemoverArquivoCampoUpload(
      codigoArquivo
    ).catch(e => erros(e));

    if (resposta && resposta.status === 200) {
      dispatch(setArquivoRemovido(true));
      sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
      onChange();
      return true;
    }
    return false;
  };

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <div id={id}>
        {questaoAtual?.nome ? <Label text={label?.props?.text} /> : ''}
        <UploadArquivos
          id={id}
          form={form}
          urlUpload={urlUpload}
          onRemove={onRemoveFile}
          name={String(questaoAtual?.id)}
          onChangeListaArquivos={onChange}
          tiposArquivosPermitidos={questaoAtual.opcionais || ''}
          desabilitarGeral={desabilitado || questaoAtual.somenteLeitura}
          desabilitarUpload={form?.values?.[questaoAtual?.id]?.length > 9}
          defaultFileList={
            form?.values?.[questaoAtual?.id]?.length
              ? form?.values?.[questaoAtual?.id]
              : []
          }
        />
      </div>
    </ColunaDimensionavel>
  );
};

CampoDinamicoUploadArquivos.propTypes = {
  dados: PropTypes.oneOfType([PropTypes.object]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  urlUpload: PropTypes.string,
  funcaoRemoverArquivoCampoUpload: PropTypes.func,
  onChange: PropTypes.func,
};

CampoDinamicoUploadArquivos.defaultProps = {
  dados: {},
  prefixId: '',
  desabilitado: false,
  urlUpload: '',
  funcaoRemoverArquivoCampoUpload: () => {},
  onChange: () => {},
};

export default CampoDinamicoUploadArquivos;
