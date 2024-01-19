import { store } from '@/core/redux';
import { Field } from 'formik';
import { Jodit } from 'jodit';
import 'jodit/build/jodit.min.css';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { api } from '~/servicos';
import { erro, erros } from '~/servicos/alertas';
import { urlBase } from '~/servicos/variaveis';
import { Base } from '../colors';
import Label from '../label';
import { clone } from 'lodash';

const Campo = styled.div`
  .jodit-container {
    display: grid;
  }

  .campo-invalido {
    .jodit-container {
      border-color: #dc3545 !important;
    }
  }
  .jodit-status-bar :nth-child(2) {
    display: none;
  }

  .jodit-workplace,
  .jodit-wysiwyg {
    min-height: 139px !important;
    overflow-wrap: anywhere !important;
  }

  ul,
  ol {
    padding-inline-start: 40px;
  }

  .desabilitar {
    cursor: not-allowed !important;
  }
`;

const temBinarioNaUrl = imgSrc =>
  !!(imgSrc && imgSrc?.startsWith('data:image/'));

const ehUrlExterna = imgSrc => {
  const urlSGP = clone(urlBase).replace('/api', '');

  return imgSrc && !imgSrc?.startsWith(urlSGP);
};

export const temBinarioOuUrlExterna = imgSrc =>
  temBinarioNaUrl(imgSrc) || ehUrlExterna(imgSrc);

const uploadImagemManual = async file => {
  const fmData = new FormData();
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  fmData.append('file', file);

  const resposta = await api
    .post('v1/arquivos/upload', fmData, config)
    .catch(e => erros(e));

  return resposta?.data?.data?.path;
};

const converterImagemURLExternaParaInterna = async urlExterna => {
  const localFile =
    urlExterna?.startsWith('file:///') ||
    urlExterna?.startsWith('blob:https://web.whatsapp.com/') ||
    urlExterna?.startsWith('https://attachment.outlook.live.net') ||
    urlExterna?.startsWith('https://accounts.google.com');

  if (localFile) return urlExterna;

  return fetch(urlExterna).then(async res => {
    return res.blob().then(blob => {
      const file = new File([blob], 'file.png', { type: 'image/png' });
      return uploadImagemManual(file);
    });
  });
};

export const validarUploadImagensExternasEBinarias = async (
  html,
  imagensCentralizadas
) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const imgElements = doc.getElementsByTagName('img');

  const replacementPromises = [];

  for (let i = 0; i < imgElements?.length; i++) {
    const imgSrc = imgElements[i].getAttribute('src');

    const binarioOuUrlExterna = temBinarioOuUrlExterna(imgSrc);

    if (binarioOuUrlExterna) {
      let newSrcPromise = new Promise(resolve => resolve(''));

      newSrcPromise = converterImagemURLExternaParaInterna(imgSrc);

      replacementPromises.push(newSrcPromise);

      // Atualizar o DOM posteriormente com a URL obtida assincronamente
      newSrcPromise.then(newSrc => {
        imgElements[i].setAttribute('src', newSrc);

        const styleAttribute = `max-width: 100%; height: auto; min-height: 100%; object-fit: cover; object-position: bottom; ${
          imagensCentralizadas ? 'display: block; margin: auto;' : ''
        }`;

        imgElements[i].setAttribute('style', styleAttribute);
      });
    }
  }

  const resposta = await Promise.all(replacementPromises).catch(e => erros(e));

  if (resposta?.length) {
    return doc.documentElement.innerHTML;
  }

  return html;
};

let CHANGE_DEBOUNCE_FLAG;
const TAMANHO_MAXIMO_UPLOAD_MB = 10;

