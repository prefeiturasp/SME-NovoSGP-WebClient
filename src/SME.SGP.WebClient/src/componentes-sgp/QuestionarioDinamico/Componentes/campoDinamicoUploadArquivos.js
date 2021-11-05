import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Label } from '~/componentes';
import UploadArquivos from '~/componentes-sgp/UploadArquivos/uploadArquivos';
import { setArquivoRemovido } from '~/redux/modulos/questionarioDinamico/actions';
import { erros, sucesso } from '~/servicos';

const CampoDinamicoUploadArquivos = props => {
  const {
    dados,
    desabilitado,
    urlUpload,
    funcaoRemoverArquivoCampoUpload,
    onChange,
  } = props;
  const { form, questaoAtual, label } = dados;
  const dispatch = useDispatch();

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
    <>
      <div className="col-md-12 mt-2 mb-3">
        {questaoAtual?.nome ? <Label text={label} /> : ''}
        <UploadArquivos
          desabilitarGeral={desabilitado || questaoAtual.somenteLeitura}
          form={form}
          name={String(questaoAtual?.id)}
          id={String(questaoAtual?.id)}
          tiposArquivosPermitidos={questaoAtual.opcionais || ''}
          desabilitarUpload={form?.values?.[questaoAtual?.id]?.length > 9}
          onRemove={onRemoveFile}
          urlUpload={urlUpload}
          defaultFileList={
            form?.values?.[questaoAtual?.id]?.length
              ? form?.values?.[questaoAtual?.id]
              : []
          }
          onChangeListaArquivos={onChange}
        />
      </div>
    </>
  );
};

CampoDinamicoUploadArquivos.propTypes = {
  dados: PropTypes.oneOfType([PropTypes.object]),
  desabilitado: PropTypes.bool,
  urlUpload: PropTypes.string,
  funcaoRemoverArquivoCampoUpload: PropTypes.func,
  onChange: PropTypes.func,
};

CampoDinamicoUploadArquivos.defaultProps = {
  dados: {},
  desabilitado: false,
  urlUpload: '',
  funcaoRemoverArquivoCampoUpload: () => {},
  onChange: () => {},
};

export default CampoDinamicoUploadArquivos;