const JoditEditor = forwardRef((props, ref) => {
  const {
    id,
    name,
    form,
    value,
    label,
    height,
    temErro,
    tabIndex,
    onChange,
    readonly,
    qtdMaxImg,
    iframeStyle,
    desabilitar,
    permiteVideo,
    mensagemErro,
    labelRequired,
    disablePlugins,
    removerToolbar,
    validarSeTemErro,
    valideClipboardHTML,
    imagensCentralizadas,
    permiteInserirArquivo,
  } = props;

  const textArea = useRef(null);

  const [url] = useState(urlBase);
  const { token } = store.getState().usuario;

  const [validacaoComErro, setValidacaoComErro] = useState(false);

  const BOTOES_PADRAO = !removerToolbar
    ? `bold,ul,ol,outdent,indent,font,fontsize,brush,paragraph,${
        permiteInserirArquivo ? 'file,' : ''
      }table,link,align,undo,redo`
    : '';

  const changeHandler = valor => {
    if (onChange) {
      onChange(valor);
    }
  };

  const excedeuLimiteMaximo = arquivo => {
    return Math.ceil(arquivo.size / 1048576) > TAMANHO_MAXIMO_UPLOAD_MB;
  };

  const exibirMsgMaximoImg = reject => {
    const msg = `Você pode inserir apenas ${qtdMaxImg} ${
      qtdMaxImg > 1 ? 'imagens' : 'imagem'
    }`;
    erro(msg);
    if (reject) {
      reject(new Error(msg));
    }
  };

  const exibirMensagemError = (msg, reject) => {
    erro(msg);

    if (reject) {
      reject(new Error(msg));
    }
  };

  const verificaSeTemSvg = e => {
    const dadosColadoTexto = e?.clipboardData?.getData?.('text');
    const dadosColadoHTML = e?.clipboardData?.getData?.('text/html');

    const temTagSvg =
      dadosColadoHTML?.match(/<svg/g) || dadosColadoTexto?.match(/<svg/g);

    if (temTagSvg) {
      erro('Não é possivel inserir código HTML com SVG.');
    }

    return temTagSvg;
  };

  const verificaSePodeInserirArquivo = e => {
    const dadosColadoTexto = e?.clipboardData?.getData?.('text');

    const temImagemNosDadosColados = [...e?.clipboardData?.files].filter(item =>
      item.type.includes('image')
    );

    const temVideoNosDadosColados = [...e?.clipboardData?.files].filter(item =>
      item.type.includes('video')
    );

    const qtdElementoImg = temImagemNosDadosColados.length;
    const qtdElementoVideo = temVideoNosDadosColados.length;

    if (!permiteInserirArquivo && (qtdElementoImg || qtdElementoVideo)) {
      e.preventDefault();
      e.stopPropagation();
      erro('Não é possível inserir arquivo');

      return false;
    }

    if (qtdElementoImg && qtdMaxImg) {
      const qtdElementoImgAtual =
        textArea?.current?.editorDocument?.querySelectorAll?.('img');
      const totalImg = qtdElementoImg + qtdElementoImgAtual?.length;

      if (totalImg > qtdMaxImg || dadosColadoTexto === '') {
        if (dadosColadoTexto !== '') {
          exibirMsgMaximoImg();
        }

        e.preventDefault();
        e.stopPropagation();

        return false;
      }
    } else if (qtdElementoImg && dadosColadoTexto === '') {
      return false;
    }

    return true;
  };

  const config = {
    height,
    placeholder: '',
    spellcheck: true,
    language: 'pt_br',
    countHTMLChars: false,
    buttons: BOTOES_PADRAO,
    showWordsCounter: false,
    showCharsCounter: false,
    buttonsXS: BOTOES_PADRAO,
    buttonsMD: BOTOES_PADRAO,
    buttonsSM: BOTOES_PADRAO,
    showXPathInStatusbar: false,
    askBeforePasteFromWord: false,
    readonly: readonly || desabilitar,
    enableDragAndDropFileToEditor: true,
    askBeforePasteHTML: valideClipboardHTML,
    // iframe: true, // TODO bug jodit-react
    defaultActionOnPaste: '',
    defaultActionOnPasteFromWord: 'insert_clear_html',
    disablePlugins: ['image-properties', disablePlugins],
    iframeStyle: `${iframeStyle} img{max-width: 100%;max-height: 700px;object-fit: cover;}`,
    style: {
      font: '16px Arial',
      overflow: 'none',
    },
    events: {
      afterRemoveNode: node => {
        if (node.nodeName === 'IMG') {
          // TODO Aqui chamar endpoint para remover a imagem no servidor!
        }
      },
      validarSeTemErro: () => {
        if (validarSeTemErro) {
          const texto = textArea?.current?.text?.trim();
          let valorParaValidar = '';

          if (
            !texto ||
            (permiteVideo && textArea.current.value.includes('<video')) ||
            textArea.current.value.includes('<img')
          ) {
            valorParaValidar = textArea.current.value;
          } else if (texto) {
            valorParaValidar = texto;
          }
          setValidacaoComErro(validarSeTemErro(valorParaValidar));
        }
      },
    },
    uploader: {
      buildData: data => {
        return new Promise((resolve, reject) => {
          if (permiteInserirArquivo) {
            const arquivo = data.getAll('files[0]')[0];

            const tiposValidos = ['jpg', 'jpeg', 'png'];

            const ehImagem = arquivo.type.substring(0, 5) === 'image';
            const ehVideo = arquivo.type.substring(0, 5) === 'video';
            const ehValido = tiposValidos.some(x => arquivo.type.includes(x));

            if (excedeuLimiteMaximo(arquivo)) {
              const msg = `Tamanho máximo ${TAMANHO_MAXIMO_UPLOAD_MB}MB.`;
              exibirMensagemError(msg, reject);
            }

            if ((ehImagem && ehValido) || (ehVideo && permiteVideo)) {
              if (ehImagem && qtdMaxImg) {
                const quantidadeTotalImagens = (
                  textArea?.current?.value?.match(/<img/g) || []
                )?.length;

                if (quantidadeTotalImagens < qtdMaxImg) {
                  resolve(data);
                } else {
                  exibirMsgMaximoImg(reject);
                }
              } else {
                resolve(data);
              }
            } else {
              const formato = arquivo.type.split('/').pop().replace('+xml', '');

              const msg = `O formato .${formato} não é valido.`;

              exibirMensagemError(msg, reject);
            }
          } else {
            reject(new Error('Não é possível inserir arquivo'));
          }
        });
      },
      url: `${url}/v1/arquivos/upload`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      isSuccess: resp => resp,
      process: resp => {
        return {
          files: resp.data.files,
          path: resp.data.path,
          baseurl: resp.data.baseurl,
          error: resp.data.error,
          message: resp.data.message,
          contentType: resp.data.contentType,
        };
      },
      defaultHandlerSuccess: dados => {
        if (dados?.path) {
          if (dados.contentType.startsWith('video')) {
            textArea.current.selection.insertHTML(
              `<video width="600" height="240" controls><source src="${dados.path}"></video>`
            );
          } else {
            textArea.current.selection.insertHTML(
              `<img src="${
                dados.path
              }" style="max-width: 100%; height: auto; min-height: 100%; object-fit: cover; object-position: bottom; ${
                imagensCentralizadas ? 'display: block; margin: auto;' : ''
              }"/>`
            );
          }
        }
      },
    },
  };

  const onChangePadrao = () => {
    const texto = textArea?.current?.text?.trim();
    const temImagemOuVideo =
      (permiteVideo && textArea?.current?.value?.includes('<video')) ||
      textArea?.current?.value?.includes('<img');

    if (validarSeTemErro) {
      let valorParaValidar = '';

      if (temImagemOuVideo) {
        valorParaValidar = textArea.current.value;
      } else if (texto) {
        valorParaValidar = texto;
      }

      setValidacaoComErro(validarSeTemErro(valorParaValidar, texto));
    }

    if (texto || temImagemOuVideo) {
      changeHandler(textArea.current.value);
    } else {
      changeHandler('');
    }
  };

  const onChangeComForm = () => {
    const texto = textArea?.current?.text?.trim();
    let valorAtual = '';

    if (
      texto ||
      (permiteVideo && textArea?.current?.value?.includes('<video')) ||
      textArea?.current?.value?.includes('<img')
    ) {
      valorAtual = textArea.current.value;
    }

    changeHandler(valorAtual);
    form.setFieldValue(name, valorAtual);
    form.setFieldTouched(name, true, true);
  };

  const bloquearTraducaoNavegador = () => {
    const isEdge = navigator?.userAgent?.indexOf?.('Edg') !== -1;
    if (isEdge && textArea?.current) {
      const elementTextArea =
        textArea?.current?.editorDocument?.getElementsByClassName('jodit')?.[0];

      const elementBodyTextArea = elementTextArea
        ? elementTextArea.getElementsByTagName('body')[0]
        : null;
      if (elementBodyTextArea) {
        const childrens = elementBodyTextArea?.children;

        if (childrens?.length) {
          for (let index = 0; index < childrens.length; index++) {
            childrens[index].className = 'notranslate';
          }
        }
      }
    }
  };

  const beforeOnChange = () => {
    bloquearTraducaoNavegador();

    if (textArea?.current?.editorIsActive) {
      if (CHANGE_DEBOUNCE_FLAG) clearTimeout(CHANGE_DEBOUNCE_FLAG);

      CHANGE_DEBOUNCE_FLAG = setTimeout(() => {
        if (form) {
          onChangeComForm();
        } else {
          onChangePadrao();
        }
      }, 300);
    }
  };

  useEffect(() => {
    const pegarElemento = elemento => document.getElementsByClassName(elemento);
    const aplicarDisplayNone = elemento => {
      if (elemento?.length) {
        elemento[0].style.cssText = 'display: none !important';
      }
    };

    const removerBotoes = () => {
      const botaoEditarImagem = pegarElemento('jodit-toolbar-button_pencil');
      const botaoSetas = pegarElemento('jodit-toolbar-button_valign');

      aplicarDisplayNone(botaoEditarImagem);
      aplicarDisplayNone(botaoSetas);
    };

    document.body.addEventListener('DOMSubtreeModified', removerBotoes);

    return () => {
      document.body.removeEventListener('DOMSubtreeModified', removerBotoes);
    };
  });

  useEffect(() => {
    return () => {
      if (textArea?.current?.destruct) {
        textArea.current.destruct();
      }
    };
  }, [textArea]);

  useEffect(() => {
    if (url) {
      const element = textArea.current || '';
      if (textArea?.current && config) {
        if (textArea?.current?.type === 'textarea') {
          textArea.current = Jodit.make(element, config);
          const elementTextArea =
            textArea?.current?.editorDocument?.getElementsByClassName('jodit');

          if (elementTextArea?.style) {
            elementTextArea.style.cssText = 'overflow: auto;';
          }

          if (elementTextArea) {
            elementTextArea.translate = false;
            elementTextArea.className = `${elementTextArea.className} notranslate`;
          }

          if (ref) {
            if (typeof ref === 'function') {
              ref(textArea.current);
            } else {
              ref.current = textArea.current;
            }
          }

          textArea.current.events.on('beforePaste', e => {
            if (verificaSeTemSvg(e) || !verificaSePodeInserirArquivo(e)) {
              return false;
            }

            return true;
          });

          textArea.current.events.on('change', () => {
            beforeOnChange();
          });

          textArea.current.workplace.tabIndex = tabIndex;
        }
      }
    }
  }, [textArea, url]);

  useEffect(() => {
    if (textArea?.current?.setEditorValue) {
      validarUploadImagensExternasEBinarias(value, imagensCentralizadas).then(
        newValue => {
          textArea.current.setEditorValue(newValue);
        }
      );

      bloquearTraducaoNavegador();
    }
  }, [textArea, value]);

  useEffect(() => {
    if (config && textArea?.current && textArea?.current?.type !== 'textarea') {
      textArea.current.setReadOnly(desabilitar);
    }
  }, [desabilitar]);

  const possuiErro = () => {
    return (
      (form && form.errors[name] && form.touched[name]) ||
      temErro ||
      validacaoComErro
    );
  };

  let className = '';
  if (validacaoComErro || possuiErro()) {
    className = className + ' campo-invalido';
  }

  if (desabilitar) {
    className = className + ' desabilitar';
  }

  const editorComValidacoes = () => {
    return (
      <Campo>
        <div className={className}>
          <Field name={name} id={id} value={value}>
            {() => (
              <textarea ref={textArea} hidden={!textArea?.current?.isJodit} />
            )}
          </Field>
        </div>
      </Campo>
    );
  };

  const editorSemValidacoes = () => {
    return (
      <Campo>
        <div className={className}>
          <textarea
            id={id}
            ref={textArea}
            onChange={e => e}
            value={value || undefined}
            hidden={!textArea?.current?.isJodit}
          />
        </div>
      </Campo>
    );
  };

  const obterErros = () => {
    return (form && form.touched[name] && form.errors[name]) ||
      temErro ||
      validacaoComErro ? (
      <span style={{ color: `${Base.Vermelho}` }}>
        {(form && form.errors[name]) || mensagemErro}
      </span>
    ) : (
      <></>
    );
  };

  return (
    <>
      {label ? <Label text={label} isRequired={labelRequired} /> : <></>}
      {form ? editorComValidacoes() : editorSemValidacoes()}
      {obterErros()}
    </>
  );
});

JoditEditor.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  temErro: PropTypes.bool,
  height: PropTypes.string,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  tabIndex: PropTypes.number,
  desabilitar: PropTypes.bool,
  qtdMaxImg: PropTypes.number,
  permiteVideo: PropTypes.bool,
  labelRequired: PropTypes.bool,
  iframeStyle: PropTypes.string,
  mensagemErro: PropTypes.string,
  removerToolbar: PropTypes.bool,
  disablePlugins: PropTypes.string,
  validarSeTemErro: PropTypes.func,
  valideClipboardHTML: PropTypes.bool,
  imagensCentralizadas: PropTypes.bool,
  permiteInserirArquivo: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

JoditEditor.defaultProps = {
  name: '',
  label: '',
  value: '',
  form: null,
  tabIndex: -1,
  id: 'editor',
  onChange: null,
  height: 'auto',
  temErro: false,
  readonly: false,
  iframeStyle: '',
  qtdMaxImg: null,
  mensagemErro: '',
  desabilitar: false,
  disablePlugins: '',
  permiteVideo: true,
  labelRequired: false,
  removerToolbar: false,
  validarSeTemErro: null,
  valideClipboardHTML: false,
  imagensCentralizadas: false,
  permiteInserirArquivo: true,
};

export default JoditEditor;
